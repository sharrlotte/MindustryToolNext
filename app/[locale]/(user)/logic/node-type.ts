import { MlogNode } from '@/app/[locale]/(user)/logic/node';
import {
  ControlNode,
  DrawFlushNode,
  DrawNode,
  EndNode,
  GetLinkNode,
  JumpNode,
  LookUpNode,
  OperationNode,
  PackColorNode,
  PrintFlushNode,
  PrintNode,
  RadarNode,
  ReadNode,
  SensorNode,
  SetNode,
  StopNode,
  TextUpdaterNode,
  UnitBindNode,
  UnitControlNode,
  UnitLocateNode,
  UnitRadarNode,
  WaitNode,
  WriteNode,
} from '@/app/[locale]/(user)/logic/nodes/node-types';

export const nodeTypes = {
  mlog: MlogNode,
  textUpdater: TextUpdaterNode,
  waitNode: WaitNode,
  stopNode: StopNode,
  endNode: EndNode,
  jumpNode: JumpNode,
  setNode: SetNode,
  operationNode: OperationNode,
  lookUpNode: LookUpNode,
  packColorNode: PackColorNode,
  sensorNode: SensorNode,
  controlNode: ControlNode,
  radarNode: RadarNode,
  printFlushNode: PrintFlushNode,
  drawFlushNode: DrawFlushNode,
  getLinkNode: GetLinkNode,
  unitBindNode: UnitBindNode,
  unitControlNode: UnitControlNode,
  unitRadarNode: UnitRadarNode,
  unitLocateNode: UnitLocateNode,
  readNode: ReadNode,
  writeNode: WriteNode,
  drawNode: DrawNode,
  printNode: PrintNode,
} as const;

export type NodeType = keyof typeof nodeTypes;
