import React from 'react';
import { Handle, Position } from 'reactflow';

import { cn } from '@/lib/utils';

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

const NodeContainer: React.FC<TextUpdaterNodeProps & { positions?: Position[]; className?: string }> = ({ data, isConnectable, children, positions = [Position.Top, Position.Bottom], className = '' }) => (
  <div className={cn('p-1.5 border border-[#1a192b] rounded bg-white text-xs', className)}>
    <div className="flex flex-col gap-1 text-black">
      <div className="w-full flex justify-between items-center">
        <p>{data.label || 'Node'}:</p>
        <p>{data.id}</p>
      </div>
      {children}
    </div>
    {positions.map((position) => (
      <Handle key={position} type={position === Position.Top ? 'target' : 'source'} position={position} isConnectable={isConnectable} />
    ))}
  </div>
);

const TextUpdaterNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black rounded px-3 min-w-[150px]" onClick={() => document.getElementById(`input-${data.id}`)?.focus()}>
      <input id={`input-${data.id}`} value={data.value} className="nodrag bg-black text-white block w-full rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
    </div>
  </NodeContainer>
);

const JumpNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable} positions={[Position.Top, Position.Left, Position.Right]}>
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

const SetNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
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

const OperationNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      {['left', 'right-left', 'right-middle', 'right-right'].map((suffix, index) => (
        <React.Fragment key={suffix}>
          {index > 0 && <p className="text-white">{index === 1 ? '=' : '|'}</p>}
          <div className="px-3" onClick={() => document.getElementById(`input-${suffix}-${data.id}`)?.focus()}>
            <input id={`input-${suffix}-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
          </div>
        </React.Fragment>
      ))}
    </div>
  </NodeContainer>
);

const WaitNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <div className="px-3" onClick={() => document.getElementById(`input-left-${data.id}`)?.focus()}>
        <input id={`input-left-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white pr-3">sec</p>
    </div>
  </NodeContainer>
);

const StopNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <NodeContainer data={data} isConnectable={isConnectable} className="w-[120px]" />;

const EndNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <NodeContainer data={data} isConnectable={isConnectable} positions={[Position.Top]} className="w-[120px]" />;

const LookUpNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
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
      <div className="px-3" onClick={() => document.getElementById(`input-right-right-${data.id}`)?.focus()}>
        <input id={`input-right-right-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
    </div>
  </NodeContainer>
);

const PackColorNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      {['left', 'one', 'two', 'three', 'four'].map((suffix, index) => (
        <React.Fragment key={suffix}>
          {index > 0 && <p className="text-white">{index === 1 ? '= pack' : '|'}</p>}
          <div className="px-3" onClick={() => document.getElementById(`input-${suffix}-${data.id}`)?.focus()}>
            <input id={`input-${suffix}-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
          </div>
        </React.Fragment>
      ))}
    </div>
  </NodeContainer>
);
const SensorNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <div className="px-3" onClick={() => document.getElementById(`input-left-${data.id}`)?.focus()}>
        <input id={`input-left-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white">=</p>
      <div className="px-3" onClick={() => document.getElementById(`input-one-${data.id}`)?.focus()}>
        <input id={`input-one-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white">in</p>
      <div className="px-3" onClick={() => document.getElementById(`input-two-${data.id}`)?.focus()}>
        <input id={`input-two-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
    </div>
  </NodeContainer>
);
const ControlNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <p className="text-white pl-3">set</p>
      <div className="px-3" onClick={() => document.getElementById(`input-left-${data.id}`)?.focus()}>
        <input id={`input-left-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white">of</p>
      <div className="px-3" onClick={() => document.getElementById(`input-one-${data.id}`)?.focus()}>
        <input id={`input-one-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white">to</p>
      <div className="px-3" onClick={() => document.getElementById(`input-two-${data.id}`)?.focus()}>
        <input id={`input-two-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
    </div>
  </NodeContainer>
);
const RadarNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex flex-col justify-center rounded pl-3">
      <div className="flex items-center">
        {['left', 'one', 'two', 'three', 'four'].map((suffix, index) => (
          <React.Fragment key={suffix}>
            {index > 0 && <p className="text-white">{index === 1 ? 'target' : 'and'}</p>}
            <div className="px-3" onClick={() => document.getElementById(`input-${suffix}-${data.id}`)?.focus()}>
              <input id={`input-${suffix}-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
            </div>
          </React.Fragment>
        ))}
        <p className="text-white">other</p>
        <div className="px-3" onClick={() => document.getElementById(`input-four-${data.id}`)?.focus()}>
          <input id={`input-four-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
        </div>
      </div>
      <div className="flex items-center">
        <p className="text-white">sort</p>
        <div className="px-3" onClick={() => document.getElementById(`input-five-${data.id}`)?.focus()}>
          <input id={`input-five-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
        </div>
        <p className="text-white">output</p>
        <div className="px-3" onClick={() => document.getElementById(`input-six-${data.id}`)?.focus()}>
          <input id={`input-six-${data.id}`} type="text" className="nodrag w-7 bg-black rounded text-white block py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
        </div>
      </div>
    </div>
  </NodeContainer>
);
const PrintFlushNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <p className="text-white pl-3">set</p>
      <div className="px-3" onClick={() => document.getElementById(`input-left-${data.id}`)?.focus()}>
        <input id={`input-left-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
    </div>
  </NodeContainer>
);
const DrawFlushNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <p className="text-white pl-3">set</p>
      <div className="px-3" onClick={() => document.getElementById(`input-left-${data.id}`)?.focus()}>
        <input id={`input-left-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
    </div>
  </NodeContainer>
);
const GetLinkNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <div className="px-3" onClick={() => document.getElementById(`input-left-${data.id}`)?.focus()}>
        <input id={`input-left-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white ">= link#</p>
      <div className="px-3" onClick={() => document.getElementById(`input-right-${data.id}`)?.focus()}>
        <input id={`input-right-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
    </div>
  </NodeContainer>
);
const UnitBindNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <p className="text-white pl-3">type</p>
      <div className="px-3" onClick={() => document.getElementById(`input-right-${data.id}`)?.focus()}>
        <input id={`input-right-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
    </div>
  </NodeContainer>
);
const UnitControlNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => (
  <NodeContainer data={data} isConnectable={isConnectable}>
    <div className="bg-black flex items-center rounded">
      <p className="text-white pl-3">move</p>
      <div className="px-3" onClick={() => document.getElementById(`input-right-${data.id}`)?.focus()}>
        <input id={`input-right-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white ">x</p>
      <div className="px-3" onClick={() => document.getElementById(`input-one-${data.id}`)?.focus()}>
        <input id={`input-one-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
      <p className="text-white ">y</p>
      <div className="px-3" onClick={() => document.getElementById(`input-two-${data.id}`)?.focus()}>
        <input id={`input-two-${data.id}`} type="text" className="nodrag bg-black text-white block w-7 rounded py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm outline-none" onChange={adjustInputWidth} />
      </div>
    </div>
  </NodeContainer>
);
const UnitRadarNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
const UnitLocateNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
const ReadNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
const WriteNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
const DrawNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;
const PrintNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => <></>;

export {
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
};
