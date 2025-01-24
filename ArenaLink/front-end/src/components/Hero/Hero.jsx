import React from "react";
import heroimg from "../../assets/5.png" 
import { motion } from "framer-motion";
import { SlideRight } from "../../utility/animation";
const Hero = () => {
  return <>
  <section>
    <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative">
      <div className="flex flex-col justify-center py-14 md:py-0 font-playfair">
        <div className="text-center md:text-left space-y-6">
        <motion.h1 
        variants={SlideRight(1.6)}
        initial="hidden"
        animate="visible"
        className="text-5xl lg:text-6xl font-bold leading-relaxed lg:leading-normal"><span className="text-primary" >ARENALINK{" "} </span> <br />Vous Donne Les Clés Du Succès{" "}</motion.h1>
        <motion.p 
        variants={SlideRight(1.9)}
        initial="hidden"
        animate="visible"
        className="text-gray-600 xl:max-w-[500px]">Réservez vos matchs, suivez vos progrès et connectez-vous avec
        des joueurs passionnés pour vivre une expérience unique.</motion.p>   
        <motion.div 
        variants={SlideRight(2.1)}
        initial="hidden"
        animate="visible"
        className="justify-center gap-8 md:justify-start">
          <button className="primary-btn flex-items-center gap-2 mt-4">Rejoignez-nous</button>
        </motion.div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <motion.img 
         variants={SlideRight(1.5)}
         initial="hidden"
         animate="visible"
        src={heroimg} alt="" className=" w-[350px] md:w-[550px] xl:w-[700px] drop-shadow " />
      </div>
    </div>
  </section>
  </>;
};

export default Hero;
