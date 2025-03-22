import { MindustryToolIcon } from '@/components/common/icons';
import env from '@/constant/env';

export default function NavHeader() {
  return (
    <h1 className="text-xl font-medium flex gap-2 items-center p-0">
      <MindustryToolIcon className="size-9" height={36} width={36} />
      <div className="flex flex-col">
        <span>MindustryTool</span>
        <span className="overflow-hidden whitespace-nowrap text-xs">{env.webVersion}</span>
      </div>
    </h1>
  );
}
