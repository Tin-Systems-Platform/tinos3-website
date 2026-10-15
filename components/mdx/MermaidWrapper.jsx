'use client';

import dynamic from 'next/dynamic';

const MermaidRender = dynamic(() => import('./mermaid'), {
  ssr: false,
});

export default function MermaidWrapper({ chart }) {
  return <MermaidRender chart={chart} />;
}
