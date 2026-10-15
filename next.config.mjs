import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm';
import mdxMermaid from 'mdx-mermaid';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: false, 
  }
};



const withMDX = createMDX({
  // Add markdown plugins here, as desired
   extension: /\.(md|mdx)$/,
   options: {
    remarkPlugins: [
      "remark-gfm", 
      "mdx-mermaid"
    ],
   }
})
 
// Merge MDX config with Next.js config
export default withMDX(nextConfig)