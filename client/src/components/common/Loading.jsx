import React from 'react';
import PageSkeleton from './PageSkeleton';

export default function Loading({ message = 'Loading...' }) {
  return <PageSkeleton type="default" />;
}
