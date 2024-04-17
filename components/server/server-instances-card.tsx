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
import { ServerInstanceDetail } from '@/types/response/ServerInstanceDetail';
import React from 'react';

type ServerInstancesCardProps = {
  server: ServerInstanceDetail;
};

export default async function ServerInstancesCard({
  server: { name, port, alive, started },
}: ServerInstancesCardProps) {
  const t = await getI18n();

  const status = `Status: ${alive ? 'Alive' : 'Downed'} ${started ? 'Started' : 'Not started'}`;

  return (
    <div className="flex justify-between rounded-md bg-card p-2">
      <div>
        <div className="text-2xl">{name}</div>
        <div>Port: {port}</div>
        <div>{status}</div>
      </div>
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
