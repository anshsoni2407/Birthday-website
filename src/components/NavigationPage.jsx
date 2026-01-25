import React from 'react'
import sparkle from '../../public/bg/birthday-12378_256.gif'
import heart from "../../public/bg/birthday-12378_256.gif";


const NavigationPage = () => {
  return (
    <div className="fixed w-full bg-[#ca96b3] h-full">
      <div
        className="h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${sparkle})` }}
      ></div>
      <div
        className="h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${heart})` }}
      ></div>
    </div>
  );
}

export default NavigationPage