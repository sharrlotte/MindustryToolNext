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
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
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
import postSchematic from '@/query/schematic/post-schematic';
import SchematicPreviewRequest from '@/types/request/SchematicPreviewRequest';
import { SchematicPreviewResponse } from '@/types/response/SchematicPreviewResponse';
import TagGroup from '@/types/response/TagGroup';
import {
  UploadSchematicRequest,
  UploadSchematicSchema,
} from '@/types/schema/zod-schema';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { getSchematicPreview } from '@/query/schematic';

export default function Page() {
  return <Preview />;
}

function Preview() {
  const axios = useClientAPI();
  const [data, setData] = useState<File | string | undefined>();
  const [preview, setPreview] = useState<SchematicPreviewResponse>();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SchematicPreviewRequest) =>
      getSchematicPreview(axios, data),
    onSuccess: (data) => {
      setPreview(data);
    },
    onError: (error) => {
      setData(undefined);
      toast({
        title: <Tran text="upload.get-preview-fail" />,
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (data) mutate({ data });
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
  const { toast } = useToast();

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

    if (extension !== 'msch') {
      return toast({
        title: <Tran text="upload.invalid-schematic-file" />,
        variant: 'destructive',
      });
    }

    onSchematicSelected(file);
  }

  function handleCopyCode() {
    navigator.clipboard
      .readText() //
      .then((text) => {
        if (!text || text.length === 0) {
          return toast({
            title: <Tran text="upload.clipboard-empty" />,
            variant: 'destructive',
          });
        }

        if (!text.startsWith('bXNja')) {
          return toast({
            title: <Tran text="upload.invalid-schematic-code" />,
            variant: 'destructive',
          });
        }

        onSchematicSelected(text);
      });
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-2 rounded-md p-2">
      <section className="flex flex-row flex-wrap items-center gap-2 md:max-h-[50dvh] md:max-w-[50dvw] md:flex-row md:items-start">
        <div className="grid w-full items-center gap-2">
          <UploadField onFileDrop={handleFileChange} />
          <span className="text-center">or</span>
          <Button
            variant="primary"
            title={'copy-from-clipboard'}
            onClick={handleCopyCode}
          >
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
  const { schematic } = useUploadTags();
  const { toast } = useToast();

  const t = useI18n();
  const axios = useClientAPI();

  const form = useForm<UploadFormData>({
    resolver: zodResolver(UploadSchematicSchema(t)),
    defaultValues: {
      name: preview.name,
      description: preview.description,
      tags: [],
      data,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UploadSchematicRequest) => postSchematic(axios, data),
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
      setData(undefined);
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
            alt="Schematic"
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
                  <NameTagSelector
                    tags={schematic}
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
