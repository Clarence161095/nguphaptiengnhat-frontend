import { fibonacciMemory } from './data';
export function getTime(timeStamp: any) {
  const hour = timeStamp / 1000 / 60 / 60;
  if (hour >= 24) {
    return `${Math.round(hour / 24)}日 ${Math.round(hour % 24)}時間`;
  } else {
    return `${Math.round(hour)}時間`;
  }
}
export function getForgetAfter(item: any) {
  const { process, last_time } = item;
  const currentDate = new Date().getTime();
  const forgetAfter = fibonacciMemory[process] - (currentDate - last_time);
  return forgetAfter >= 0 ? forgetAfter : 0;
}
