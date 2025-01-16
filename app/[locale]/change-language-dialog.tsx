'use client';

import dynamic from 'next/dynamic';

import Tran from '@/components/common/tran';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const ChangeLocaleForm = dynamic(() => import('@/app/[locale]/change-locale-form'));

export function ChangeLanguageDialog() {
  return (
    <Dialog>
      <DialogTrigger className="w-full text-start">
        <Tran text="switch-language" />
      </DialogTrigger>
      <DialogContent className="p-6">
        <ChangeLocaleForm />
      </DialogContent>
    </Dialog>
  );
}
