import { useCallback } from 'react'
import { Node, Edge } from '@xyflow/react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import {
  Copy,
  Scissors,
  ClipboardText,
  Trash,
  CirclesThreePlus,
  Info,
  PencilSimple,
  Lock,
  LockOpen,
  Eye,
  EyeSlash,
  ArrowUUpLeft
} from '@phosphor-icons/react'

interface ContextMenuWrapperProps {
  children: React.ReactNode
  nodes: Node[]
  edges: Edge[]
  selectedNode: Node | null
  onCopy: () => void
  onCut: () => void
  onPaste: () => void
  onDelete: () => void
  onDuplicate: () => void
  onEditTitle: () => void
  onResize: () => void
  onToggleLock: () => void
  onToggleVisibility: () => void
  onShowInfo: () => void
  onCreateGroup: () => void
  onBreakConnection: () => void
}

export function ContextMenuWrapper({
  children,
  selectedNode,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onDuplicate,
  onEditTitle,
  onResize,
  onToggleLock,
  onToggleVisibility,
  onShowInfo,
  onCreateGroup,
  onBreakConnection
}: ContextMenuWrapperProps) {
  const isNodeSelected = !!selectedNode
  const isLocked = selectedNode?.data?.locked || false
  const isHidden = selectedNode?.data?.hidden || false

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64 bg-card border-border">
        {isNodeSelected && (
          <>
            <ContextMenuItem onClick={onEditTitle} className="gap-2">
              <PencilSimple size={16} />
              Edit Title
            </ContextMenuItem>
            <ContextMenuItem onClick={onShowInfo} className="gap-2">
              <Info size={16} />
              Information
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        
        <ContextMenuItem onClick={onCopy} disabled={!isNodeSelected} className="gap-2">
          <Copy size={16} />
          Copy
          <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span>
        </ContextMenuItem>
        
        <ContextMenuItem onClick={onCut} disabled={!isNodeSelected} className="gap-2">
          <Scissors size={16} />
          Cut
          <span className="ml-auto text-xs text-muted-foreground">Ctrl+X</span>
        </ContextMenuItem>
        
        <ContextMenuItem onClick={onPaste} className="gap-2">
          <ClipboardText size={16} />
          Paste
          <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
        </ContextMenuItem>
        
        {isNodeSelected && (
          <>
            <ContextMenuSeparator />
            
            <ContextMenuItem onClick={onDuplicate} className="gap-2">
              <CirclesThreePlus size={16} />
              Duplicate
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+D</span>
            </ContextMenuItem>
            
            <ContextMenuItem onClick={onDelete} className="gap-2 text-destructive">
              <Trash size={16} />
              Delete
              <span className="ml-auto text-xs text-muted-foreground">Del</span>
            </ContextMenuItem>
            
            <ContextMenuSeparator />
            
            <ContextMenuSub>
              <ContextMenuSubTrigger className="gap-2">
                <ArrowUUpLeft size={16} />
                Transform
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="bg-card border-border">
                <ContextMenuItem onClick={onResize} className="gap-2">
                  Resize
                </ContextMenuItem>
                <ContextMenuItem onClick={onToggleLock} className="gap-2">
                  {isLocked ? (
                    <>
                      <LockOpen size={16} />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      Lock Position
                    </>
                  )}
                </ContextMenuItem>
                <ContextMenuItem onClick={onToggleVisibility} className="gap-2">
                  {isHidden ? (
                    <>
                      <Eye size={16} />
                      Show
                    </>
                  ) : (
                    <>
                      <EyeSlash size={16} />
                      Hide
                    </>
                  )}
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            
            <ContextMenuSeparator />
            
            <ContextMenuItem onClick={onCreateGroup} className="gap-2">
              <CirclesThreePlus size={16} />
              Create Area
            </ContextMenuItem>
            
            <ContextMenuItem onClick={onBreakConnection} className="gap-2">
              <Scissors size={16} />
              Wait to Pass
            </ContextMenuItem>
          </>
        )}
        
        {!isNodeSelected && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem disabled className="text-muted-foreground text-xs">
              Right-click on a node for more options
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
