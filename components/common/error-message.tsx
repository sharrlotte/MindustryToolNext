import React from 'react';

import Tran from '@/components/common/tran';

type Props = {
  error: any;
};
export default function ErrorMessage({ error }: Props) {
  if (typeof error === 'object' && typeof error.message === 'string') {
    return error.message;
  }

  return <Tran text="unknown-error" />;
}
