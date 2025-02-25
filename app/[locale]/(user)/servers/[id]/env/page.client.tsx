'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import DeleteButton from '@/components/button/delete-button';
import ErrorMessage from '@/components/common/error-message';
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from '@/components/common/icons';
import LoadingSpinner from '@/components/common/router-spinner';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import Divider from '@/components/ui/divider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

import useClientApi from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { CreateServerEnvSchema, createServerEnv, deleteServerEnv, getServerEnv } from '@/query/server';
import ServerEnv from '@/types/response/ServerEnv';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';

type Props = {
  id: string;
};
export default function PageClient({ id }: Props) {
  return (
    <div className="bg-card p-4 space-y-2 h-full overflow-hidden flex flex-col">
      <h1 className="text-xl">
        <Tran asChild text="env" />
      </h1>
      <p className="text-muted-foreground text-sm">
        <Tran asChild text="server.env-description" />
      </p>
      <Divider />
      <ScrollContainer className="space-y-2">
        <ServerEnvList id={id} />
        <Divider />
        <Tran text="server.add-env" />
        <AddEnvCard id={id} />
      </ScrollContainer>
    </div>
  );
}

type ServerEnvListProps = {
  id: string;
};
function ServerEnvList({ id }: ServerEnvListProps) {
  const axios = useClientApi();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['server', id, 'env'],
    queryFn: async () => getServerEnv(axios, id),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage error={error} />;
  }

  return <AnimatePresence>{data?.map((env) => <ServerEnvCard key={env.id} id={id} env={env} />)}</AnimatePresence>;
}

type ServerEnvCardProps = {
  id: string;
  env: ServerEnv;
};

function ServerEnvCard({ id, env }: ServerEnvCardProps) {
  const axios = useClientApi();
  const [show, setShow] = useState(false);
  const form = useForm<z.infer<typeof CreateServerEnvSchema>>({
    resolver: zodResolver(CreateServerEnvSchema),
    defaultValues: env,
  });

  const { invalidateByKey } = useQueriesData();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => deleteServerEnv(axios, id, env.id),
    onError: (error) => toast.error(<Tran text="error" />, { description: error?.message }),
    onSuccess: () => {
      form.reset();
    },
    onSettled: () => invalidateByKey(['server']),
  });

  return (
    <motion.div key={env.id} className="group h-fit cursor-pointer flex justify-between items-center gap-2" initial={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 500 }} transition={{ duration: 0.5 }}>
      <Form {...form}>
        <form className="flex gap-2 sm:items-center flex-col sm:flex-row items-start w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full md:max-w-80">
                <FormControl>
                  <Input placeholder="GITHUB_KEY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="border-border border rounded-md flex items-center gap-2 h-9">
                    {show ? <Input className="w-full border-none" key="input" placeholder="ghp_awdguyagwdygawdagwiy" {...field} /> : <Input readOnly className="w-full border-none" defaultValue={'*'.repeat(field.value.length)} />}
                    <Button className="px-2" variant="ghost" onClick={() => setShow((prev) => !prev)}>
                      {show ? <EyeOffIcon /> : <EyeIcon />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DeleteButton className="w-fit size-9" description={<Tran text="confirm-delete" />} isLoading={isPending} onClick={() => mutate()}>
        {isPending ? <LoadingSpinner className="m-0" /> : <XIcon />}
      </DeleteButton>
    </motion.div>
  );
}

type AddEnvCardProps = {
  id: string;
};

function AddEnvCard({ id }: AddEnvCardProps) {
  const axios = useClientApi();

  const form = useForm<z.infer<typeof CreateServerEnvSchema>>({
    resolver: zodResolver(CreateServerEnvSchema),
    defaultValues: {
      name: '',
      value: '',
    },
  });

  const { invalidateByKey } = useQueriesData();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof CreateServerEnvSchema>) => createServerEnv(axios, id, data),
    onError: (error) => toast.error(<Tran text="error" />, { description: error?.message }),
    onSuccess: () => {
      form.reset();
    },
    onSettled: () => invalidateByKey(['server']),
  });

  return (
    <Form {...form}>
      <form className="flex gap-2 sm:items-center flex-col sm:flex-row items-start w-full" onSubmit={form.handleSubmit((value) => mutate(value))}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full md:max-w-80">
              <FormControl>
                <Input placeholder="GITHUB_KEY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input className="w-full" placeholder="ghp_awdguyagwdygawdagwiy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="outline" type="submit">
          {isPending ? <LoadingSpinner className="m-0" /> : <CheckIcon />}
        </Button>
      </form>
    </Form>
  );
}
