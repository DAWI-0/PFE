import React from "react";
import heroimg from "../../assets/5.png" 
const Hero = () => {
  return <>
  <section>
    <div className="container grid grid-cols-1 md:grid-cols-2 min-h-[650px] relative">
      <div className="flex flex-col justify-center py-14 md:py-0 font-playfair">
        <div className="text-center md:text-left space-y-6">
        <h1 className="text-5xl lg:text-6xl font-bold leading-relaxed lg:leading-normal"><span className="text-primary" >ARENALINK{" "} </span> <br />Vous Donne Les Clés Du Succès{" "}</h1>
        <p className="text-gray-600 xl:max-w-[500px]">Réservez vos matchs, suivez vos progrès et connectez-vous avec
        des joueurs passionnés pour vivre une expérience unique.</p>   
        </div>
      </div>
      <div className="flex justify-center items-center">
        <img src={heroimg} alt="" className="w-[350px] md:w-[550px] xl:w-[520px] drop-shadow " />
      </div>
    </div>
  </section>
  </>;
};

export default Hero;
