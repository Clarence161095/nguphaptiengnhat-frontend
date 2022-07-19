/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { useRecoilValue } from 'recoil';
import CONSTANT from './core/constant.core';
import PokemonBackground from './pages/common/PokemonBackground.component';
import RootRouter from './routers/Root.router';
import bgPokemonState from './states/bg-pokemon.state';

function App() {
  const backGroundPokemon = useRecoilValue(bgPokemonState);

  return (
    <div className="relative flex flex-col min-h-screen text-white z-50 bg-[#192a56]">
      {backGroundPokemon && (
        <PokemonBackground
          pokemonNumber={CONSTANT.POKEMON_BACKGROUND.POKEMON_NUMBER_IN_BACKGROUND}
        />
      )}
      <RootRouter />
      <ToastContainer />
    </div>
  );
}

export default App;
