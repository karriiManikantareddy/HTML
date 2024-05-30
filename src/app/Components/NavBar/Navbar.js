import React from "react";

const NavBar = () => {
  return (
    <>
      <nav className="flex items-center justify-end p-[20px] mr-[40px]">
        <ul className="flex space-x-10 text-lg p-[6px]  text-black right-0 bg-light-blue-200">
          <li className="cursor-pointer text-[20px] hover:text-blue-500 active:text-blue-500">
            <a href="home">Home</a>
          </li>
          <li className=" cursor-pointer text-[20px]">Contact</li>
          <li className="cursor-pointer text-[20px]">About</li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
