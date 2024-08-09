'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  EditClose,
  EditComponent,
  EditOn,
  EditTrigger,
  EditOff,
} from '@/components/common/edit-component';
import LoadingScreen from '@/components/common/loading-screen';
import Tran from '@/components/common/tran';
import UploadField from '@/components/common/upload-field';
import { DetailDescription, DetailTitle } from '@/components/detail/detail';
import NameTagSelector from '@/components/search/name-tag-selector';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import UserCard from '@/components/user/user-card';
import { PNG_IMAGE_PREFIX } from '@/constant/constant';
import { useSession } from '@/context/session-context';
import useClientAPI from '@/hooks/use-client';
import { useUploadTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import postMap from '@/query/map/post-map';
import postMapPreview from '@/query/map/post-map-preview';
import MapPreviewRequest from '@/types/request/MapPreviewRequest';
import { MapPreviewResponse } from '@/types/response/MapPreviewResponse';
import TagGroup from '@/types/response/TagGroup';
import { UploadMapRequest, UploadMapSchema } from '@/types/schema/zod-schema';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

export default function Page() {
  const axios = useClientAPI();
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<MapPreviewResponse>();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: MapPreviewRequest) => postMapPreview(axios, data),
    onSuccess: (data) => {
      setPreview(data);
    },
    onError: (error) => {
      setFile(undefined);
      toast({
        title: <Tran text="upload.get-preview-fail" />,
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  function handleFileChange(files: File[]) {
    if (!files.length || !files[0]) {
      return toast({
        title: <Tran text="upload.no-file" />,
        variant: 'destructive',
      });
    }

    const file = files[0];
    const filename = file.name;
    const extension = filename.split('.').pop();

    if (extension !== 'msav') {
      return toast({
        title: <Tran text="upload.invalid-map-file" />,
        variant: 'destructive',
      });
    }

    setPreview(undefined);
    setFile(file);
  }

  useEffect(() => {
    if (file) mutate({ file });
  }, [file, mutate]);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (preview && file)
    return (
      <Upload
        file={file}
        preview={preview} //
        setFile={setFile}
        setPreview={setPreview}
      />
    );

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 rounded-md p-2">
      <section className="flex flex-row flex-wrap items-center gap-2 md:h-1/2 md:w-1/2 md:flex-row md:items-start">
        <UploadField onFileDrop={handleFileChange} />
      </section>
    </div>
  );
}

type UploadProps = {
  file: File;
  preview: MapPreviewResponse;
  setFile: (data?: File | undefined) => void;
  setPreview: (data?: MapPreviewResponse) => void;
};

type FormData = {
  name: string;
  description: string;
  tags: TagGroup[];
  file: File;
};

function Upload({ file, preview, setFile, setPreview }: UploadProps) {
  const { session } = useSession();
  const { map } = useUploadTags();
  const { toast } = useToast();

  const t = useI18n();
  const axios = useClientAPI();

  const form = useForm<FormData>({
    resolver: zodResolver(UploadMapSchema(t)),
    defaultValues: {
      name: preview.name,
      description: preview.description,
      tags: [],
      file,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UploadMapRequest) => postMap(axios, data),
    onMutate: () => {
      toast({
        title: <Tran text="upload.uploading" />,
      });
    },
    onSuccess: () => {
      toast({
        title: <Tran text="upload.success" />,
        variant: 'success',
      });
      setFile(undefined);
      setPreview(undefined);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: <Tran text="upload.fail" />,
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  function handleSubmit(data: any) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form
        className="flex h-full flex-col p-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex flex-col gap-2">
          <Image
            loader={({ src }) => src}
            src={PNG_IMAGE_PREFIX + preview.image.trim()}
            alt="Map"
            width={512}
            height={512}
          />
          <UserCard user={session} />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <EditComponent>
                  <EditOff>
                    <div className="flex gap-1">
                      <DetailTitle>{field.value}</DetailTitle>
                      <EditTrigger />
                    </div>
                  </EditOff>
                  <EditOn>
                    <FormLabel>
                      <Tran text="name" />
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Input {...field} />
                        <EditClose />
                      </div>
                    </FormControl>
                  </EditOn>
                </EditComponent>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <EditComponent>
                  <EditOff>
                    <div className="flex gap-1">
                      <DetailDescription>{field.value}</DetailDescription>
                      <EditTrigger />
                    </div>
                  </EditOff>
                  <EditOn>
                    <FormLabel>
                      <Tran text="description" />
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        <Textarea className="min-h-20 w-full" {...field} />
                        <EditClose />
                      </div>
                    </FormControl>
                  </EditOn>
                </EditComponent>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Tran text="tags" />
                </FormLabel>
                <FormControl>
                  <NameTagSelector
                    tags={map}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-auto flex justify-end gap-2 p-2">
          <Button variant="outline" onClick={() => setPreview(undefined)}>
            <Tran text="close" />
          </Button>
          <Button variant="primary" type="submit" disabled={isPending}>
            <Tran text="upload" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
