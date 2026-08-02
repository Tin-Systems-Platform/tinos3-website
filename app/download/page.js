import React from 'react'
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const page = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <h1 className="text-2xl">Download Tinos3</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-8">
        <Link href="https://github.com/Tin-Systems-Platform/Tinos3/releases/latest">Download Latest Release</Link>
      </button>

      <h1>Looking for old releases? <Link href="https://github.com/Tin-Systems-Platform/Tinos3/releases" className="text-blue-700 underline hover:text-blue-900">Check our Older Releases</Link></h1>
      <Footer />
    </div>
  )
}

export default page
