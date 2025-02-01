'use client';

import React from 'react';
import { useCookies } from 'react-cookie';

import Tran from '@/components/common/tran';
import { Switch } from '@/components/ui/switch';

import { SHOW_TAG_NAME_PERSISTENT_KEY } from '@/constant/constant';

export default function UserSettings() {
  const [{ showTagName }, setConfig] = useCookies([SHOW_TAG_NAME_PERSISTENT_KEY]);

  return (
    <div>
      <div className="flex gap-1">
        <Switch checked={showTagName} onCheckedChange={(value) => setConfig('showTagName', value)} />
        <Tran text="setting.show-tag-name" />
      </div>
    </div>
  );
}
