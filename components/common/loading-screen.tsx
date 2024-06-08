import LoadingSpinner from '@/components/common/loading-spinner';

import React from 'react';

export default function LoadingScreen() {
  return (
    <LoadingSpinner className="fixed inset-0 z-50 backdrop-blur-sm backdrop-brightness-50" />
  );
}
