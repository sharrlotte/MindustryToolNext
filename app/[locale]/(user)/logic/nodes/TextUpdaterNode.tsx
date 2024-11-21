import { Handle, Position } from 'reactflow';

interface TextUpdaterNodeProps {
  data: any;
  isConnectable: boolean;
}

export const TextUpdaterNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return (
    <div className="p-1.5  border border-[#1a192b] rounded min-w-[150px] bg-white text-xs">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex flex-col gap-1 text-black">
        <label htmlFor="text">{data.label}:</label>
        <input
          value={data.value}
          className="nodrag bg-black text-white block w-full rounded border-0 px-3 py-1.5  placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm/6 outline-none"
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
};

export const SetNode: React.FC<TextUpdaterNodeProps> = ({ isConnectable }) => {
  return (
    <div className="p-1.5  border border-[#1a192b] rounded min-w-[150px] bg-white text-xs">
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
      <div className="flex flex-col gap-1 text-black">
        <p>Set</p>
        <div className="bg-black gap-1 flex items-center w-fit">
          <input
            value={'resuit'}
            className="nodrag bg-black text-white block rounded border-0 px-3 py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm/6 outline-none underline"
            style={{ width: `${'resuit'.length + 1}ch`, textDecoration: 'underline white' }}
          />
          <p className="text-white">=</p>
          <input
            value={'0'}
            className="nodrag bg-black text-white block rounded border-0 px-3 py-1.5 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm/6 outline-none underline"
            size={1}
            style={{ textDecoration: 'underline white' }}
          />
        </div>
      </div>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
    </div>
  );
};
