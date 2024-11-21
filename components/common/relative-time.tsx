import Moment from 'react-moment';

type RelativeTimeProps = {
  className?: string;
  date: Date;
};

export function RelativeTime({ className, date }: RelativeTimeProps) {
  return (
    <Moment className={className} fromNow>
      {date}
    </Moment>
  );
}
