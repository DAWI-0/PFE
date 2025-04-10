import React from "react";
import {  FaFacebook, FaGlobe, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";

const Footer = () => {
  return <div id="contact" className="bg-gradient-to-r from-gray-900 to-gray-950 rounded-t-3xl">
    <div className="container">
      <div className="grid md:grid-cols-4 md:gap-4 py-5 border-t-2 border-gray-300/10 text-white">
      <div className="py-8 px-4 space-y-4">
        <div className="text-2xl flex items-center gap-2 font-bold uppercase">
          <FaGlobe/>
          <p className="text-primary">ArenaLink</p>
        </div>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam dolore iure nesciunt quis
           iste. Ab, iure, quasi temporibus alias obc
           aecati molestias, culpa saepe porro ad sit officia? Hic, laborum dolore?
           </p>
           <div className="flex items-center justify-start gap-5 !mt-6">
            <a href="#">
            <HiLocationMarker className="text-3xl"/>
            </a>
            <a href="#">
            <FaInstagram className="text-3xl"/>
            </a>
            <a href="#">
            <FaFacebook className="text-3xl"/>
            </a>
            <a href="#">
            <FaLinkedin className="text-3xl"/>
            </a>
           </div>
      </div>

      <div>
        <div className="py-8 px-4">
          <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-5">Quick Links</h1>
            <ul className="flex flex-col gap-3">
              <li> 
                 <a href="">Home</a>
              </li>
              <li> 
                 <a href="">About</a>
              </li>
              <li> 
                 <a href="">Services</a>
              </li>
              <li> 
                 <a href="">login</a>
              </li>
              
            </ul>
        </div>
     
      </div>

      <div>
        <div className="py-8 px-4">
          <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-5">company Links</h1>
            <ul className="flex flex-col gap-3">
              <li> 
                 <a href="">oue services</a>
              </li>
              <li> 
                 <a href="">contact</a>
              </li>
              <li> 
                 <a href="">privacy policy</a>
              </li>
              
            </ul>
        </div>
     
      </div>

      <div>
        <div className="py-8 px-4">
          <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-5"> ressources</h1>
            <ul className="flex flex-col gap-3">
              <li> 
                 <a href="">oue services</a>
              </li>
              <li> 
                 <a href="">contact</a>
              </li>
              <li> 
                 <a href="">privacy policy</a>
              </li>
              
            </ul>
        </div>
     
      </div>
      
    
      </div>
    </div>
  </div>;
};

export default Footer;
