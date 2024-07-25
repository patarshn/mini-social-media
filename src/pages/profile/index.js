import Head from "next/head";
import styles  from "@/styles/neumorphic.module.css"
import Link from "next/link";

export default function ProfileIndex() {
    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <style>
                    
                </style>
            </Head>
            
            <div className="flex w-full lg:h-screen flex-col lg:flex-row">
    {/* <!-- Left Side - Logo --> */}
    <div className="md:flex md:flex-1 items-center justify-center bg-black">
      <img src="/io.png" alt="Logo" className="lg:w-1/2 w-1/4 rounded-[80px] mt-20 mx-auto h-auto"/>
    </div>

    {/* <!-- Right Side - Form --> */}
    <div className="flex-1 flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-white ">Login</h2>
        <form>
          <div className="mb-4">
            <label for="email" className="block text-white font-medium mb-2 focus:border-gradient-to-r focus:border-from-green-500 focus:border-to-sky-500">Email</label>
            <input type="email" id="email" className="input input-bordered rounded-full w-full" placeholder="Enter your email"/>
          </div>
          <div className="mb-6">
            <label for="password" className="block text-white font-medium mb-2">Password</label>
            <input type="password" id="password" className="input input-bordered rounded-full w-full" placeholder="Enter your password"/>
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="btn rounded-full w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white hover:from-green-500 hover:to-sky-500">Login</button>
          </div>
          <div className="flex items-center justify-center pt-2">
            <span className="text-white">Don't have account? <Link href={"/register"} className="text-extrabold bg-gradient-to-r from-pink-500 to-yellow-500 inline-block text-transparent bg-clip-text hover:from-green-500 hover:to-sky-500">Regiser Here</Link> </span>
          </div>
        </form>
      </div>
    </div>
  </div>

        </>
    );
}
