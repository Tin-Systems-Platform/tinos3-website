import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Header/>
      <h1> Welcome to the official Tinos3 website!</h1>



      <h1> We now have a feedback form for getting YOUR feedback!!</h1>

      <iframe width="640px" height="480px" src="https://forms.cloud.microsoft/e/baFFrd8wwh?embed=true"> </iframe>
      <Footer />
    </div>
  );
}
