/// <reference lib="webworker" />

import {tableItem} from "./table-item";
import {convertDataToBuffer} from "./util/convert-data-to-buffer";
import {ITableItem} from "./interfaces/table-item";


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
let currentArraySize = 10;

// Function to generate random data for an array element
function generateRandomData() {

  const randomId = Math.random().toString(36).substr(2, 9);
  const randomInt = Math.floor(Math.random() * 100);
  const randomFloat = parseFloat((Math.random() * 100).toFixed(18));
  const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  const child = {
    id: Math.random().toString(36).substr(2, 9),
    color: '#' + Math.floor(Math.random()*16777215).toString(16)
  };

  return new tableItem(
    randomId,
    randomInt,
    randomFloat,
    randomColor,
    child
  )
}


function generateDataArray(arraySize: number) {
  const dataArray = [];

  for (let i = 0; i < arraySize; i++) {
    dataArray.push(generateRandomData());

  }

  return dataArray;
}

function generateDataArrayBuffer(data: ITableItem[]) {

  return convertDataToBuffer(data);

}

// Start pseudo-socket with given interval and array size
function start(interval: number | undefined, arraySize: number) {
  if (currentInterval) {
    clearInterval(currentInterval);
  }

  currentInterval = setInterval(() => {
    const data = generateDataArray(arraySize);
    const last10 = data.slice(-10);

    const buffer = generateDataArrayBuffer(last10);
    postMessage(buffer,[buffer]);
  }, interval);
}

function stop() {
  if (currentInterval) {
    clearInterval(currentInterval);
  }
}
