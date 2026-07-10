import React from 'react';

export default function EmptyState({ message = 'No items found.' }) {
  return (
    <p className="text-center py-12 text-sm text-slate-400 font-light italic">
      {message}
    </p>
  );
}
