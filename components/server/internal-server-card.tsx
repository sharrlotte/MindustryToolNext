import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { getI18n } from '@/locales/server';
import { InternalServerDetail } from '@/types/response/InternalServerDetail';
import Link from 'next/link';
import React from 'react';

type ServerInstancesCardProps = {
  server: InternalServerDetail;
};

export default async function InternalServerCard({
  server: { id, name, port, alive, started },
}: ServerInstancesCardProps) {
  const t = await getI18n();

  const status = `Status: ${alive ? 'Alive' : 'Downed'} ${started ? 'Started' : 'Not started'}`;

  return (
    <div className="flex justify-between rounded-md bg-card p-2">
      <Link className="flex flex-1 flex-col" href={`/admin/servers/${id}`}>
        <div className="text-2xl">{name}</div>
        <div>Port: {port}</div>
        <div>{status}</div>
      </Link>
      <div className="flex flex-col gap-1">
        {started ? (
          <Button title="Shutdown" variant="secondary">
            Shutdown
          </Button>
        ) : (
          <Button title="Start" variant="primary">
            Start
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button title="Delete" variant="destructive">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            Are you sure you want to delete
            <AlertDialogFooter>
              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  className="bg-destructive hover:bg-destructive"
                  title={t('delete')}
                >
                  {t('delete')}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
