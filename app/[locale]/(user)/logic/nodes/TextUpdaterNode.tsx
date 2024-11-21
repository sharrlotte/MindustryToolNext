import { Handle, Position } from 'reactflow';

interface TextUpdaterNodeProps {
  data: any;
  isConnectable: boolean;
}

const TextUpdaterNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  return (
    <div className="p-2.5  border border-[#1a192b] rounded min-w-[150px] bg-white text-xs">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex flex-col gap-2 text-black">
        <label htmlFor="text">{data.label}:</label>
        <input
          id="text"
          name="text"
          value={data.value}
          className="nodrag  bg-white block w-full rounded-md border-0 px-3 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 outline-none"
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
};

export default TextUpdaterNode;
