'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import InfinitePage from '@/components/common/infinite-page';
import LoadingWrapper from '@/components/common/loading-wrapper';
import MindustryServerCard from '@/components/server/mindustry-server-card';
import PostServerRequest from '@/types/request/PostServerRequest';
import PostServerResponse from '@/types/response/PostServerResponse';
import PostServerResultCard from '@/components/server/post-server-result-card';
import getServers from '@/query/server/get-servers';
import postServer from '@/query/server/post-server';
import useClientAPI from '@/hooks/use-client';
import { useI18n } from '@/locales/client';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function Page() {
  const scrollContainer = useRef<HTMLDivElement | null>();
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<PostServerResponse>();
  const params = { page: 0 };
  const { axios } = useClientAPI();
  const { toast } = useToast();

  const t = useI18n();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PostServerRequest) => postServer(axios, data),
    onError(error) {
      toast({
        title: t('server.upload-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: (result) => {
      setAddress('');
      setResult(result);
    },
  });

  function handleCopyFromClipboard() {
    navigator.clipboard.readText().then((text) => setAddress(text));
  }

  return (
    <div className="flex h-full flex-col gap-2 py-2 pl-2">
      <div className="flex justify-end pr-4">
        <LoadingWrapper
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border"
          isLoading={isPending}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary" title={t('server.add')}>
                {t('server.add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="flex flex-col gap-2">
                <input
                  value={address}
                  type="text"
                  placeholder={t('address')}
                  className="w-full border-b-2 border-foreground bg-transparent pt-1 outline-none hover:border-b-2 hover:outline-none"
                  onChange={(event) => setAddress(event.currentTarget.value)}
                />
                <div className="flex gap-2 self-end">
                  <Button
                    variant="outline"
                    title={t('copy-from-clipboard')}
                    onClick={handleCopyFromClipboard}
                  >
                    <ClipboardIcon className="h-6 w-6" />
                  </Button>
                  <Button
                    className="self-end"
                    title={t('submit')}
                    variant="primary"
                    onClick={() => mutate({ address })}
                  >
                    {t('submit')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </LoadingWrapper>
      </div>
      <Dialog
        open={result !== undefined}
        onOpenChange={() => setResult(undefined)}
      >
        <DialogContent>
          <DialogTitle>{t('server.add-success')}</DialogTitle>
          <PostServerResultCard server={result} />
        </DialogContent>
      </Dialog>
      <div
        className="h-full overflow-y-auto pr-2"
        ref={(ref) => (scrollContainer.current = ref)}
      >
        <InfinitePage
          className="grid w-full grid-cols-1 justify-center gap-4 md:grid-cols-2 xl:grid-cols-3"
          queryKey={['servers']}
          scrollContainer={scrollContainer.current}
          params={params}
          getFunc={getServers}
        >
          {(data) => <MindustryServerCard key={data.id} server={data} />}
        </InfinitePage>
      </div>
    </div>
  );
}
