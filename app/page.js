import Header from "@/components/Header"

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Header/>
      <h1> Welcome to the official Tinos3 website!</h1>
    </div>
  );
}
