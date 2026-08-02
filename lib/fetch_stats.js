import axios from "axios";

export const github = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Authorization: `Bearer ${process.env.GH_API_ACCESS_KEY}`,
        Accept: "application/vnd.github+json",
    },
});

export async function getRepo(owner, repo) {
    const { data } = await github.get(`/repos/${owner}/${repo}`);
    return data;
}

export async function getLatestRelease(owner, repo) {
    const { data } = await github.get(
        `/repos/${owner}/${repo}/releases/latest`
    );
    return data;
}

export async function getContributors(owner, repo) {
    const { data } = await github.get(
        `/repos/${owner}/${repo}/contributors`
    );
    return data;
}

export async function getCommits(owner, repo) {
    const { data} = await github.get(
        `/repos/${owner}/${repo}/commits`
    );
    return data.length;
}

export async function getPullRequests(owner, repo) {
    const { data } = await github.get(
        "/repos/Tin-Systems-Platform/Tinos3/pulls?state=open"
    );
    
    const openPullRequests = data.length;
    return openPullRequests;
}