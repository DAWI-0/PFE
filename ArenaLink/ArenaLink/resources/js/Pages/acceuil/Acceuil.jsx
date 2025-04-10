    import React from "react";

    import Img1 from "../../asset/jjjj/2.png";
    import Img2 from "../../asset/jjjj/3.png";
    import Navbar from "./Navbar/Navbar";
    import Hero from "./Hero/Hero";
    import Equipments from "./Equipments/Equipments";
    import Banner from "./Banner/Banner";
    import TabComp from "./Tab/TabComp";
    import Testimonials from "./Testimonials/Testimonials";
    import Footer from "./Footer/Footer";
//



    const BannerData = {
    image: Img1,
    title: "Chez ARENALINK, Prendre Soin De Vous Est Une Priorité",
    subtitle:
        "Rejoignez une communauté passionnée, participez à des événements sportifs et dépassez vos limites avec ARENALINK.",
    link: "#",
    };
    const Banner2Data = {
    image: Img2,
    title: "Votre Corps Est Votre Meilleur Atout",
    subtitle:
        " Que vous soyez débutant ou expert, ARENALINK vous aide à atteindre vos objectifs et à repousser vos limites.",
    link: "#",
    };

    const bgStyle = {
    
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    };
    const Acceuil = () => {
    return (
        <div className="overflow-x-hidden">
        <div style={bgStyle}>
        <Navbar/>
            <Hero />
        </div>
        <Equipments />
        <Banner {...BannerData} />
        <TabComp />
        <Banner {...Banner2Data} />
        <Testimonials />
        <Footer /> 
        
        </div>
    );
    };

    export default Acceuil;
