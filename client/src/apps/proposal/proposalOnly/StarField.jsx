import React from 'react';
import BackgroundParticles from '../../virtual-date/components/BackgroundParticles';

export default function StarField() {
  return (
    <BackgroundParticles
      theme="dark"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 rounded-[32px]"
    />
  );
}
