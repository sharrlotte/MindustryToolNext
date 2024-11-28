import { Handle, Position } from 'reactflow';

interface TextUpdaterNodeProps {
  data: any;
  isConnectable: boolean;
  children?: React.ReactNode;
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

const NodeContainer: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable, children }) => (
  <div className="p-1.5 border border-[#1a192b] rounded bg-white text-xs">
    <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
    <div className="flex flex-col gap-1 text-black">
      <div className="w-full flex justify-between items-center">
        <p>{data.label || 'Node'}:</p>
        <p>{data.id}</p>
      </div>
      {children}
    </div>
    <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
  </div>
);

export const TextUpdaterNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black rounded px-3 min-w-[150px]" onClick={() => document.getElementById(`input-${data.id}`)?.focus()}>
      <input id={`input-${data.id}`} value={data.value} className="nodrag bg-black text-white block w-full rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
    </div>
  </NodeContainer>
);

//! add more 1 handle node
export const JumpNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <p className="text-white pl-3">if</p>
      <div className="px-3" onClick={() => document.getElementById(`input-left-${data.id}`)?.focus()}>
        <input id={`input-left-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white">=</p>
      <div className="px-3" onClick={() => document.getElementById(`input-right-${data.id}`)?.focus()}>
        <input id={`input-right-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
    </div>
  </NodeContainer>
);

export const SetNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <div className="px-3" onClick={() => document.getElementById(`input-left-${data.id}`)?.focus()}>
        <input id={`input-left-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white">=</p>
      <div className="px-3" onClick={() => document.getElementById(`input-right-${data.id}`)?.focus()}>
        <input id={`input-right-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
    </div>
  </NodeContainer>
);

export const OperationNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <div className="px-3" onClick={() => document.getElementById(`input-left-${data.id}`)?.focus()}>
        <input id={`input-left-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white">=</p>
      <div className="px-3" onClick={() => document.getElementById(`input-right-left-${data.id}`)?.focus()}>
        <input id={`input-right-left-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white">-</p>
      <div className="px-3" onClick={() => document.getElementById(`input-right-middle-${data.id}`)?.focus()}>
        <input id={`input-right-middle-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white">-</p>
      <div className="px-3" onClick={() => document.getElementById(`input-right-right-${data.id}`)?.focus()}>
        <input id={`input-right-right-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
    </div>
  </NodeContainer>
);

export const WaitNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <div className="px-3" onClick={() => document.getElementById(`input-left-${data.id}`)?.focus()}>
        <input id={`input-left-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white">sec</p>
    </div>
  </NodeContainer>
);

export const StopNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded"></div>
  </NodeContainer>
);

//! remove 1 handle node
export const EndNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded"></div>
  </NodeContainer>
);

export const LookUpNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <div className="px-3" onClick={() => document.getElementById(`input-left-${data.id}`)?.focus()}>
        <input id={`input-left-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white">= lookup</p>
      <div className="px-3" onClick={() => document.getElementById(`input-right-left-${data.id}`)?.focus()}>
        <input id={`input-right-left-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white">#</p>
      <div className="px-3" onClick={() => document.getElementById(`input-right-left-${data.id}`)?.focus()}>
        <input id={`input-right-left-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
    </div>
  </NodeContainer>
);
export const PackColorNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const SensorNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const ControlNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const RadarNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const PrintFlushNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const DrawFlushNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const GetLinkNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const UnitBindNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const UnitControlNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const UnitRadarNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const UnitLocateNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const ReadNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const WriteNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const DrawNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
export const PrintNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
