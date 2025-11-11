"""
Spectral Graph Methods Module

Implements spectral embeddings, eigenvalue solvers, and graph algorithms
using Lanczos, LOBPCG, and spectral sparsification.
"""

import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla
from typing import Tuple, List, Optional
from dataclasses import dataclass


@dataclass
class Eigenpair:
    """Eigenvalue and eigenvector pair"""
    eigenvalue: float
    eigenvector: np.ndarray


class LanczosEigenSolver:
    """
    Lanczos algorithm for symmetric eigenvalue problems.
    
    Efficiently computes a few eigenvalues and eigenvectors of large
    sparse symmetric matrices using Krylov subspace iteration.
    """
    
    def __init__(self, max_iterations: int = 100, tolerance: float = 1e-10):
        """
        Initialize Lanczos solver.
        
        Args:
            max_iterations: Maximum Lanczos iterations
            tolerance: Convergence tolerance
        """
        self.max_iterations = max_iterations
        self.tolerance = tolerance
        self.preconditioner = None
        
    def compute(self, A, k: int = 6, which: str = 'LM') -> List[Eigenpair]:
        """
        Compute k eigenvalues and eigenvectors.
        
        Args:
            A: Symmetric matrix (sparse or dense)
            k: Number of eigenvalues to compute
            which: Which eigenvalues ('LM'=largest magnitude, 'SM'=smallest, etc.)
            
        Returns:
            List of Eigenpair objects
        """
        # Convert to sparse if dense
        if isinstance(A, np.ndarray):
            A = sp.csr_matrix(A)
            
        # Use scipy's eigsh (which implements Lanczos internally)
        eigenvalues, eigenvectors = spla.eigsh(
            A, k=k, which=which, 
            maxiter=self.max_iterations,
            tol=self.tolerance,
            M=self.preconditioner
        )
        
        # Package results
        results = []
        for i in range(k):
            results.append(Eigenpair(
                eigenvalue=eigenvalues[i],
                eigenvector=eigenvectors[:, i]
            ))
            
        return results
    
    def set_preconditioner(self, P) -> None:
        """
        Set preconditioner for faster convergence.
        
        Args:
            P: Preconditioner matrix (should approximate A^-1)
        """
        self.preconditioner = P


class SpectralEmbedding:
    """
    Spectral graph embedding methods.
    
    Embeds graph nodes into low-dimensional space using eigenvectors
    of graph Laplacian.
    """
    
    def __init__(self, n_components: int = 2):
        """
        Initialize spectral embedding.
        
        Args:
            n_components: Number of embedding dimensions
        """
        self.n_components = n_components
        self.embedding_ = None
        
    def fit(self, adjacency_matrix: np.ndarray) -> np.ndarray:
        """
        Compute spectral embedding of graph.
        
        Args:
            adjacency_matrix: Graph adjacency matrix (n x n)
            
        Returns:
            Embedding matrix (n x n_components)
        """
        # Compute graph Laplacian: L = D - A
        A = adjacency_matrix
        degrees = np.array(A.sum(axis=1)).flatten()
        D = sp.diags(degrees)
        L = D - A
        
        # Compute smallest eigenvectors (skip first trivial one)
        solver = LanczosEigenSolver()
        eigenpairs = solver.compute(L, k=self.n_components + 1, which='SM')
        
        # Build embedding from eigenvectors 2 through k+1
        self.embedding_ = np.column_stack([
            ep.eigenvector for ep in eigenpairs[1:]
        ])
        
        return self.embedding_
    
    def transform(self, adjacency_matrix: np.ndarray) -> np.ndarray:
        """Compute embedding (alias for fit)"""
        return self.fit(adjacency_matrix)


class SpectralClustering:
    """
    Spectral clustering for community detection.
    
    Uses spectral embedding followed by k-means to detect communities
    in graphs.
    """
    
    def __init__(self, n_clusters: int = 2):
        """
        Initialize spectral clustering.
        
        Args:
            n_clusters: Number of clusters to find
        """
        self.n_clusters = n_clusters
        self.labels_ = None
        
    def fit_predict(self, adjacency_matrix: np.ndarray) -> np.ndarray:
        """
        Detect communities in graph.
        
        Args:
            adjacency_matrix: Graph adjacency matrix
            
        Returns:
            Cluster labels for each node
        """
        # Get spectral embedding
        embedding = SpectralEmbedding(n_components=self.n_clusters).fit(
            adjacency_matrix
        )
        
        # Apply k-means to embedding
        self.labels_ = self._kmeans(embedding, self.n_clusters)
        
        return self.labels_
    
    def _kmeans(self, X: np.ndarray, k: int, max_iters: int = 100) -> np.ndarray:
        """Simple k-means implementation"""
        n_samples = X.shape[0]
        
        # Initialize centroids randomly
        indices = np.random.choice(n_samples, k, replace=False)
        centroids = X[indices]
        
        labels = np.zeros(n_samples, dtype=int)
        
        for _ in range(max_iters):
            # Assign points to nearest centroid
            distances = np.linalg.norm(
                X[:, np.newaxis] - centroids[np.newaxis, :], 
                axis=2
            )
            new_labels = np.argmin(distances, axis=1)
            
            # Check convergence
            if np.all(labels == new_labels):
                break
                
            labels = new_labels
            
            # Update centroids
            for i in range(k):
                mask = labels == i
                if np.any(mask):
                    centroids[i] = X[mask].mean(axis=0)
                    
        return labels


