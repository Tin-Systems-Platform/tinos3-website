import React from 'react'
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SettingUp from "@/markdown/tutorials-for-cosmos/settingup.mdx"

const page = () => {
  return (
    <div className="prose prose-invert max-w-none">
        <Header />
        <main className="pt-16">
            <SettingUp />
        </main>
        <Footer />
    </div>
  )
}

export default page