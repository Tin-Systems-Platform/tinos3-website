import React from 'react'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CosmosInnerWorkings from "@/markdown/tutorials-for-cosmos/cosmosinnerworkings.mdx"

const page = () => {
  return (
    <div className="prose prose-invert max-w-none">
        <Header />
        <main className="pt-16">
            <CosmosInnerWorkings />
        </main>
        <Footer />
    </div>
  )
}

export default page