import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, ReplaySubject} from "rxjs";
import {ITableItem} from "./interfaces/table-item";
import {reconstructDataFromBuffer} from "./util/reconstruct-data-from-buffer";
import {PseudoSocketService} from "./pseudo-socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy{

  data = new ReplaySubject<ITableItem[]>(1);
  increment: number = 0;
  frequency: number = 0;
  dataSize: number = 0;


  constructor(private cdr: ChangeDetectorRef, private pseudoSocketService: PseudoSocketService) {

    fromEvent(document, 'click').subscribe(() => {
      this.increment++;
      this.cdr.detectChanges();
    });

    this.pseudoSocketService.init();

    this.pseudoSocketService.addEventListener( (data: ArrayBuffer) => {
      console.log('callback')
      this.data.next(reconstructDataFromBuffer(data));
    });


  }


  calculateRequiredWorkers(dataArraySize: number): number {
    const singleWorkerCapacity = 100000;
    const maxWorkers = 6;

    const workersNeeded = Math.ceil(dataArraySize / singleWorkerCapacity);

    return Math.min(workersNeeded, maxWorkers);
  }


  startPseudoSocket() {
    if (typeof Worker !== 'undefined') {

      this.pseudoSocketService.postMessage({
          interval: this.frequency,
          arraySize: this.dataSize
      });

    }

  }

  stopPseudoSocket() {

    if (typeof Worker !== 'undefined') {
      this.pseudoSocketService.postMessage( 'stop');
    }
    this.pseudoSocketService.terminate();

  }

  ngOnDestroy() {
    this.pseudoSocketService.terminate();
  }

}

