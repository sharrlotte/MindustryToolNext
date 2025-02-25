'use client';

import { AnimatePresence, motion } from 'framer-motion';

import ErrorMessage from '@/components/common/error-message';
import { XIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/loading-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import Divider from '@/components/ui/divider';
import { toast } from '@/components/ui/sonner';
import IdUserCard from '@/components/user/id-user-card';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { deleteServerAdmin, getServerAdmin } from '@/query/server';
import ServerAdmin from '@/types/response/ServerAdmin';

import { useMutation, useQuery } from '@tanstack/react-query';

type Props = {
  id: string;
};

export default function PageClient({ id }: Props) {
  return (
    <AnimatePresence>
      <div className="bg-card p-4 space-y-2 h-full overflow-hidden flex flex-col">
        <h1 className="text-xl">
          <Tran asChild text="admin" />
        </h1>
        <Divider />
        <ServerAdminList id={id} />
      </div>
    </AnimatePresence>
  );
}

type ServerAdminListProps = {
  id: string;
};
function ServerAdminList({ id }: ServerAdminListProps) {
  const axios = useClientApi();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['server', id, 'admin'],
    queryFn: async () => getServerAdmin(axios, id),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  return <ScrollContainer className="flex flex-wrap gap-2">{data?.map((admin) => <ServerAdminCard key={admin.id} id={id} admin={admin} />)}</ScrollContainer>;
}

type ServerAdminCardProps = {
  id: string;
  admin: ServerAdmin;
};

function ServerAdminCard({ id, admin }: ServerAdminCardProps) {
  const axios = useClientApi();

  const { invalidateByKey } = useQueriesData();
  const { mutate, isPending, isIdle } = useMutation({
    mutationFn: async () => deleteServerAdmin(axios, id, admin.id),
    onError: (error) => toast.error(<Tran text="error" />, { description: error?.message }),
    onSettled: () => invalidateByKey(['server']),
  });

  return (
    <motion.div layout className="group h-fit cursor-pointer bg-secondary rounded-md p-2 gap-4 flex justify-between items-center" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
      <IdUserCard id={admin.userId} />
      <div onClick={() => mutate()}>
        {isIdle && <XIcon className="group-hover:opacity-100 opacity-0 group-focus:opacity-100 text-destructive" />}
        {isPending && <LoadingSpinner className="m-0" />}
      </div>
    </motion.div>
  );
}
