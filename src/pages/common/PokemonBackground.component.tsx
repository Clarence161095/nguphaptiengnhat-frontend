/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import CONSTANT from '../../core/constant.core';
import util from '../../core/utilities.core';

const PokemonImage = (props: any) => {
  const pokemonId = useRef(_.random(1, 649));
  const isBack = useRef(false);
  const position = useRef({ x: _.random(-10, 110), y: _.random(-10, 110) });

  const calculatePosition = () => {
    if (position.current.x > 110) {
      position.current.x = 100;
    }
    if (position.current.y > 110) {
      position.current.y = 100;
    }
    if (position.current.x < -10) {
      position.current.x = 0;
    }
    if (position.current.y < -10) {
      position.current.y = 0;
    }
  };
  useEffect(() => {
    const _condition = _.random(1, 8);
    const speed = CONSTANT.POKEMON_BACKGROUND.SPEED_OF_POKEMON_BACKGROUND;
    calculatePosition();
    switch (_condition) {
      case 1:
        position.current.x += _.random(1, speed) * 0;
        position.current.y += _.random(1, speed) * -1;
        isBack.current = true;
        break;
      case 2:
        position.current.x += _.random(1, speed) * 1;
        position.current.y += _.random(1, speed) * -1;
        isBack.current = true;
        break;
      case 3:
        position.current.x += _.random(1, speed) * 1;
        position.current.y += _.random(1, speed) * 0;
        isBack.current = true;
        break;
      case 4:
        position.current.x += _.random(1, speed) * 1;
        position.current.y += _.random(1, speed) * 1;
        isBack.current = false;
        break;
      case 5:
        position.current.x += _.random(1, speed) * 0;
        position.current.y += _.random(1, speed) * 1;
        isBack.current = false;
        break;
      case 6:
        position.current.x += _.random(1, speed) * -1;
        position.current.y += _.random(1, speed) * 1;
        isBack.current = false;
        break;
      case 7:
        position.current.x += _.random(1, speed) * -1;
        position.current.y += _.random(1, speed) * 0;
        isBack.current = false;
        break;
      case 8:
        position.current.x += _.random(1, speed) * -1;
        position.current.y += _.random(1, speed) * -1;
        isBack.current = false;
        break;
      default:
        break;
    }
  }, [props.position]);
  return (
    <div>
      <img
        className={`opacity-[0.2] scale-150`}
        src={util.getPokemonSpriteUrl({
          id: pokemonId.current,
          isBack: isBack.current,
        })}
        alt="Pokemon"
        style={{
          position: 'absolute',
          left: `${position.current.x}%`,
          top: `${position.current.y}%`,
          transition: `all ${
            CONSTANT.POKEMON_BACKGROUND.TIME_SPEED_OF_POKEMON_BACKGROUND * 1.5
          }s linear`,
          width: 'auto',
        }}
      />
    </div>
  );
};

const PokemonBackground = (props: any) => {
  const [position, setPosition] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setPosition(_.random(1, 10000));
    }, CONSTANT.POKEMON_BACKGROUND.TIME_SPEED_OF_POKEMON_BACKGROUND * 1000);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 overflow-hidden min-w-[100vw] 
        max-w-[100vw] min-h-screen -z-50"
    >
      {_.times(props.pokemonNumber, Number).map((key) => {
        return <PokemonImage key={key} position={position} />;
      })}
    </div>
  );
};

export default PokemonBackground;
