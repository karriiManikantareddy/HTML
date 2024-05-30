import Image from "next/image";
import NavBar from "@/app/Components/NavBar/Navbar";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <main className="flex items-center justify-center w-full h-[100vh]">
        <button className="text-[30px] p-[20px] bg-blue-500 text-white rounded ">
          <Link href="/home">Home</Link>
        </button>
      </main>
    </>
  );
}
