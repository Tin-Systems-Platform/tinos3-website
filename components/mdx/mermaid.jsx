'use client';

import { useEffect, useState, useId } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: { htmlLabels: false } // Ensures crisp SVG rendering on client engine
});

export default function Mermaid({ chart }) {
  const uniqueId = useId().replace(/:/g, '');
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      try {
        // Clear old visual traces and render dynamically
        const { svg: renderedSvg } = await mermaid.render(`mermaid-svg-${uniqueId}`, chart);
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        console.error('Mermaid layout error:', err);
        if (isMounted) setError(true);
      }
    }

    renderDiagram();
    return () => { isMounted = false; };
  }, [chart, uniqueId]);

  if (error) {
    return (
      <pre className="p-4 bg-gray-600 text-red-600 rounded text-xs border border-red-200 overflow-auto mx-auto max-w-2xl">
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return (
      <div className="w-full h-48 bg-gray-600 flex items-center justify-center text-sm text-gray-400 animate-pulse rounded border border-dashed my-8">
        Compiling system flowchart layout...
      </div>
    );
  }

  return (
    <div 
      className="my-8 flex justify-center w-full overflow-x-auto bg-gray-700 p-6 rounded border shadow-sm width-m"
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}