class SpectralSparsifier:
    """
    Spectral sparsification of graphs.
    
    Creates a sparse approximation of a dense graph that preserves
    spectral properties (useful for large-scale graph algorithms).
    """
    
    def __init__(self, sparsity_factor: float = 0.1):
        """
        Initialize sparsifier.
        
        Args:
            sparsity_factor: Target fraction of edges to keep
        """
        self.sparsity_factor = sparsity_factor
        
    def sparsify(self, adjacency_matrix: np.ndarray) -> sp.csr_matrix:
        """
        Sparsify graph while preserving spectral properties.
        
        Args:
            adjacency_matrix: Dense adjacency matrix
            
        Returns:
            Sparse approximation
        """
        A = adjacency_matrix
        n = A.shape[0]
        
        # Compute edge effective resistances (approximate with degrees)
        degrees = A.sum(axis=1)
        
        # Sample edges with probability proportional to effective resistance
        # This is a simplified version; full algorithm uses resistance sampling
        target_edges = int(self.sparsity_factor * np.sum(A > 0) / 2)
        
        # Build sparse matrix
        row_idx = []
        col_idx = []
        data = []
        
        edges = np.argwhere(A > 0)
        n_edges = len(edges)
        
        # Sample edges
        if n_edges <= target_edges:
            return sp.csr_matrix(A)
            
        # Importance based on degree (simplified resistance)
        importance = np.array([
            1.0 / (degrees[i] + degrees[j]) 
            for i, j in edges
        ])
        importance /= importance.sum()
        
        # Sample with replacement
        sampled_indices = np.random.choice(
            n_edges, 
            size=target_edges, 
            replace=True,
            p=importance
        )
        
        # Build sparsified matrix
        for idx in sampled_indices:
            i, j = edges[idx]
            row_idx.append(i)
            col_idx.append(j)
            # Reweight to preserve expectation
            data.append(A[i, j] * n_edges / (target_edges * importance[idx]))
            
        sparse_A = sp.csr_matrix(
            (data, (row_idx, col_idx)), 
            shape=(n, n)
        )
        
        # Symmetrize
        sparse_A = (sparse_A + sparse_A.T) / 2
        
        return sparse_A


def compute_fiedler_vector(adjacency_matrix: np.ndarray) -> np.ndarray:
    """
    Compute Fiedler vector (2nd smallest eigenvector of Laplacian).
    
    Used for spectral bisection of graphs.
    
    Args:
        adjacency_matrix: Graph adjacency matrix
        
    Returns:
        Fiedler vector
    """
    embedding = SpectralEmbedding(n_components=1)
    return embedding.fit(adjacency_matrix).flatten()


def spectral_bisection(adjacency_matrix: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
    """
    Bisect graph using Fiedler vector.
    
    Args:
        adjacency_matrix: Graph adjacency matrix
        
    Returns:
        (partition1_indices, partition2_indices)
    """
    fiedler = compute_fiedler_vector(adjacency_matrix)
    
    # Partition by sign of Fiedler vector
    partition1 = np.where(fiedler >= 0)[0]
    partition2 = np.where(fiedler < 0)[0]
    
    return partition1, partition2


# Example usage and testing
if __name__ == "__main__":
    print("Testing Spectral Graph Methods...")
    
    # Create a simple graph with communities
    n = 100
    # Two communities
    A = np.zeros((n, n))
    
    # Intra-community edges (dense)
    for i in range(50):
        for j in range(i + 1, 50):
            if np.random.rand() < 0.3:
                A[i, j] = A[j, i] = 1
                
    for i in range(50, 100):
        for j in range(i + 1, 100):
            if np.random.rand() < 0.3:
                A[i, j] = A[j, i] = 1
    
    # Inter-community edges (sparse)
    for i in range(50):
        for j in range(50, 100):
            if np.random.rand() < 0.05:
                A[i, j] = A[j, i] = 1
    
    # Test spectral clustering
    clustering = SpectralClustering(n_clusters=2)
    labels = clustering.fit_predict(A)
    
    print(f"Detected {len(np.unique(labels))} communities")
    print(f"Community sizes: {np.bincount(labels)}")
    
    # Test spectral embedding
    embedding = SpectralEmbedding(n_components=2)
    coords = embedding.fit(A)
    print(f"Embedding shape: {coords.shape}")
    
    # Test sparsification
    sparsifier = SpectralSparsifier(sparsity_factor=0.2)
    sparse_A = sparsifier.sparsify(A)
    print(f"Original edges: {np.sum(A > 0) // 2}")
    print(f"Sparsified edges: {sparse_A.nnz // 2}")
    
    print("Spectral methods module loaded successfully!")
