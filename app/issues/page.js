export const dynamic = 'force-dynamic';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import axios from 'axios';

async function getGithubPosts() {
  if (!process.env.GITHUB_ACCESS_TOKEN) return [];
  
 const query = `
  query {
    repository(owner: "Tin-Systems-Platform", name: "Tinos3") {
      issues(
        first: 20
        states: OPEN
        orderBy: {field: CREATED_AT, direction: DESC}
      ) {
        nodes {
          id
          number
          title
          bodyText
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
  }
`;

  try {
    const response = await axios.post('https://api.github.com/graphql?{Date.now()}', { query }, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Tinos3-App'
      }
    });
    
   return (response.data.data.repository.issues.nodes || [])
    .map(node => ({
        slug: node.number.toString(),
        number: node.number,
        title: node.title,
        date: new Date(node.createdAt),
        updatedAt: new Date(node.updatedAt),
        summary: node.bodyText,
        state: node.state,
        url: node.url,
        labels: node.labels.nodes.map(label => label.name),
        source: 'GitHub'
    }));
    } catch (e) {
        console.error("GitHub search failed due to following error:", e.message);
        return [];
    }
}

export default async function NewsIndex() {
  // Haetaan rinnakkain molemmista lähteistä
  const [githubPosts] = await Promise.all([ getGithubPosts()]);
  
  // Yhdistetään ja järjestetään päivämäärän mukaan (uusin ensin)
  const allPosts = [...githubPosts].sort((a, b) => b.date - a.date);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white">
      <h1 className="text-3xl font-bold mb-8">Tinos OS Devlogs & News</h1>
      <div className="space-y-6">
        {allPosts.map((post) => (
          <Link key={post.slug} href={`/issues/${post.slug}`} className="block group">
            <div className="p-6 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-500">{post.date.toLocaleDateString('fi-FI')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">{post.source}</span>
              </div>
              <h2 className="text-xl font-semibold group-hover:text-blue-400 mt-1 mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-zinc-400 line-clamp-2">{post.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
