import React from 'react';

import LoadingSpinner from '@/components/common/loading-spinner';

export default function LoadingScreen() {
  return <LoadingSpinner className="fixed inset-0 z-50 backdrop-blur-sm backdrop-brightness-50 flex justify-center items-center" />;
}
