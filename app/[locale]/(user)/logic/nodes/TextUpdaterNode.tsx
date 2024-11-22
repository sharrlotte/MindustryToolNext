import { Handle, Position } from 'reactflow';

interface TextUpdaterNodeProps {
  data: any;
  isConnectable: boolean;
}

const adjustInputWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
  const tempSpan = document.createElement('span');
  tempSpan.style.visibility = 'hidden';
  tempSpan.style.position = 'absolute';
  tempSpan.style.whiteSpace = 'pre';
  tempSpan.textContent = e.target.value || ' ';
  document.body.appendChild(tempSpan);
  e.target.style.width = `${tempSpan.offsetWidth}px`;
  document.body.removeChild(tempSpan);
};

//#region placeholder

export const TextUpdaterNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return (
    <div className="p-1.5 border border-[#1a192b] rounded min-w-[150px] bg-white text-xs">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex flex-col gap-1 text-black">
        <div className="w-full flex justify-between items-center">
          <p>{data.label}:</p>
          <p>{data.id}</p>
        </div>
        <input value={data.value} className="nodrag bg-black text-white block w-full rounded border-0 px-3 py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" />
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
};

//#region Flow Control

export const WaitNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const StopNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const EndNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const JumpNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

//#region Operations

export const SetNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return (
    <div className="p-1.5 border border-[#1a192b] rounded bg-white text-xs">
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
      <div className="flex flex-col gap-1 text-black">
        <div className="w-full flex justify-between items-center">
          <p>Set</p>
          <p>{data.id}</p>
        </div>
        <div className="bg-black flex items-center rounded">
          <div className="px-3">
            <input
              type="text"
              className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none"
              onChange={adjustInputWidth}
            />
          </div>
          <p className="text-white">=</p>
          <div className="px-3">
            <input
              type="text"
              className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none"
              onChange={adjustInputWidth}
            />
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
    </div>
  );
};

export const OperationNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const LookUpNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const PackColorNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

//#region Block Control

export const SensorNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const ControlNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const RadarNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const PrintFlushNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const DrawFlushNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const GetLinkNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

//#region Unit Control

export const UnitBindNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const UnitControlNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const UnitRadarNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

export const UnitLocateNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};

//#region Input & Output

export const ReadNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};
export const WriteNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};
export const DrawNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};
export const PrintNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return <></>;
};
