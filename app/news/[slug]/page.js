import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import axios from 'axios';
import { marked } from 'marked'; 

async function getGithubDiscussion(discussionId) {
  const query = `
    query($id: ID!) {
      node(id: $id) {
        ... on Discussion {
          title
          createdAt
          body
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://api.github.com/graphql',
      { 
        query, 
        variables: { id: decodeURIComponent(discussionId) } 
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Tinos3-App',
        },
      }
    );

    if (response.data.errors) return null;
    return response.data.data.node;
  } catch {
    return null;
  }
}

export default async function NewsPost({ params }) {
  const { slug } = await params; 
  
  let title = '';
  let date = '';
  let contentMarkdown = '';
  let isGitHub = false;

  const isGitHubId = slug.startsWith('D_');
  const localPath = path.join(process.cwd(), 'news/content', `${slug}.mdx`);

  if (!isGitHubId && fs.existsSync(localPath)) {
    const fileContent = fs.readFileSync(localPath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    title = frontmatter.title || 'Local Update';
    date = frontmatter.date || '';
    contentMarkdown = content;
  } 

  else {
    const discussion = await getGithubDiscussion(slug);
    if (discussion) {
      title = discussion.title;
      date = new Date(discussion.createdAt).toLocaleDateString('fi-FI');
      contentMarkdown = discussion.body;
      isGitHub = true;
    } else {
      return <div className="p-8 text-white">Post was not found in either source.</div>;
    }
  }


  if (isGitHub) {
  
    const htmlContent = marked.parse(contentMarkdown);
    return (
      <article className="max-w-3xl mx-auto px-4 py-8 text-white">
        <header className="mb-8 border-b border-zinc-800 pb-4">
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <time className="text-sm text-zinc-500">{date} (via GitHub)</time>
        </header>
        {}
        <div 
          className="prose prose-invert max-w-none text-zinc-300"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    );
  } else {

    const { content: RenderedMDX } = await compileMDX({ source: contentMarkdown });
    return (
      <article className="max-w-3xl mx-auto px-4 py-8 text-white">
        <header className="mb-8 border-b border-zinc-800 pb-4">
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <time className="text-sm text-zinc-500">{date}</time>
        </header>
        <div className="prose prose-invert max-w-none text-zinc-300">
          {RenderedMDX}
        </div>
      </article>
    );
  }
}