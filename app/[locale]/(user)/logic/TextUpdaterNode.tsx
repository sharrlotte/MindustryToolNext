import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

interface TextUpdaterNodeProps {
  data: any;
  isConnectable: boolean;
}

const TextUpdaterNode: React.FC<TextUpdaterNodeProps> = ({ data, isConnectable }) => {
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="p-2.5  border-2 bg-white ">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className="flex flex-col gap-2">
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
};

export default TextUpdaterNode;
