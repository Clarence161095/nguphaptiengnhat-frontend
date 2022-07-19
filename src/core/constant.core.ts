const POKEMON = {
  POKEMON_BACKGROUND: {
    POKEMON_NUMBER_IN_BACKGROUND: 20,
    SPEED_OF_POKEMON_BACKGROUND: 16,
    TIME_SPEED_OF_POKEMON_BACKGROUND: 2,
  },
  POKEMON_IMAGE: {
    GIF_GITHUB_URL:
      'https://raw.githubusercontent.com/Clarence161095/pokemon_data/main/animated/material/',
    GIF_POKEMON_SPRITE_URL:
      'https://raw.githubusercontent.com/Clarence161095/pokemon_data/main/animated/',
    IMAGE:
      'https://raw.githubusercontent.com/Clarence161095/pokemon_data/main/images/',
  },
};

const COLOR = {
  MainBackgroundColor: '#192a56',
};

const CONSTANT = {
  ...COLOR,
  ...POKEMON,
};

export default CONSTANT;
