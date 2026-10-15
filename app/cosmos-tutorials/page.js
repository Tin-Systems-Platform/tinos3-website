import React from 'react'
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const page = () => {
  return (
    <div className="prose prose-invert max-w-none">
        <Header />
        <main className="pt-16">
            <h1>Cosmos gen3 Tutorial</h1>
            <p>Welcome to the Cosmos gen3 tutorial! This tutorial will guide you through the process of setting up and using Cosmos gen3 for your projects. 
                These tutorials aren't official and are provided from my personal experience.</p>
            <p>Follwing the links below to go to the different tutorials.</p>

            <ul>
                <li><a href="/cosmos-tutorials/tutorial-1">Tutorial 1: Setting up Cosmos gen3</a></li>
                <li><a href="/cosmos-tutorials/tutorial-2">Tutorial 2: How Cosmos gen3 works and how it slips tasks to .NET</a></li>
            </ul>
        </main>
        <Footer />
    </div>
  )
}

export default page