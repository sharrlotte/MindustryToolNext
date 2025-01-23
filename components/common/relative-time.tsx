import Tran from '@/components/common/tran';

type RelativeTimeProps = {
  className?: string;
  date: Date;
};

export function RelativeTime({ className, date }: RelativeTimeProps) {
  const now = Date.now();
  const target = typeof date === 'number' ? date : date.getTime();
  const delta = Math.floor((now - target) / 1000); // Difference in seconds

  if (delta < 60) {
    return <Tran className={className} text="second-ago" args={{ second: delta }} />;
  }

  if (delta < 3600) {
    const minute = Math.floor(delta / 60);
    return <Tran className={className} text="minute-ago" args={{ minute }} />;
  }

  if (delta < 86400) {
    const hour = Math.floor(delta / 3600);
    return <Tran className={className} text="hour-ago" args={{ hour }} />;
  }

  if (delta < 604800) {
    const day = Math.floor(delta / 86400);
    return <Tran className={className} text="day-ago" args={{ day }} />;
  }

  if (delta < 2592000) {
    const week = Math.floor(delta / 604800);
    return <Tran className={className} text="week-ago" args={{ week }} />;
  }

  if (delta < 31536000) {
    const month = Math.floor(delta / 2592000);
    return <Tran className={className} text="month-ago" args={{ month }} />;
  }

  const year = Math.floor(delta / 31536000);
  return <Tran className={className} text="year-ago" args={{ year }} />;
}
