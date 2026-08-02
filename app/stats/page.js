import React from 'react'

import axios from "axios";

// Importing components
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { getRepo, getPullRequests } from "@/lib/fetch_stats";

export default async function Page() {
    const repo = await getRepo("Tin-Systems-Platform", "Tinos3");

    const pullRequests = await getPullRequests("Tin-Systems-Platform", "Tinos3");

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <Header/>
            <h1 className="text-3xl font-bold mb-4 mt-16">Stats: Tinos3</h1>

            <div className="flex flex-col gap-2 p-16 rounded-xl  border-4 border-gray-600">
                <p>⭐ Stars: {repo.stargazers_count}</p>
                <p>🍴 Forks: {repo.forks_count}</p>
                <p>🐞 Issues: {repo.open_issues_count}</p>
                <p>👥 Watchers: {repo.subscribers_count}</p>
                <p> Open Pull Requests: {pullRequests}</p>
            </div>

            <Footer className=" pt-8 bottom-0 w-full"/>
        </div>
    );
}
