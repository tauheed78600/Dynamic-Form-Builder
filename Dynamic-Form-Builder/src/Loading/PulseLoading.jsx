import React from 'react';

function PulseLoading() {
  return (
    <div className="flex w-full min-h-screen">
      <div className="grid grid-cols-2 gap-4 w-full max-w-screen-lg">
        <div className="h-[500px] w-full bg-gray-300 animate-pulse rounded-lg"></div>
        <div className="h-[500px] w-full bg-gray-300 animate-pulse rounded-lg"></div>
      </div>
    </div>
  );
}

export default PulseLoading;
