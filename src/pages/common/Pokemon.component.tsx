import React, { useState } from 'react';
import util from '../../core/utilities.core';

export const Pokemon = (props: any) => {
  const [fixSize, setFixSize] = useState(0);

  const onImgLoad = (pro: any) => {
    if (pro.target.offsetWidth > 110) {
      setFixSize(110 - pro.target.offsetWidth);
    } else if (pro.target.offsetWidth < 50) {
      setFixSize(25);
    } else {
      setFixSize(0);
    }
  };

  return (
    <div className="w-[85px] h-[85px] flex flex-row flex-wrap-reverse items-start relative">
      {props?.id && (
        <img
          onLoad={onImgLoad}
          src={util.getPokemonSpriteUrl(props)}
          alt="pokemon"
          className="w-auto absolute"
          style={{ transform: `translateX(${fixSize}px)` }}
        />
      )}

      {props?.shadow && (
        <div
          className="absolute w-[65px] h-[65px] rounded-[50%] bg-[#34495ea1]
        skew-y-[-30deg] rotate-[50deg] translate-x-[10px] translate-y-[20px] opacity-40 z-[-5]"
        ></div>
      )}

      {props?.isShiny && (
        <img
          className="absolute translate-y-[20px]"
          src="https://raw.githubusercontent.com/Clarence161095/my-store-data/master/src/assets/data/pokemon-material/shiny-background/water-shine-1.gif"
          alt="shiny"
        />
      )}
    </div>
  );
};
