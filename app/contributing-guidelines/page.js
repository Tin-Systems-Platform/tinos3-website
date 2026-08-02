import React from 'react'
import ContributingGuidelines from "@/markdown/contributing-guidelines.mdx"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const page = () => {
  return (
    <div className="prose prose-invert max-w-none">
        <Header />
        <main className="pt-16">
            <ContributingGuidelines />
        </main>
        <Footer />
    </div>
  )
}

export default page
