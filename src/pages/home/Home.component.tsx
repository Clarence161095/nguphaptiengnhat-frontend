/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { LoadingCmp } from '../../components/Material.component';
import MenuCmp from '../../components/Menu.component';
import bgPokemonState from '../../states/bg-pokemon.state';
import Grammar from '../grammar/grammar.component';

export const OutSideSetting = (listSettingProps: any) => {
  const isShow = useRef(
    localStorage.getItem('backGroundPokemon') === 'false' ? false : true
  );

  return [
    {
      name: 'ON/OFF Background',
      onClick: (_props: any) => {
        listSettingProps.setBackGroundPokemon(() => {
          isShow.current = !isShow.current;
          localStorage.setItem('backGroundPokemon', `${isShow.current}`);
          return isShow.current;
        });
        _props.closeMenu();
      },
    },
  ];
};

const Home = () => {
  const setBackGroundPokemon = useSetRecoilState(bgPokemonState);

  const [loading, setLoading] = useState(false);

  const [setting, setSetting] = useState({
    isOpen: false,
    OutSideSetting: OutSideSetting({
      setBackGroundPokemon,
    }),
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="relative p-2">
      {loading && <LoadingCmp />}

      <MenuCmp
        listMenu={[
          ...setting.OutSideSetting,
          {
            name: 'Logout',
            onClick: () => {
              localStorage.clear();
              window.location.reload();
            },
          },
        ]}
        closeMenu={() => setSetting({ ...setting, isOpen: false })}
        toggleMenu={setting.isOpen}
      />

      <div className="flex flex-row justify-end">
        <i
          className="absolute bi bi-gear p-[9px] text-2xl hover:scale-[1.3]
                hover:cursor-pointer"
          onClick={() => setSetting({ ...setting, isOpen: !setting.isOpen })}
        ></i>
      </div>

      <Grammar/>
    </div>
  );
};

export default Home;
