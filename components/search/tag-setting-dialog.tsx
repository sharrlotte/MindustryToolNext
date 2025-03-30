import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { SettingIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

import { SHOW_TAG_NAME_PERSISTENT_KEY, SHOW_TAG_NUMBER_PERSISTENT_KEY } from '@/constant/constant';

export default function TagSettingDialog() {
  const [{ showTagName, showTagNumber }, setConfig] = useCookies([SHOW_TAG_NAME_PERSISTENT_KEY, SHOW_TAG_NUMBER_PERSISTENT_KEY]);

  useEffect(() => {
    if (showTagName === undefined) {
      setConfig('showTagName', true, { path: '/' });
    }

    if (showTagNumber === undefined) {
      setConfig('showTagNumber', true, { path: '/' });
    }
  }, [setConfig, showTagName, showTagNumber]);

  return (
    <Dialog>
      <DialogTrigger className="px-2">
        <SettingIcon />
      </DialogTrigger>
      <DialogContent className="p-6">
        <DialogTitle />
        <DialogDescription />
        <div className="flex gap-1">
          <Switch checked={showTagName} onCheckedChange={(value) => setConfig('showTagName', value, { path: '/' })} />
          <Tran className="text-sm" text="setting.show-tag-name" />
        </div>
        <div className="flex gap-1">
          <Switch checked={showTagNumber} onCheckedChange={(value) => setConfig('showTagNumber', value, { path: '/' })} />
          <Tran className="text-sm" text="setting.show-tag-number" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
