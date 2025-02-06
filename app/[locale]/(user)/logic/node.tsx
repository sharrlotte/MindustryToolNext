// Compile -> Turn node to mlog
// Drag and drop
// Undo, Redo changes
// If else node
// Switch case node
// Node block/Function
// Loops
// Comments node
// Node index
// Save node state to local storage
// Save nodes as function
// Validate nodes
// Autocomplete

type NodeData = string;

export interface INode {
  data: NodeData[];
  isConnectable: boolean;

  compile(): string;
}
