'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DetailDescription, DetailTitle } from '@/components/common/detail';
import { EditClose, EditComponent, EditOff, EditOn, EditTrigger } from '@/components/common/edit-component';
import LoadingScreen from '@/components/common/loading-screen';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import UploadField from '@/components/common/upload-field';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import TagSelector from '@/components/search/tag-selector';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import UserCard from '@/components/user/user-card';

import { IMAGE_PREFIX } from '@/constant/constant';
import { useSession } from '@/context/session-context';
import useClientApi from '@/hooks/use-client';
import { createSchematic, getSchematicPreview } from '@/query/schematic';
import SchematicPreviewRequest from '@/types/request/SchematicPreviewRequest';
import { SchematicPreviewResponse } from '@/types/response/SchematicPreviewResponse';
import TagGroup from '@/types/response/TagGroup';
import { CreateSchematicRequest, CreateSchematicSchema } from '@/types/schema/zod-schema';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

/* eslint-disable @next/next/no-img-element */

export default function Page() {
  return <Preview />;
}

function Preview() {
  const axios = useClientApi();
  const [data, setData] = useState<File | string | undefined>();
  const [preview, setPreview] = useState<SchematicPreviewResponse>();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SchematicPreviewRequest) => getSchematicPreview(axios, data),
    onSuccess: (data) => {
      setPreview(data);
    },
    onError: (error) => {
      setData(undefined);
      toast.error(<Tran text="upload.get-preview-fail" />, { description: error.message });
    },
  });

  useEffect(() => {
    if (data) {
      mutate({ data });
    }
  }, [data, mutate]);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (preview && data)
    return (
      <Upload
        data={data}
        preview={preview} //
        setData={setData}
        setPreview={setPreview}
      />
    );

  function handleSchematicSelected(data: File | string) {
    setData(data);
    setPreview(undefined);
  }

  return <SchematicSelector onSchematicSelected={handleSchematicSelected} />;
}

type SchematicSelectorProps = {
  onSchematicSelected: (data: File | string) => void;
};

function SchematicSelector({ onSchematicSelected }: SchematicSelectorProps) {
  function handleFileChange(files: File[]) {
    if (!files.length || !files[0]) {
      return toast.error(<Tran text="upload.no-file" />);
    }

    const file = files[0];
    const filename = file.name;
    const extension = filename.split('.').pop();

    if (extension !== 'msch') {
      return toast.error(<Tran text="upload.invalid-schematic-file" />);
    }

    onSchematicSelected(file);
  }

  function handleCopyCode() {
    navigator.clipboard
      .readText() //
      .then((text) => {
        if (!text || text.length === 0) {
          return toast.error(<Tran text="upload.clipboard-empty" />);
        }

        if (!text.startsWith('bXNja')) {
          return toast.error(<Tran text="upload.invalid-schematic-code" />);
        }

        onSchematicSelected(text);
      });
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-8 rounded-md p-2">
      <section className="flex flex-row flex-wrap items-center gap-2 md:max-h-[50dvh] md:max-w-[50dvw] md:flex-row md:items-start">
        <div className="grid w-full items-center gap-2">
          <UploadField onFileDrop={handleFileChange} />
          <span className="text-center">or</span>
          <Button variant="primary" title={'copy-from-clipboard'} onClick={handleCopyCode}>
            <Tran text="copy-from-clipboard" />
          </Button>
        </div>
      </section>
    </div>
  );
}

type UploadProps = {
  data: string | File;
  preview: SchematicPreviewResponse;
  setData: (data?: File | string | undefined) => void;
  setPreview: (data?: SchematicPreviewResponse) => void;
};

type UploadFormData = {
  name: string;
  description: string;
  tags: TagGroup[];
  data: string | File;
};

function Upload({ data, preview, setData, setPreview }: UploadProps) {
  const { session } = useSession();

  const axios = useClientApi();

  const form = useForm<UploadFormData>({
    resolver: zodResolver(CreateSchematicSchema),
    defaultValues: {
      name: preview.name,
      description: preview.description,
      tags: [],
      data,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateSchematicRequest) => createSchematic(axios, data),
    onMutate: () => toast.loading(<Tran text="upload.uploading" />),
    onSuccess: () => {
      setData(undefined);
      setPreview(undefined);
      form.reset();

      return toast.success(<Tran text="upload.success" />);
    },
    onError: (error) => toast.error(<Tran text="upload.fail" />, { description: error?.message }),
  });

  function handleSubmit(data: any) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form className="flex h-full flex-col p-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <ScrollContainer className="flex flex-col gap-2">
          <div className="max-h-[min(100dvh,100dvw)] w-auto">
            <img className="max-w-[60vw] max-h-[60vh]" src={IMAGE_PREFIX + preview.image.trim()} alt="Schematic" />
          </div>
          <UserCard user={session} />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <EditComponent>
                  <EditOff>
                    <div className="flex gap-1 items-center">
                      <DetailTitle>{field.value}</DetailTitle>
                      <EditTrigger />
                    </div>
                  </EditOff>
                  <EditOn>
                    <FormLabel>
                      <Tran text="name" />
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1 items-center">
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
                    <div className="flex gap-1 items-center">
                      <DetailDescription>{field.value}</DetailDescription>
                      <EditTrigger />
                    </div>
                  </EditOff>
                  <EditOn>
                    <FormLabel>
                      <Tran text="description" />
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-1 items-center">
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
          <ItemRequirementCard requirements={preview.requirements} />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Tran text="tags" />
                </FormLabel>
                <FormControl>
                  <TagSelector type="schematic" value={field.value} onChange={(fn) => field.onChange(fn(field.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </ScrollContainer>
        <div className="mt-auto flex justify-end space-x-2 gap-2 p-2">
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
