import { Injectable } from '@angular/core';

export interface IPseudoSocketParams {
  interval: number;
  arraySize: number;
}

export type SocketMessage = IPseudoSocketParams | 'stop';

@Injectable({
  providedIn: 'root',
})
export class PseudoSocketService {
  worker: Worker | undefined;

  constructor() {}

  init() {
    if (!this.worker) {
      this.worker = new Worker(new URL('./app.worker.ts', import.meta.url));
    }
  }

  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = undefined;
    }
  }

  stop() {
    if (this.worker) {
      this.worker.postMessage('stop');
    }
  }

  postMessage(data: SocketMessage): void {
    if (this.worker) {
      this.worker.postMessage(data);
    }
  }

  addEventListener(callback: (data: ArrayBuffer) => void): void {
    if (this.worker) {
      this.worker.onmessage = ({ data }) => {
        callback(data);
      };
    }
  }
}
