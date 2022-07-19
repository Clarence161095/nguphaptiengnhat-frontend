/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import GrammarApi from '../../api/grammar.api';
import * as data from '../../core/data';
import * as util from '../../core/util.core';
import { RadioSwitch, SelectOptions } from '../common/Bootstrap.component';

const getStoreBool = (name: string) => {
  return localStorage.getItem(name)
    ? localStorage.getItem(name) === 'true'
      ? true
      : false
    : true;
};

const config = { FIRST_SLICE: 9 };

const putData = _.throttle((data) => {
  GrammarApi.PATCH(data);
}, 30000);

function GrammarPage() {
  const [includeLowLevelSwitch, setIncludeLowLevelSwitch] = useState(
    getStoreBool('includeLowLevelSwitch')
  );
  const [flowLevelJLPTSwitch, setFlowLevelJLPTSwitch] = useState(
    getStoreBool('flowLevelJLPTSwitch')
  );
  const [listProcessSwitch, setListProcessSwtich] = useState(
    getStoreBool('listProcessSwitch')
  );
  const [controlSwitch, setControlSwitch] = useState(getStoreBool('controlSwitch'));
  const [processInfoSwitch, setProcessInfoSwitch] = useState(
    getStoreBool('processInfoSwitch')
  );
  const [listProcessLimit, setListProcessLimit] = useState(
    localStorage.getItem('listProcessLimit')
      ? Number(localStorage.getItem('listProcessLimit'))
      : 50
  );
  const [allData, setAllData] = useState(
    localStorage.getItem('allGrammarData')
      ? (JSON.parse(String(localStorage.getItem('allGrammarData'))) as any[])
      : ([] as any[])
  );
  const [grammarInfo, setGrammarInfo] = useState(false);
  const [processList, setProcessList] = useState([] as any);
  const [currentSen, setCurrentSen] = useState({} as any);
  const [currentLevel, setCurrentLevel] = useState(
    localStorage.getItem('currentLevel')
      ? Number(localStorage.getItem('currentLevel'))
      : 75
  );
  const [currentLevelJLPT, setCurrentLevelJLPT] = useState(
    localStorage.getItem('currentLevelJLPT')
      ? localStorage.getItem('currentLevelJLPT')
      : 'N3'
  );
  const [learnMode, setlearnMode] = useState(
    localStorage.getItem('learnMode')
      ? localStorage.getItem('learnMode')
      : data.learnMode[0]
  );

  const [switchMode, setSwitchMode] = useState(data.learnMode[0] as any);
  const learnModeRef = useRef(data.learnMode[0] as any);
  const sentenceRef = useRef(currentSen as any);

  function getCurrentGram(processList: any) {
    let _form = 0;
    let _to = currentLevel;
    if (flowLevelJLPTSwitch) {
      if (!includeLowLevelSwitch) {
        _form = data.level[currentLevelJLPT || 'N3']['from'];
      }
      _to = data.level[currentLevelJLPT || 'N3']['to'];
    }
    const _list = _.filter(processList, (item) => {
      return item.gramIndex >= _form && item.gramIndex <= _to;
    });
    const listPipe = _.sortBy(
      _list.map((item) => {
        return { ...item, forgetAfter: util.getForgetAfter(item) };
      }),
      ['forgetAfter', 'desc']
    );
    setProcessList(listPipe);
    const listPipeSlice = listPipe.slice(0, config.FIRST_SLICE);
    return listPipeSlice[
      _.random(
        0,
        config.FIRST_SLICE >= listPipeSlice.length - 1
          ? listPipeSlice.length - 1
          : config.FIRST_SLICE
      )
    ];
  }

  const getData = async () => {
    const res: any = await GrammarApi.GET();
    const _data = res?.data?.data;
    localStorage.setItem('allGrammarData', res?.data?.data);
    return JSON.parse(_data);
  };

  useEffect(() => {
    const fetch = async () => {
      setAllData(await getData());
    };
    fetch();
  }, []);

  useEffect(() => {
    setCurrentSen(getCurrentGram(allData));
  }, [
    includeLowLevelSwitch,
    currentLevelJLPT,
    flowLevelJLPTSwitch,
    currentLevel,
    allData,
  ]);

  useEffect(() => {
    learnModeRef.current = learnMode;
    setSwitchMode(learnMode);
  }, [learnMode]);

  const updateData = (sen: any) => {
    const _data = allData.map((data) => {
      if (data?.id === sen?.id) {
        return sen;
      }
      return data;
    });
    setAllData(_data);
    putData(_data);
  };

  async function forgot() {
    const sen = currentSen;
    if (sen.process >= 1) sen.process = sen.process - 1;
    sen.last_time = new Date().getTime();
    sen.time_chart.push({ type: 'forgot', time: sen.last_time });
    sen.last_time += 10 * 60 * 1000;

    updateData(sen);
    next();
  }

  async function remember() {
    if (currentSen.forgetAfter <= 0) {
      const sen = currentSen as any;
      sen.process = sen.process + 1;
      sen.last_time = new Date().getTime();
      sen.time_chart.push({ type: 'remember', time: sen.last_time });
      updateData(sen);
    }
    next();
  }

  const prev = () => {
    setCurrentSen(sentenceRef.current);
    setSwitchMode(learnModeRef.current);
    setGrammarInfo(false);
  };

  const next = async () => {
    sentenceRef.current = currentSen;
    setCurrentSen(getCurrentGram(allData));
    setSwitchMode(learnModeRef.current);
    setGrammarInfo(false);
  };

  const getCurrentProcess = () => {
    const totalLearned = processList.length * 12;
    let redmine = 0;
    const totalCurProcess = processList
      .map((e: { last_time: number; forgetAfter: number; process: any }) => {
        if (e.last_time !== 0 && e.forgetAfter === 0) {
          redmine++;
        }
        return e.process;
      })
      .reduce((prev: any, cur: any) => {
        return prev + cur;
      });
    setListProcessLimit(processList.length);
    localStorage.setItem('listProcessLimit', processList.length);
    toast(
      <div>
        {' '}
        <span className="text-orange-600">練習言葉:{redmine}</span> <br />{' '}
        <span>現在目標:{processList.length}</span> <br />{' '}
        <span>勉強した回:{totalCurProcess}</span> <br />{' '}
        <span> 進捗:{Math.round((totalCurProcess / totalLearned) * 100)}% </span>{' '}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-2 m-[1rem] w-[95vw]">
      {' '}
      <RadioSwitch
        setState={setControlSwitch}
        state={controlSwitch}
        callBack={(value: string) => {
          localStorage.setItem('controlSwitch', value);
        }}
        title="コントロール"
      />{' '}
      {controlSwitch && (
        <div className="space-y-2 min-w-[40vw]">
          {' '}
          <div className="flex flex-row space-x-4">
            {' '}
            <RadioSwitch
              setState={setFlowLevelJLPTSwitch}
              state={flowLevelJLPTSwitch}
              callBack={(value: string) => {
                localStorage.setItem('flowLevelJLPTSwitch', value);
              }}
              title="JLPTスタイル"
            />{' '}
            <RadioSwitch
              setState={setProcessInfoSwitch}
              state={processInfoSwitch}
              callBack={(value: string) => {
                localStorage.setItem('processInfoSwitch', value);
              }}
              title="進捗情報"
            />{' '}
          </div>{' '}
          <div className="flex flex-row items-center space-x-4">
            {' '}
            {flowLevelJLPTSwitch && (
              <SelectOptions
                className="text-black text-lg h-[28px] rounded p-1 w-[100px]"
                setState={setCurrentLevelJLPT}
                state={currentLevelJLPT}
                callBack={(value: string) => {
                  localStorage.setItem('currentLevelJLPT', value);
                }}
                options={data.level.list}
              />
            )}{' '}
            {!flowLevelJLPTSwitch && (
              <input
                type="number"
                className="text-lg  w-[100px]"
                value={currentLevel}
                onChange={(e: any) => {
                  setCurrentLevel(e.target.value);
                  localStorage.setItem('currentLevel', e.target.value);
                }}
                placeholder="最大文法索引"
              />
            )}{' '}
            <SelectOptions
              className="text-black text-lg h-[28px] rounded p-1 w-[100px]"
              setState={setlearnMode}
              state={learnMode}
              callBack={(value: string) => {
                localStorage.setItem('learnMode', value);
              }}
              options={data.learnMode}
            />{' '}
            {flowLevelJLPTSwitch && (
              <RadioSwitch
                setState={setIncludeLowLevelSwitch}
                state={includeLowLevelSwitch}
                callBack={(value: string) => {
                  localStorage.setItem('includeLowLevelSwitch', value);
                }}
                title="下位階層レベル含み"
              />
            )}{' '}
          </div>{' '}
        </div>
      )}{' '}
      <div className="flex flex-col items-center space-y-2">
        {' '}
        <div
          className={`flex flex-col w-[90vw] h-[73vh] border-[1px] border-gray-300 rounded p-2 overflow-auto `}
        >
          {' '}
          <div className="space-x-2 flex flex-row justify-end mb-2">
            {' '}
            <button
              className="bg-[#2980b9] border-[1px] rounded px-2 pt-2 pb-1 border-gray-300 hover:bg-[#8e44ad] hover:shadow-sm hover:shadow-[#ecf0f1]"
              onClick={prev}
            >
              前
            </button>
            <button
              className="bg-[#2980b9] border-[1px] rounded px-2 pt-2 pb-1 border-gray-300 hover:bg-[#8e44ad] hover:shadow-sm hover:shadow-[#ecf0f1]"
              onClick={getCurrentProcess}
            >
              レポート
            </button>
            <button
              className="bg-[#2980b9] border-[1px] rounded px-2 pt-2 pb-1 border-gray-300 hover:bg-[#8e44ad] hover:shadow-sm hover:shadow-[#ecf0f1]"
              onClick={() => {
                if (switchMode !== 'jpvn') {
                  learnModeRef.current = switchMode;
                  setSwitchMode('jpvn');
                } else {
                  setSwitchMode(learnModeRef.current);
                }
              }}
            >
              スイッチ
            </button>
            <button
              className="bg-[#2980b9] border-[1px] rounded px-2 pt-2 pb-1 border-gray-300 hover:bg-[#8e44ad] hover:shadow-sm hover:shadow-[#ecf0f1]"
              onClick={next}
            >
              次
            </button>
          </div>{' '}
          {['jpvnro', 'jpvn', 'vn'].includes(switchMode) && (
            <div className="text-[0.8rem]"> {currentSen?.reibunVN} </div>
          )}{' '}
          {['jpvnro', 'jpvn', 'jpro', 'jp'].includes(switchMode) && (
            <div className="text-[1.4rem] mb-2 mt-2"> {currentSen?.reibunJA} </div>
          )}{' '}
          {['jpvnro', 'jpro'].includes(switchMode) && (
            <div className="text-[0.5rem] opacity-50"> {currentSen?.reibunRO} </div>
          )}{' '}
          {processInfoSwitch && (
            <div className="text-[0.7rem] mt-2">
              {' '}
              {/* <div>忘れ時:</div> */}{' '}
              <div>
                {' '}
                概要: {data.gram[currentSen?.gramIndex]?.name}・{' '}
                {data.gram[currentSen?.gramIndex]?.description} ・{' '}
                <span className="border-[1px] pl-1 pr-1 rounded bg-[#6ab04c] text-white">
                  {' '}
                  {currentSen?.gramIndex}{' '}
                </span>{' '}
                ・{' '}
                <span
                  className={`rounded py-[1px] px-2 text-white ${
                    currentSen?.process <= 2
                      ? 'bg-[#eb4d4b]'
                      : currentSen?.process >= 3 && currentSen?.process <= 8
                      ? 'bg-[#4834d4]'
                      : 'bg-[#6ab04c]'
                  }`}
                >
                  {' '}
                  {currentSen?.process} {'回・('}{' '}
                  {Math.round((currentSen?.process / 12) * 100)} %{')'}{' '}
                </span>{' '}
              </div>{' '}
            </div>
          )}{' '}
          {grammarInfo && (
            <div className="flex flex-col mt-2 text-[0.8rem]">
              {' '}
              <div className="flex flex-row justify-between p-1 border-[1px] border-gray-300">
                {' '}
                {data.gram[currentSen?.gramIndex]?.name}・{' '}
                {data.gram[currentSen?.gramIndex]?.description}{' '}
              </div>{' '}
              <ul className="p-1 border-[1px] border-gray-300">
                {' '}
                {data.gram[currentSen?.gramIndex]?.meaning.map((mean: any) => {
                  return (
                    <li key={mean.value + new Date().getTime()}> ・{mean.value} </li>
                  );
                })}{' '}
              </ul>{' '}
              <ul className="p-1 border-[1px] border-gray-300">
                {' '}
                {data.gram[currentSen?.gramIndex]?.use.map((use: any) => {
                  return <li key={use.value}> ・{use.value} </li>;
                })}{' '}
              </ul>{' '}
              <ul className="p-1 border-[1px] border-gray-300 min-h-[22vh] h-[25%] overflow-auto">
                {' '}
                {data.gram[currentSen?.gramIndex]?.sentence.map(
                  (sentence: any, index: number) => {
                    return (
                      <li key={sentence?.reibunJA + new Date().getTime()}>
                        {' '}
                        <div>
                          {' '}
                          Ex {index + 1}: {sentence?.reibunJA} <br />{' '}
                          <span className="text-[0.6rem]">
                            {' '}
                            {sentence?.reibunVN}{' '}
                          </span>{' '}
                          <br />{' '}
                          <span className="text-[0.5rem] opacity-50">
                            {' '}
                            {sentence?.reibunRO}{' '}
                          </span>{' '}
                        </div>{' '}
                      </li>
                    );
                  }
                )}{' '}
              </ul>{' '}
            </div>
          )}{' '}
        </div>{' '}
        <div className="flex flex-row mt-4 space-x-2">
          {' '}
          <button
            className="bg-[#e67e22] border-[1px] rounded px-2 pt-2 pb-1 border-gray-300 hover:bg-[#8e44ad] hover:shadow-sm hover:shadow-[#ecf0f1]"
            onClick={forgot}
          >
            {' '}
            ✖忘れる{' '}
          </button>{' '}
          <button
            className="bg-[#2980b9] border-[1px] rounded px-2 pt-2 pb-1 border-gray-300 hover:bg-[#8e44ad] hover:shadow-sm hover:shadow-[#ecf0f1]"
            onClick={() => {
              setGrammarInfo(!grammarInfo);
              if (switchMode !== 'jpvnro') {
                learnModeRef.current = switchMode;
                setSwitchMode('jpvnro');
              } else {
                setSwitchMode(learnModeRef.current);
              }
            }}
          >
            {' '}
            情報示す{' '}
          </button>{' '}
          <button
            className="bg-[#27ae60] border-[1px] rounded px-2 pt-2 pb-1 border-gray-300 hover:bg-[#8e44ad] hover:shadow-sm hover:shadow-[#ecf0f1]"
            onClick={remember}
          >
            {' '}
            〇覚える{' '}
          </button>{' '}
        </div>{' '}
        <div className="flex flex-row items-center space-x-4">
          {' '}
          <RadioSwitch
            setState={setListProcessSwtich}
            state={listProcessSwitch}
            callBack={(value: string) => {
              localStorage.setItem('listProcessSwitch', value);
            }}
            title="進捗状況一覧"
          />{' '}
          {listProcessSwitch && (
            <input
              type="number"
              className="text-black text-lg h-[30px] rounded p-1 w-[100px]"
              value={listProcessLimit}
              onChange={(e: any) => {
                setListProcessLimit(e.target.value);
                localStorage.setItem('listProcessLimit', e.target.value);
              }}
              placeholder="最大文法索引"
            />
          )}{' '}
        </div>{' '}
        {listProcessSwitch && (
          <div>
            {' '}
            {processList.slice(0, listProcessLimit).map((process: any) => {
              return (
                <div
                  key={process?.reibunJA + new Date().getTime()}
                  className="w-[90vw] border-[1.5px] border-gray-500 p-2"
                >
                  {' '}
                  <div className="text-[1.2rem] mb-2">
                    {' '}
                    {process?.reibunJA}{' '}
                  </div>{' '}
                  <div className="text-[0.8rem]"> {process?.reibunVN} </div>{' '}
                  {processInfoSwitch && (
                    <div className="mt-3">
                      {' '}
                      <div>
                        {' '}
                        忘れ時: {util.getTime(process.forgetAfter)} 後{' '}
                      </div>{' '}
                      <div>
                        {' '}
                        進捗状況:{' '}
                        <span
                          className={`rounded py-[1px] px-2 ${
                            process?.process <= 2
                              ? 'bg-[#e74c3c]'
                              : process?.process >= 3 && process?.process <= 8
                              ? 'bg-[#3498db]'
                              : 'bg-[#6ab04c]'
                          }`}
                        >
                          {' '}
                          {process?.process} {'回・('}{' '}
                          {Math.round((process?.process / 12) * 100)} %{')'}{' '}
                        </span>{' '}
                      </div>{' '}
                    </div>
                  )}{' '}
                </div>
              );
            })}{' '}
          </div>
        )}{' '}
      </div>{' '}
    </div>
  );
}
export default GrammarPage;
