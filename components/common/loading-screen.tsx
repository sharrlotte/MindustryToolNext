import React from 'react';

import LoadingSpinner from '@/components/common/loading-spinner';

export default function LoadingScreen() {
  return (
    <div className="absolute inset-0 backdrop-blur-xs backdrop-brightness-50 flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
}
