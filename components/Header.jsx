import React from 'react'
import Link from "next/link"

const Header = () => {
  return (
    <div className="absolute inset-x-0 top-0 flex bg-zinc-800">
        <Link href="/" className="font-bold font-white text-2xl pl-4 pb-5 pt-2">Tinos3</Link>

        <div id="header-buttons" className="absolute top-0 right-0 flex pr-4 pt-4 bg-zinc-800">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded">
            <Link href="/download">Download</Link>
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 rounded ml-3 w-55">
            <Link href="/contributing-guidelines">Contributing Guidelines</Link>
          </button>
        </div>

    </div>
  )
}

export default Header
