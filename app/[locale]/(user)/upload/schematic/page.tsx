'use client';

import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';

import LoadingWrapper from '@/components/common/loading-wrapper';
import UploadField from '@/components/common/upload-field';
import { DetailDescription, DetailTitle } from '@/components/detail/detail';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import NameTagSelector from '@/components/search/name-tag-selector';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import IdUserCard from '@/components/user/id-user-card';
import UserCard from '@/components/user/user-card';
import { PNG_IMAGE_PREFIX } from '@/constant/constant';
import { useSession } from '@/context/session-context';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useUploadTags } from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useI18n } from '@/locales/client';
import postSchematic from '@/query/schematic/post-schematic';
import postSchematicPreview from '@/query/schematic/post-schematic-preview';
import PostSchematicRequest from '@/types/request/PostSchematicRequest';
import SchematicPreviewRequest from '@/types/request/SchematicPreviewRequest';
import SchematicPreviewResponse from '@/types/response/SchematicPreviewResponse';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

import { useMutation } from '@tanstack/react-query';

/* eslint-disable @next/next/no-img-element */

export default function UploadSchematic() {
  const axios = useClientAPI();
  const [data, setData] = useState<File | string | undefined>();
  const [preview, setPreview] = useState<SchematicPreviewResponse>();
  const { session } = useSession();

  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { schematic } = useUploadTags();
  const [isOpen, setOpen] = useState(false);

  const t = useI18n();
  const { toast } = useToast();
  const closeDialog = () => setOpen(false);
  const { invalidateByKey } = useQueriesData();

  const { mutate: getSchematicPreview, isPending: isLoadingSchematicPreview } =
    useMutation({
      mutationFn: (data: SchematicPreviewRequest) =>
        postSchematicPreview(axios, data),
      onSuccess: (data) => setPreview(data),
      onError(error) {
        toast({
          title: t('upload.get-preview-fail'),
          description: error.message,
          variant: 'destructive',
        });
        setData(undefined);
      },
    });

  const { mutate: postNewSchematic, isPending: isLoadingPostSchematic } =
    useMutation({
      mutationFn: (data: PostSchematicRequest) => postSchematic(axios, data),
      onSuccess: () => {
        toast({
          title: t('upload.success'),
          variant: 'success',
        });
        setData(undefined);
        setPreview(undefined);
        setSelectedTags([]);
        invalidateByKey(['schematic-uploads']);
        invalidateByKey(['total-schematic-uploads']);
      },
      onError(error) {
        toast({
          title: t('upload.fail'),
          description: error.message,
          variant: 'destructive',
        });
      },
    });

  const isLoading = isLoadingPostSchematic || isLoadingSchematicPreview;

  function handleFileChange(files: File[]) {
    if (!files.length || !files[0]) {
      toast({
        title: t('upload.no-file'),
        variant: 'destructive',
      });
      return;
    }
    const filename = files[0].name;
    const extension = filename.split('.').pop();

    if (extension !== 'msch') {
      toast({
        title: t('upload.invalid-schematic-file'),
        variant: 'destructive',
      });
      return;
    }

    setPreview(undefined);
    closeDialog();
    setData(files[0]);
  }

  function handleCodeChange() {
    navigator.clipboard
      .readText() //
      .then((text) => {
        if (!text || text.length === 0) {
          toast({
            title: t('upload.clipboard-empty'),
            variant: 'destructive',
          });
          return;
        }

        if (!text.startsWith('bXNja')) {
          toast({
            title: t('upload.invalid-schematic-code'),
            variant: 'destructive',
          });
          return;
        }

        setPreview(undefined);
        closeDialog();
        setData(text);
      });
  }

  function handleSubmit() {
    if (!data || isLoading || !preview) {
      return;
    }

    postNewSchematic({
      ...preview,
      data,
      tags: TagGroups.toString(selectedTags),
    });
  }

  useEffect(() => {
    if (data) {
      getSchematicPreview({ data });
    }
  }, [data, getSchematicPreview]);

  function checkUploadRequirement() {
    if (!data) return t('upload.no-content');

    return true;
  }

  const uploadCheck = checkUploadRequirement();

  function handleFileDrops(files: File[]) {
    if (!files || !files.length) {
      return;
    }

    handleFileChange(files);
  }

  return (
    <div className="flex h-full w-full flex-col justify-between gap-2 overflow-y-auto rounded-md">
      <div className="flex flex-1 flex-col gap-2 rounded-md p-2">
        <section className="flex min-h-10 flex-row flex-wrap items-center gap-2 md:flex-row md:items-start">
          <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger
              className={cn('border border-border', {
                'rounded-md px-4 py-1.5 text-sm': !preview,
                'bg-brand font-medium text-background dark:text-foreground':
                  !isLoadingSchematicPreview,
              })}
              disabled={isLoading}
            >
              <LoadingWrapper isLoading={isLoadingSchematicPreview}>
                {preview ? (
                  <Image
                    loader={({ src }) => src}
                    src={PNG_IMAGE_PREFIX + preview.image.trim()}
                    alt="Map"
                    width={512}
                    height={512}
                  />
                ) : (
                  <span className="py-1" title={t('upload.select-schematic')}>
                    {t('upload.select-schematic')}
                  </span>
                )}
              </LoadingWrapper>
            </DialogTrigger>
            <DialogContent className="w-4/5 rounded-md p-6">
              <DialogTitle> {t('upload.select-schematic')}</DialogTitle>
              <DialogDescription />
              <div className="grid items-center w-full gap-2">
                <UploadField onFileDrop={handleFileDrops} />
                <span className="text-center">or</span>
                <Button
                  variant="primary"
                  title={'copy-from-clipboard'}
                  onClick={() => handleCodeChange()}
                  disabled={isLoading}
                >
                  {t('copy-from-clipboard')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {preview && (
            <section className="flex flex-col gap-2">
              <DetailTitle>{preview.name}</DetailTitle>
              {session ? (
                <UserCard user={session} />
              ) : (
                <IdUserCard id="community" />
              )}
              <DetailDescription>{preview.description}</DetailDescription>
              <ItemRequirementCard requirements={preview.requirements} />
              <NameTagSelector
                tags={schematic}
                value={selectedTags}
                onChange={setSelectedTags}
              />
            </section>
          )}
        </section>
      </div>
      <div className="flex flex-col items-end justify-center rounded-md p-2">
        <Button
          className="w-fit"
          title={t('upload')}
          variant="primary"
          onClick={() => handleSubmit()}
          disabled={isLoading || uploadCheck !== true}
        >
          <LoadingWrapper isLoading={isLoading}>
            {uploadCheck === true ? t('upload') : uploadCheck}
          </LoadingWrapper>
        </Button>
      </div>
    </div>
  );
}
