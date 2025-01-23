import React from "react";
import { NavbarMenu } from "../../mockData/data";
import { MdMenu } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import ResponsiveMenu from "./ResponsiveMenu";
import { motion } from "framer-motion";
import logoBasket from "../../assets/Logo/basket.png"
import logoFoot from "../../assets/Logo/foot.png"
import logohand from "../../assets/Logo/hand.png"
import logoTennis from "../../assets/Logo/tennis.png"


const Navbar = () => {
  const [open, setOpen] = React.useState(false);
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
            <img src={logoBasket} alt="ArenaLink"  className="absolute top-0 left-0 opacity-0 animate-changeLogo" style={{ animationDelay: '0s' }} />
            <img src={logoFoot} alt="ArenaLink"  className="absolute top-0 left-0 opacity-0 animate-changeLogo" style={{ animationDelay: '2s' }} />
            <img src={logohand} alt="ArenaLink"  className="absolute top-0 left-0 opacity-0 animate-changeLogo" style={{ animationDelay: '4s' }} />
            <img src={logoTennis} alt="ArenaLink"  className="absolute top-0 left-0 opacity-0 animate-changeLogo" style={{ animationDelay: '6s' }} />
          </div>
          {/* Menu section */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-6 text-gray-600">
              {NavbarMenu.map((item) => {
                return (
                  <li key={item.id}>
                    <a
                      href={item.link}
                      className="
                    inline-block py-1 px-3 hover:text-primary font-semibold"
                    >
                      {item.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Icons section */}
          <div className="flex items-center gap-4">
            <button className="text-2xl hover:bg-primary hover:text-white rounded-full p-2 duration-200">
              <CiSearch />
            </button>
            <button className="hover:bg-primary text-primary font-semibold hover:text-white rounded-md border-2 border-primary px-6 py-2 duration-200 hidden md:block">
              Login
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
