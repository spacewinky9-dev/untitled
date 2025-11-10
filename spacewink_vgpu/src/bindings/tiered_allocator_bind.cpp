#include <pybind11/pybind11.h>
#include <pybind11/numpy.h>
#include <pybind11/stl.h>
#include "../cpp/runtime/tiered_allocator.h"
#include "../cpp/runtime/spill_manager.h"
#include "../cpp/runtime/memory_pool.h"

namespace py = pybind11;

void bind_tiered_allocator(py::module& m) {
    // Memory tier enum
    py::enum_<MemoryTier>(m, "MemoryTier")
        .value("RAM", MemoryTier::RAM)
        .value("VRAM", MemoryTier::VRAM)
        .value("VSSD", MemoryTier::VSSD)
        .export_values();
    
    // TieredAllocator class
    py::class_<TieredAllocator>(m, "TieredAllocator")
        .def(py::init<size_t>(), py::arg("ram_limit_bytes") = 16ULL * 1024 * 1024 * 1024)
        .def("allocate", &TieredAllocator::allocate, 
             py::arg("size"), py::arg("tier") = MemoryTier::RAM)
        .def("deallocate", &TieredAllocator::deallocate, py::arg("ptr"))
        .def("get_pointer", &TieredAllocator::get_pointer, py::arg("ptr"))
        .def("promote", &TieredAllocator::promote, py::arg("ptr"), py::arg("target_tier"))
        .def("demote", &TieredAllocator::demote, py::arg("ptr"), py::arg("target_tier"))
        .def("pin_memory", &TieredAllocator::pin_memory, py::arg("ptr"))
        .def("unpin_memory", &TieredAllocator::unpin_memory, py::arg("ptr"))
        .def("get_stats", [](TieredAllocator& self) {
            auto stats = self.get_stats();
            py::dict d;
            d["ram_used_bytes"] = stats.ram_used;
            d["ram_used_gb"] = stats.ram_used / (1024.0 * 1024.0 * 1024.0);
            d["vram_used_bytes"] = stats.vram_used;
            d["vram_used_gb"] = stats.vram_used / (1024.0 * 1024.0 * 1024.0);
            d["vssd_used_bytes"] = stats.vssd_used;
            d["vssd_used_gb"] = stats.vssd_used / (1024.0 * 1024.0 * 1024.0);
            d["total_allocations"] = stats.total_allocations;
            d["total_spills"] = stats.total_spills;
            d["total_promotions"] = stats.total_promotions;
            return d;
        })
        .def("__enter__", [](TieredAllocator& self) { return &self; })
        .def("__exit__", [](TieredAllocator& self, py::object, py::object, py::object) {});
    
    // SpillManager class
    py::class_<SpillManager>(m, "SpillManager")
        .def(py::init<size_t>(), py::arg("num_workers") = 2)
        .def("submit_spill", [](SpillManager& self, uintptr_t src, uintptr_t dst, size_t size) {
            self.submit_spill(reinterpret_cast<void*>(src), reinterpret_cast<void*>(dst), size, nullptr, 0);
        }, py::arg("src"), py::arg("dst"), py::arg("size"))
        .def("wait_all", &SpillManager::wait_all)
        .def("shutdown", &SpillManager::shutdown)
        .def("get_pending_count", &SpillManager::get_pending_count);
    
    // VRAMPool class
    py::class_<VRAMPool>(m, "VRAMPool")
        .def(py::init<size_t>(), py::arg("max_size_bytes") = 32ULL * 1024 * 1024 * 1024)
        .def("allocate", [](VRAMPool& self, size_t size) {
            return reinterpret_cast<uintptr_t>(self.allocate(size));
        }, py::arg("size"))
        .def("deallocate", [](VRAMPool& self, uintptr_t ptr) {
            self.deallocate(reinterpret_cast<void*>(ptr));
        }, py::arg("ptr"))
        .def("get_used_bytes", &VRAMPool::get_used_bytes)
        .def("get_free_bytes", &VRAMPool::get_free_bytes);
    
    // VSSDPool class
    py::class_<VSSDPool>(m, "VSSDPool")
        .def(py::init<size_t>(), py::arg("max_size_bytes") = 100ULL * 1024 * 1024 * 1024)
        .def("allocate", [](VSSDPool& self, size_t size) {
            return reinterpret_cast<uintptr_t>(self.allocate(size));
        }, py::arg("size"))
        .def("deallocate", [](VSSDPool& self, uintptr_t ptr) {
            self.deallocate(reinterpret_cast<void*>(ptr));
        }, py::arg("ptr"))
        .def("get_used_bytes", &VSSDPool::get_used_bytes);
}
