import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { useState } from "react";

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className="flex items-center gap-24 h-full flex-col lg:flex-row">
      <img src="/orbital.png" alt="" className="absolute bottom-0 left-0 opacity-5 animate-[rotateOrbital_100s_linear_infinite]" style={{ zIndex: -1 }} />
      
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-8xl bg-gradient-to-r from-[#217bfe] to-[#e55571] bg-clip-text text-transparent lg:text-6xl">
          LAMA AI
        </h1>
        <h2 className="text-xl font-light">Supercharge your creativity and productivity</h2>
        <h3 className="font-normal max-w-[70%] lg:max-w-full">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat sint dolorem doloribus, architecto dolor.
        </h3>
        <Link to="/dashboard" className="mt-5 px-6 py-3 bg-[#217bfe] text-white rounded-xl text-sm hover:bg-white hover:text-[#217bfe]">
          Get Started
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center relative h-full">
        <div className="flex items-center justify-center bg-[#140e2d] rounded-3xl w-[80%] h-[50%] relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl">
            <div className="bg-[url('/bg.png')] bg-auto bg-no-repeat opacity-20 w-[200%] h-full animate-[slideBg_8s_ease-in-out_infinite_alternate]" />
          </div>

          <img src="/bot.png" alt="" className="w-full h-full object-contain animate-[botAnimate_3s_ease-in-out_infinite_alternate]" />
          
          <div className="absolute bottom-[-30px] right-[-50px] flex items-center gap-3 p-5 bg-[#2c2937] rounded-xl lg:flex">
            <img
              src={
                typingStatus === "human1"
                  ? "/human1.jpeg"
                  : typingStatus === "human2"
                  ? "/human2.jpeg"
                  : "/bot.png"
              }
              alt=""
              className="w-8 h-8 rounded-full object-cover"
            />
            <TypeAnimation
              sequence={[
                "Human:We produce food for Mice",
                2000,
                () => setTypingStatus("bot"),
                "Bot:We produce food for Hamsters",
                2000,
                () => setTypingStatus("human2"),
                "Human2:We produce food for Guinea Pigs",
                2000,
                () => setTypingStatus("bot"),
                "Bot:We produce food for Chinchillas",
                2000,
                () => setTypingStatus("human1"),
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor
              omitDeletionAnimation
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-5">
        <img src="/logo.png" alt="" className="w-4 h-4" />
        <div className="flex gap-2 text-xs text-[#888]">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
