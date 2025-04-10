import React from "react";
import { NavbarMenu } from "../mockData/data";
import { MdMenu } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import ResponsiveMenu from "./ResponsiveMenu";
import { motion } from "framer-motion";

import logoBasket from "../../../asset/Logo/basket.png";
import logoFoot from "../../../asset/Logo/foot.png";
import logohand from "../../../asset/Logo/hand.png";
import logoTennis from "../../../asset/Logo/tennis.png";

import { Head, Link } from '@inertiajs/react';

const Navbar = () => {
  const [open, setOpen] = React.useState(false);

  // Function to handle smooth scrolling
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="container flex justify-between items-center py-8"
        >
          {/* Logo section */}
          <div className="relative mb-12 w-80">
            <img
              src={logoBasket}
              alt="ArenaLink"
              className="absolute top-0 left-0 opacity-0 animate-changeLogo"
              style={{ animationDelay: "0s" }}
            />
            <img
              src={logoFoot}
              alt="ArenaLink"
              className="absolute top-0 left-0 opacity-0 animate-changeLogo"
              style={{ animationDelay: "2s" }}
            />
            <img
              src={logohand}
              alt="ArenaLink"
              className="absolute top-0 left-0 opacity-0 animate-changeLogo"
              style={{ animationDelay: "4s" }}
            />
            <img
              src={logoTennis}
              alt="ArenaLink"
              className="absolute top-0 left-0 opacity-0 animate-changeLogo"
              style={{ animationDelay: "6s" }}
            />
          </div>

          {/* Menu section */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-6 text-gray-900">
              {NavbarMenu.map((item) => {
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleScroll(item.link.replace("#", ""))} // Use button for smooth scrolling
                      className="inline-block py-1 px-3 hover:text-primary font-semibold"
                    >
                      {item.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Icons section */}
          <div className="flex items-center gap-4">
           
          <button className="hover:bg-primary text-primary font-semibold rounded-md border-2 border-primary px-6 py-2 duration-200 hidden md:block">
  <Link
    href={route('login')}
    className="block rounded-md px-3 py-2 text-black hover:text-white transition duration-200 focus:outline-none"
  >
    Login
  </Link>
</button>
<button className=" hover:bg-primary text-primary font-semibold rounded-md border-2 border-primary px-6 py-2 duration-200 hidden md:block">
  <Link
    href={route('register')}
    className="block rounded-md px-3 py-2 text-black hover:text-white transition duration-200 focus:outline-none"
  >
    Register
  </Link>
</button>
          </div>

          {/* Mobile hamburger Menu section */}
          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <MdMenu className="text-4xl" />
          </div>
        </motion.div>
      </nav>

      {/* Mobile Sidebar section */}
      <ResponsiveMenu open={open} />
    </>
  );
};

export default Navbar;