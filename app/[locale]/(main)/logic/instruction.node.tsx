
import { InferStateType, ItemsType, NodeData, NodeItem } from '@/app/[locale]/(main)/logic/node';
import { OutputHandle } from '@/app/[locale]/(main)/logic/output-handle';

import ComboBox from '@/components/common/combo-box';

import { cn } from '@/lib/utils';

import { Handle, Node, Position } from '@xyflow/react';
import { instructionNodes, useLogicEditor } from '@/app/[locale]/(main)/logic/logic-editor-context';


export type InstructionNodeData<T extends (keyof typeof instructionNodes)[number] = (keyof typeof instructionNodes)[number]> = {
  data: { type: T; index?: number; node: NodeData; state: InferStateType<(typeof instructionNodes)[T]['items']> };
  isConnectable?: boolean;
  type: 'instruction';
  id: string
};

export type InstructionNode = Omit<Node, 'data' | 'type'> & InstructionNodeData;

export default function InstructionNodeComponent({ id, data }: InstructionNodeData) {
  const { state, node } = data
  const { label, color, inputs, outputs, items, condition } = node;

  const { setNodeState } = useLogicEditor()

  return (
    <div
      className={cn('p-1.5 rounded-sm text-white w-[220px] min-h-[80px] sm:w-[330px] md:w-[440px] lg:[w-550px]', {
        'w-fit min-h-0 sm:w-fit md:w-fit lg:w-fit px-6': items.length === 0,
      })}
      style={{ backgroundColor: color }}
    >
      {Array(inputs)
        .fill(1)
        .map((_, i) => (
          <Handle style={{ marginLeft: 20 * i - ((inputs - 1) / 2) * 20 + 'px' }} key={i} type={'target'} position={Position.Top} isConnectable={true} />
        ))}
      {outputs.map((output, i) => (
        <OutputHandle id={`${id}-source-handle-${i}`} style={{ marginLeft: 20 * i - ((outputs.length - 1) / 2) * 20 + 'px' }} label={output.label} key={i} type={'source'} position={Position.Bottom} />
      ))}
      <div
        className={cn('flex justify-between text-sm font-bold', {
          'w-full h-full items-center justify-center m-auto text-xl align-middle': items.length === 0,
        })}
      >
        <span>{label}</span>
        <span>{data.index}</span>
      </div>
      {items.length > 0 && (
        <div className="bg-black p-2 rounded-sm flex gap-1 items-end jus flex-wrap">
          {items.map((item, i) => (
            <NodeItemComponent key={i} color={color} data={item} state={state} setState={(state) => setNodeState(id, (prev) => ({ ...prev, ...state }))} condition={'name' in item ? condition?.[item.name] : undefined} />
          ))}
        </div>
      )}
    </div>
  );
}

function NodeItemComponent({
  color,
  data,
  condition,
  state,
  setState,
}: {
  color: string;
  state: InferStateType<ItemsType>;
  setState: (data: InferStateType<ItemsType>) => void;
  data: NodeItem;
  condition?: (data: InferStateType<ItemsType>) => boolean;
}) {
  const canRender = condition ? condition(state) : true;

  if (!canRender) {
    return <></>;
  }

  if (data.type === 'input') {
    return (
      <div className="flex gap-1 w-40">
        {data.label && <span className="border-transparent border-b-[3px]">{data.label}</span>}
        <input
          className="bg-transparent border-b-[3px] px-2 hover min-w-20 max-w-40 sm:max-w-80 focus:outline-none" //
          style={{ borderColor: color }}
          type="text"
          value={state[data.name] ?? data.value ?? ''}
          onChange={(e) => setState({ ...state, [data.name]: e.target.value })}
        />
      </div>
    );
  }

  if (data.type === 'option') {
    return (
      <div className="bg-transparent border-b-[3px] flex items-end" style={{ borderColor: color }}>
        <ComboBox
          className="bg-transparent px-2 py-0 text-center w-fit font-bold border-transparent items-end justify-end"
          value={{ value: state[data.name], label: state[data.name].toString() }}
          values={data.options.map((option) => ({ value: option, label: option.toString() }))}
          onChange={(value) => {
            if (value) setState({ ...state, [data.name]: value });
          }}
          searchBar={false}
          chevron={false}
        />
      </div>
    );
  }

  if (data.type === 'label') {
    return <span className="border-transparent border-b-[3px]">{data.value}</span>;
  }
}
