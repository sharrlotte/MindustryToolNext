/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DetailDescription, DetailTitle } from '@/components/common/detail';
import { EditClose, EditComponent, EditOff, EditOn, EditTrigger } from '@/components/common/edit-component';
import LoadingScreen from '@/components/common/loading-screen';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import UploadField from '@/components/common/upload-field';
import TagSelector from '@/components/search/tag-selector';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import UserCard from '@/components/user/user-card';

import { IMAGE_PREFIX } from '@/constant/constant';
import { useSession } from '@/context/session-context.client';
import { useTags } from '@/context/tags-context.client';
import useClientApi from '@/hooks/use-client';
import { useI18n } from '@/i18n/client';
import ProtectedElement from '@/layout/protected-element';
import { createMap, createMultipleMap, getMapPreview } from '@/query/map';
import MapPreviewRequest from '@/types/request/MapPreviewRequest';
import { MapPreviewResponse } from '@/types/response/MapPreviewResponse';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';
import { CreateMapRequest, CreateMapSchema } from '@/types/schema/zod-schema';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

export default function Page() {
  const { session } = useSession();
  const {
    uploadTags: { map },
  } = useTags();

  const { mutate: uploadMultiple, isPending: isUploadingMultiple } = useMutation({
    mutationFn: async (data: CreateMapRequest) => toast.promise(createMultipleMap(axios, data), { loading: <Tran text="upload.uploading" />, success: <Tran text="upload.success" />, error: <Tran text="upload.fail" /> }),
  });

  const [tags, setTags] = useState<TagGroup[]>([]);

  const axios = useClientApi();
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState<MapPreviewResponse>();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: MapPreviewRequest) => getMapPreview(axios, data),
    onSuccess: (data) => {
      setPreview(data);
    },
    onError: (error) => {
      setFile(undefined);
      toast.error(<Tran text="upload.get-preview-fail" />, { description: error.message });
    },
  });

  function handleFileChange(files: File[]) {
    if (!files.length || !files[0]) {
      return toast.error(<Tran text="upload.no-file" />);
    }

    const file = files[0];
    const filename = file.name;
    const extension = filename.split('.').pop();

    if (extension !== 'msav' && extension !== 'zip') {
      return toast.error(<Tran text="upload.invalid-map-file" />);
    }

    if (extension === 'zip') {
      uploadMultiple({
        name: '',
        description: '',
        file,
        tags: TagGroups.toString(tags),
      });
    } else {
      setPreview(undefined);
      setFile(file);
    }
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
        <UploadField onFileDrop={handleFileChange} disabled={isUploadingMultiple} />
        <ProtectedElement session={session} filter={{ role: 'ADMIN' }}>
          <div className="mt-10">
            <Tran text="upload-zip" />
            <TagSelector type="schematic" tags={map} value={tags} onChange={(fn) => setTags((prev) => fn(prev))} />
          </div>
        </ProtectedElement>
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
  const {
    uploadTags: { map },
  } = useTags();

  const t = useI18n();
  const axios = useClientApi();

  const form = useForm<FormData>({
    resolver: zodResolver(CreateMapSchema(t)),
    defaultValues: {
      name: preview.name,
      description: preview.description,
      tags: [],
      file,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateMapRequest) => {
      toast.promise(createMap(axios, data), { loading: <Tran text="upload.uploading" />, success: <Tran text="upload.success" /> });
    },
    onSuccess: () => {
      setFile(undefined);
      setPreview(undefined);
      form.reset();
    },
    onError: (error) => {
      toast.error(<Tran text="upload.fail" />, { description: error.message });
    },
  });

  function handleSubmit(data: any) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form className="flex h-full flex-col p-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <ScrollContainer className="flex flex-col gap-2">
          <img className="max-h-dvh" src={IMAGE_PREFIX + preview.image.trim()} alt="Map" />
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
                  <TagSelector type="map" tags={map} value={field.value} onChange={(fn) => field.onChange(fn(field.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </ScrollContainer>
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
