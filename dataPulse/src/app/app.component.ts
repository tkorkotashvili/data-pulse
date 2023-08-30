import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { debounceTime, fromEvent, ReplaySubject } from 'rxjs';
import { ITableItem } from './interfaces/table-item';
import { reconstructDataFromBuffer } from './util/reconstruct-data-from-buffer';
import { PseudoSocketService } from './pseudo-socket.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy {
  additionalIds: string[] | undefined;

  data$ = new ReplaySubject<ITableItem[]>(1);

  form: FormGroup = new FormGroup({
    frequency: new FormControl(0, [Validators.required, Validators.min(10)]),
    dataSize: new FormControl(0, [
      Validators.required,
      Validators.min(1),
      Validators.max(1000000),
    ]),
    additionalIds: new FormControl(null, [additionalIdsValidator()]),
  });

  constructor(private pseudoSocketService: PseudoSocketService) {
    let currentFrequency: number;
    let currentDataSize: number;

    this.pseudoSocketService.init();

    this.pseudoSocketService.addEventListener((data: ArrayBuffer) => {
      const reconstructedData = reconstructDataFromBuffer(data);

      if (this.additionalIds && this.additionalIds?.length > 0) {
        for (let i = 0; i < this.additionalIds?.length && i < 10; i++) {
          if (reconstructedData[i]) {
            reconstructedData[i].id = this.additionalIds[i];
          }
        }
      }

      this.data$.next(reconstructedData);
    });

    this.form.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      if (value.additionalIds) {
        this.additionalIds = value.additionalIds.split(',');
      } else {
        this.additionalIds = undefined;
      }

      if (
        currentFrequency !== value.frequency ||
        currentDataSize !== value.dataSize
      ) {
        this.stopPseudoSocket();

        this.startPseudoSocket(value.frequency, value.dataSize);

        currentFrequency = value.frequency;
        currentDataSize = value.dataSize;
      }
    });
  }

  startPseudoSocket(interval: number, arraySize: number) {
    if (typeof Worker !== 'undefined') {
      this.pseudoSocketService.postMessage({
        interval: interval,
        arraySize: arraySize,
      });
    }
  }

  stopPseudoSocket() {
    if (typeof Worker !== 'undefined') {
      this.pseudoSocketService.postMessage('stop');
    }
    this.pseudoSocketService.stop();
  }

  ngOnDestroy() {
    this.pseudoSocketService.terminate();
  }
}

function additionalIdsValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value as string;
    if (value && value.split(',').some((id) => !Number.isInteger(Number(id)))) {
      return { invalidIds: true };
    }
    return null;
  };
}
