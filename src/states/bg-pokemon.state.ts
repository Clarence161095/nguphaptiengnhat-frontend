import { atom } from 'recoil';

const bgPokemonState = atom({
  key: 'bgPokemonState',
  default: localStorage.getItem('backGroundPokemon') === 'false' ? false : true,
});

export default bgPokemonState;
