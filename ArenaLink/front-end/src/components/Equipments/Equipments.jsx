import React from "react";
import { TbSoccerField } from "react-icons/tb";
import { GiSoccerBall } from "react-icons/gi";
import { GiLaurelsTrophy } from "react-icons/gi";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { motion } from "framer-motion";
import { SlideLeft } from "../../utility/animation";

const EquipmentData = [
  
  {
    id: 1,
    title: "Des Stades Haut de Gamme",
    desc: "Des espaces modernes pour matchs, entraînements et événements.",
    icon: <TbSoccerField />,
    delay: 0.3,
  },
  {
    id: 2,
    title: "Équipements Professionnels",
    desc: "Matériel de qualité pour stades, équipes et particuliers.",
    link: "/",
    icon: <GiSoccerBall />,
    delay: 0.6,
  },
  {
    id: 3,
    title: "Compétitions Passionnantes",
    desc: "Participez ou organisez des tournois et défiez les meilleurs.",
    link: "/",
    icon: <GiLaurelsTrophy />,
    delay: 0.9,
  },
  {
    id: 4,
    title: "Tranquillité d'Esprit",
    desc: "Profitez de réservations faciles, d'équipements fiables et d'un support toujours là pour vous.",
    link: "/",
    icon: < FaHandHoldingHeart/>,
    delay: 1.2,
  },
];
const Equipments = () => {
  return (
    <div>
      <div className="container py-24">
        <div className="grid grid-cols-1 gap-6 font-playfair">
          {/* Titre et paragraphe */}
          <div className="space-y-4 p-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              Ce Que Nous Vous Offrons
            </h1>
            <p className="text-gray-500">
              Stades, équipements, compétitions et tranquillité d'esprit – tout pour vivre le sport à 100%.
            </p>
          </div>

          {/* Cartes d'équipements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {EquipmentData.map((item) => (
              <motion.div
                variants={SlideLeft(item.delay)}
                initial="hidden"
                whileInView="visible"
                key={item.id}
                className="bg-gray-100 space-y-4 p-6 hover:bg-white rounded-xl hover:shadow-[0_0_22px_0_rgba(0,0,0,0.15)]"
              >
                <div className="text-4xl">{item.icon}</div>
                <p className="text-2xl font-semibold">{item.title}</p>
                <p className="text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipments;
