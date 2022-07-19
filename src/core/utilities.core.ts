import CONSTANT from './constant.core';
import { SpriteSpeedEnum } from './enum.core';

const getGifOnGithub = (name: string) => {
  return `${CONSTANT.POKEMON_IMAGE['GIF_GITHUB_URL'] + name}.gif`;
};

const getPokemonSpriteUrl = ({
  id = 131,
  isBack = false,
  isShiny = true,
  speed = SpriteSpeedEnum.normal,
}) => {
  return `${CONSTANT.POKEMON_IMAGE['GIF_POKEMON_SPRITE_URL']}gen5_${speed}FPS${
    isBack ? '/back' : ''
  }${isShiny ? '/shiny' : ''}/${id}.gif`;
};

const getImageUrl = (name = 'home/rank.png') => {
  return `${CONSTANT.POKEMON_IMAGE['IMAGE'] + name}`;
};

const util = {
  getGifOnGithub,
  getPokemonSpriteUrl,
  getImageUrl,
};
export default util;
