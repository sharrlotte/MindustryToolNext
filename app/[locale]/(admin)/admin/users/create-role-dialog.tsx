'use client';

import { Hidden } from '@/components/common/hidden';
import Tran from '@/components/common/tran';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function CreateRoleDialog() {
  const form = useForm({});

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Tran text="role.add-role" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Hidden>
          <DialogTitle />
          <DialogDescription />
        </Hidden>
        <Form {...form}>
          <form></form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
