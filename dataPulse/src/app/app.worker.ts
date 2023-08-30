/// <reference lib="webworker" />

import { tableItem } from './table-item';
import { convertDataToBuffer } from './util/convert-data-to-buffer';
import { ITableItem } from './interfaces/table-item';

addEventListener('message', ({ data }) => {
  if (data === 'stop') {
    stop();
    return;
  }
  const { interval, arraySize } = data;

  if (interval && arraySize) {
    start(interval, arraySize);
  }
});

let currentInterval: any;

function generateRandomData() {
  const randomId = Math.random().toString(36).substr(2, 9);
  const randomInt = Math.floor(Math.random() * 100);
  const randomFloat = parseFloat((Math.random() * 100).toFixed(18));
  const randomColor = getRandomColor();
  const child = {
    id: Math.random().toString(36).substr(2, 9),
    color: getRandomColor(),
  };

  return new tableItem(randomId, randomInt, randomFloat, randomColor, child);
}

function getRandomColor(): string {
  return (
    '#' +
    ('000000' + Math.floor(Math.random() * 16777215).toString(16)).substr(-6)
  );
}

function generateDataArray(arraySize: number) {
  const dataArray = [];

  for (let i = 0; i < arraySize; i++) {
    dataArray.push(generateRandomData());
  }

  return dataArray;
}

function start(interval: number | undefined, arraySize: number) {
  if (currentInterval) {
    clearInterval(currentInterval);
  }

  currentInterval = setInterval(() => {
    const data = generateDataArray(arraySize);
    const itemsToPresent = data.slice(-10);

    const buffer = convertDataToBuffer(itemsToPresent);
    postMessage(buffer, [buffer]);
  }, interval);
}

function stop() {
  if (currentInterval) {
    clearInterval(currentInterval);
  }
}
