import React from 'react';
import dynamic from 'next/dynamic';

const ATSCheckerClient = dynamic(() => import('@/components/ui/ATSCheckerClient'), { ssr: false });

export const metadata = {
  title: 'ATS Checker',
  description: 'Resume ATS & grammar checker — free summary and premium detailed improvements',
};

export default function Page() {
  return (
    <div>
      <ATSCheckerClient />
    </div>
  );
}
