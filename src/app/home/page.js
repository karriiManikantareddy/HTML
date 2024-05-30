import React from "react";
import Image from "next/image";
import pic from "../../../public/wallpaper.jpg";
import NavBar from "../Components/NavBar/Navbar";

const Home = () => {
  return (
    <>
      <div className="container w-full flex h-full">
        <Image
          src={pic}
          alt="image not found"
          className="w-1/2 max-h-screen object-cover"
        />
        <div className="w-1/2 h-full flex flex-col">
          <NavBar />
          <div className="flex items-start justify-start flex-col m-[50px] ">
            <p className="text-[40px] font-bold mb-[30px]">
              Home Page for <br />
              your next js project
            </p>
            <p className="text-[20px] text-gray-300 mt-2 mb-[40px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vulputate
              lacinia nunc vestibulum fringilla consectetur.
            </p>
            <div className="mt-4 space-x-2">
              <button className="text-[16px] px-4 py-2 bg-blue-500 text-white rounded">
                Download
              </button>
              <button className="text-[16px] px-4 py-2 bg-green-500 text-white rounded">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
