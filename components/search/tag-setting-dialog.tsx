import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { SettingIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

import { SHOW_TAG_NAME_PERSISTENT_KEY } from '@/constant/constant';

export default function TagSettingDialog() {
  const [{ showTagName }, setConfig] = useCookies([SHOW_TAG_NAME_PERSISTENT_KEY]);

  useEffect(() => {
    if (showTagName === undefined) {
      setConfig('showTagName', true, { path: '/' });
    }
  }, [setConfig, showTagName]);

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
      </DialogContent>
    </Dialog>
  );
}
