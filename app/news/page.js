import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import axios from 'axios';

async function getLocalPosts() {
  const dir = path.join(process.cwd(), 'news/content');
  if (!fs.existsSync(dir)) return [];
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));
  return files.map(filename => {
    const fileContent = fs.readFileSync(path.join(dir, filename), 'utf-8');
    const { data } = matter(fileContent);
    return {
      slug: filename.replace('.mdx', ''),
      title: data.title || 'Untitled Local Post',
      date: data.date ? new Date(data.date) : new Date(),
      summary: data.summary || '',
      source: 'Local'
    };
  });
}

async function getGithubPosts() {
  if (!process.env.GITHUB_ACCESS_TOKEN) return [];
  
  const query = `
    query {
      repository(owner: "Tin-Systems-Platform", name: "Tinos3") {
        discussions(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            id
            title
            createdAt
            bodyText
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post('https://api.github.com/graphql', { query }, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Tinos3-App'
      }
    });
    
    return (response.data.data.repository.discussions.nodes || []).map(node => ({
      slug: node.id, 
      title: node.title,
      date: new Date(node.createdAt),
      summary: node.bodyText,
      source: 'GitHub'
    }));
  } catch (e) {
    console.error("GitHub search failed, using only local posts", e.message);
    return [];
  }
}

export default async function NewsIndex() {
  // Haetaan rinnakkain molemmista lähteistä
  const [localPosts, githubPosts] = await Promise.all([getLocalPosts(), getGithubPosts()]);
  
  // Yhdistetään ja järjestetään päivämäärän mukaan (uusin ensin)
  const allPosts = [...localPosts, ...githubPosts].sort((a, b) => b.date - a.date);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white">
      <h1 className="text-3xl font-bold mb-8">Tinos OS Devlogs & News</h1>
      <div className="space-y-6">
        {allPosts.map((post) => (
          <Link key={post.slug} href={`/news/${post.slug}`} className="block group">
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
