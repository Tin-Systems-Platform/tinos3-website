export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import axios from 'axios';
import { marked } from 'marked';

async function GetGithubIssueComments(id) {
  if (!process.env.GITHUB_ACCESS_TOKEN) return [];

  const number = Number(id);

  if (!Number.isInteger(number)) {
    return [];
  }

  try {
    const response = await axios.get(
      `https://api.github.com/repos/Tin-Systems-Platform/Tinos3/issues/${number}/comments`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'Tinos3-App'
        }
      }
    );

    return response.data || [];
  } catch (e) {
    console.error("GitHub comments fetch failed:", e.message);
    return [];
  }
}

async function GetGithubIssue(id) {
  if (!process.env.GITHUB_ACCESS_TOKEN) {
    return null;
  }

  const number = Number(id);

  if (!Number.isInteger(number)) {
    console.error('Invalid GitHub issue number:', id);
    return null;
  }

  const query = `
    query($number: Int!) {
      repository(
        owner: "Tin-Systems-Platform",
        name: "Tinos3"
      ) {
        issue(number: $number) {
          number
          title
          body
          createdAt
          updatedAt
          state
          url
          labels(first: 10) {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://api.github.com/graphql',
      {
        query,
        variables: {
          number
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Tinos3-App'
        }
      }
    );

    if (response.data.errors) {
      console.error(
        'GitHub GraphQL errors:',
        JSON.stringify(response.data.errors, null, 2)
      );

      return null;
    }

    return response.data.data?.repository?.issue ?? null;
  } catch (e) {
    console.error(
      'GitHub issue fetch failed:',
      e.message
    );

    return null;
  }
}

export default async function NewsPost({ params }) {
  // Next.js gives us:
  // { id: "5" }
  const { id } = await params;

  let title = '';
  let date = '';
  let contentMarkdown = '';
  let isGitHub = false;
  let comments = []

  /*
   * Local MDX posts use their filename as the ID.
   * GitHub issues use numeric IDs such as "5".
   */
  const slugString = String(id);
  const isGitHubId = !Number.isNaN(Number(slugString));

  const localPath = path.join(
    process.cwd(),
    'news/content',
    `${slugString}.mdx`
  );

  /*
   * Local post
   */
  if (!isGitHubId && fs.existsSync(localPath)) {
    const fileContent = fs.readFileSync(
      localPath,
      'utf-8'
    );

    const {
      data: frontmatter,
      content
    } = matter(fileContent);

    title = frontmatter.title || 'Local Update';
    date = frontmatter.date || '';
    contentMarkdown = content;
  }

  /*
   * GitHub issue
   */
  else if (isGitHubId) {
    const issue = await GetGithubIssue(id);

    if (!issue) {
      return (
        <div className="p-8 text-white">
          Issue was not found.
        </div>
      );
    }

    comments = await(GetGithubIssueComments(id))


    title = issue.title;
    date = new Date(issue.createdAt)
      .toLocaleDateString('fi-FI');

    contentMarkdown = issue.body || '';
    isGitHub = true;
  }

  /*
   * No local post and not a valid GitHub issue ID
   */
  else {
    return (
      <div className="p-8 text-white">
        Post was not found.
      </div>
    );
  }

  /*
   * Render GitHub Markdown
   */
  if (isGitHub) {
    const htmlContent = marked.parse(contentMarkdown);

    return (
      <article className="max-w-3xl mx-auto px-4 py-8 text-white">
        <header className="mb-8 border-b border-zinc-800 pb-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            {title}
          </h1>

          <time className="text-sm text-zinc-500">
            {date} (via GitHub)
          </time>
        </header>

        <div 
  className="prose prose-invert max-w-none text-zinc-300"
  dangerouslySetInnerHTML={{ __html: htmlContent }}
/>

{comments.length > 0 && (
  <section className="mt-12">
    <h2 className="text-2xl font-bold mb-6 border-b border-zinc-800 pb-3">
      Comments
    </h2>

    <div className="space-y-6">
      {comments.map((comment) => (
        <article
          key={comment.id}
          className="p-5 rounded-lg bg-zinc-900 border border-zinc-800"
        >
          <header className="flex justify-between items-center mb-3">
            <span className="font-semibold text-zinc-200">
              {comment.user?.login || 'Unknown user'}
            </span>

            <time className="text-xs text-zinc-500">
              {new Date(comment.created_at).toLocaleDateString('fi-FI')}
            </time>
          </header>

          <div
            className="prose prose-invert max-w-none text-zinc-300"
            dangerouslySetInnerHTML={{
              __html: marked.parse(comment.body || '')
            }}
          />
        </article>
      ))}
    </div>
  </section>
)}

        
      </article>
    );
  }

  /*
   * Render local MDX
   */
  const {
    content: RenderedMDX
  } = await compileMDX({
    source: contentMarkdown
  });

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 text-white">
      <header className="mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-4xl font-bold text-white mb-2">
          {title}
        </h1>

        <time className="text-sm text-zinc-500">
          {date}
        </time>
      </header>

      <div className="prose prose-invert max-w-none text-zinc-300">
        {RenderedMDX}
      </div>
    </article>
  );
}
