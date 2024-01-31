/* eslint-disable @next/next/no-img-element */
'use client';

import Detail from '@/components/detail/detail';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import NameTagSelector from '@/components/search/name-tag-selector';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import LoadingSpinner from '@/components/ui/loading-spinner';
import IdUserCard from '@/components/user/id-user-card';
import UserCard from '@/components/user/user-card';
import { PNG_IMAGE_PREFIX } from '@/constant/constant';
import useClientAPI from '@/hooks/use-client';
import useTags from '@/hooks/use-tags';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import postSchematic from '@/query/schematic/post-schematic';
import postSchematicPreview from '@/query/schematic/post-schematic-preview';
import PostSchematicRequest from '@/types/request/PostSchematicRequest';
import SchematicPreviewRequest from '@/types/request/SchematicPreviewRequest';
import SchematicPreviewResponse from '@/types/response/SchematicPreviewResponse';
import TagGroup from '@/types/response/TagGroup';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useEffect, useState } from 'react';

export default function UploadSchematicPage() {
  const { axios } = useClientAPI();
  const [data, setData] = useState<File | string | undefined>();
  const [preview, setPreview] = useState<SchematicPreviewResponse>();
  const { data: session } = useSession();
  const user = session?.user;
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { schematic } = useTags();
  const { toast } = useToast();
  const [isOpen, setOpen] = useState(false);

  const closeDialog = () => setOpen(false);

  const { mutate: getSchematicPreview, isPending: isLoadingSchematicPreview } =
    useMutation({
      mutationFn: (data: SchematicPreviewRequest) =>
        postSchematicPreview(axios, data),
      onSuccess: (data) => setPreview(data),
      onError(error) {
        toast({
          title: 'Failed to get preview',
          description: error.message,
          variant: 'destructive',
        });
      },
    });

  const { mutate: postNewSchematic, isPending: isLoadingPostSchematic } =
    useMutation({
      mutationFn: (data: PostSchematicRequest) => postSchematic(axios, data),
      onSuccess: () => {
        toast({
          title: 'Upload schematic success',
        });
      },
      onError(error) {
        toast({
          title: 'Upload schematic failed',
          description: error.message,
          variant: 'destructive',
        });
      },
    });

  const isLoading = isLoadingPostSchematic || isLoadingSchematicPreview;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length <= 0 || !files[0]) {
      toast({
        title: 'No file selected',
        variant: 'destructive',
      });
      return;
    }
    const filename = files[0].name;
    const extension = filename.split('.').pop();

    if (extension !== 'msch') {
      toast({
        title: 'Invalid file extension, file must end with .msch',
        variant: 'destructive',
      });
      return;
    }

    closeDialog();
    setData(files[0]);
  }

  function handleCodeChange() {
    navigator.clipboard
      .readText() //
      .then((text) => {
        if (!text.startsWith('bXNja')) {
          toast({
            title: 'Invalid schematic code',
            variant: 'destructive',
          });
          return;
        }

        closeDialog();
        setData(text);
      });
  }

  function handleSubmit() {
    if (!data || isLoading) {
      return;
    }

    postNewSchematic({ data, tags: selectedTags });
  }

  useEffect(() => {
    if (data) {
      getSchematicPreview({ data });
    }
  }, [data, getSchematicPreview]);

  function checkUploadRequirement() {
    if (!data) return 'No schematic data';

    return true;
  }

  const uploadCheck = checkUploadRequirement();

  return (
    <div className="flex h-full w-full flex-col justify-between gap-2 overflow-y-auto rounded-md pr-1">
      <div className="flex flex-row gap-2 rounded-md bg-card p-2">
        <section className="flex min-h-10 flex-row flex-wrap gap-2">
          <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger
              className={cn({ 'rounded-md bg-button px-4': !preview })}
              disabled={isLoading}
            >
              {preview ? (
                <img src={PNG_IMAGE_PREFIX + preview.image} alt="Error" />
              ) : (
                <span title="Select schematic">Select schematic</span>
              )}
            </DialogTrigger>
            <DialogContent className="w-4/5 rounded-md">
              <DialogTitle>Select schematic</DialogTitle>
              <div className="grid items-stretch justify-stretch gap-2">
                <Button title="file" asChild>
                  <div className="flex w-full items-center justify-center">
                    <label className="button" htmlFor="file">
                      Upload a file
                    </label>
                    <input
                      id="file"
                      type="file"
                      hidden
                      disabled={isLoading}
                      onChange={(event) => handleFileChange(event)}
                    />
                  </div>
                </Button>
                <Button
                  title={'copy-from-clipboard'}
                  onClick={() => handleCodeChange()}
                  disabled={isLoading}
                >
                  Copy from clipboard
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {preview && (
            <section className="flex flex-col gap-2">
              <Detail.Title>{preview.name}</Detail.Title>
              {user ? <UserCard user={user} /> : <IdUserCard id="community" />}
              <Detail.Description>{preview.description}</Detail.Description>
              <ItemRequirementCard requirement={preview.requirement} />
              <NameTagSelector
                tags={schematic}
                value={selectedTags}
                onChange={setSelectedTags}
              />
            </section>
          )}
        </section>
      </div>
      <div className="flex flex-col items-end justify-center rounded-md bg-card p-2">
        <Button
          className="w-fit"
          title="Upload"
          onClick={() => handleSubmit()}
          disabled={isLoading || uploadCheck !== true}
        >
          {uploadCheck === true ? 'Upload' : uploadCheck}
        </Button>
      </div>
    </div>
  );
}
