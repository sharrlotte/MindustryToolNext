'use client';

import { Hidden } from '@/components/common/hidden';
import Tran from '@/components/common/tran';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React from 'react';

export default function TagPreset() {



  return (
    <Dialog>
      <DialogTrigger>
        <Tran text="tags.preset" />
      </DialogTrigger>
      <DialogContent className="max-h-dvh overflow-y-auto p-6">
        <DialogTitle>
          <Tran text="tags.preset" />
        </DialogTitle>
        <Hidden>
          <DialogDescription />
        </Hidden>
      </DialogContent>
    </Dialog>
  );
}
