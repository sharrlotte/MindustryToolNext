const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = 1000 * 60 * 60;
const ONE_DAY = ONE_HOUR * 24;

function getRelativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  return diff < ONE_MINUTE ? '' : diff > ONE_DAY ? date.toLocaleString() : date.toLocaleTimeString();
}

type RelativeTimeProps = {
  className?: string;
  date: Date;
};

export function RelativeTime({ className, date }: RelativeTimeProps) {
  return <span className={className}>{getRelativeTime(date)}</span>;
}
