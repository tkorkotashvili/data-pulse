import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { PseudoSocketService } from './pseudo-socket.service';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockPseudoSocketService: jasmine.SpyObj<PseudoSocketService>;

  beforeEach(() => {
    // Create a mock for PseudoSocketService
    mockPseudoSocketService = jasmine.createSpyObj('PseudoSocketService', [
      'init',
      'addEventListener',
      'postMessage',
      'terminate',
      'stop',
    ]);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PseudoSocketService, useValue: mockPseudoSocketService },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize pseudoSocketService on creation', () => {
    expect(mockPseudoSocketService.init).toHaveBeenCalled();
  });

  it('should update additionalIds based on form value changes', fakeAsync(() => {
    component.form.setValue({
      frequency: 50,
      dataSize: 500,
      additionalIds: '5,6,7',
    });

    tick(500);

    expect(component.additionalIds).toEqual(['5', '6', '7']);
  }));

  it('should postMessage to pseudoSocketService on start', () => {
    const testFrequency = 100;
    const testDataSize = 1000;
    component.startPseudoSocket(testFrequency, testDataSize);

    expect(mockPseudoSocketService.postMessage).toHaveBeenCalledWith({
      interval: testFrequency,
      arraySize: testDataSize,
    });
  });

  it('should stop pseudoSocketService on stopPseudoSocket', () => {
    component.stopPseudoSocket();

    expect(mockPseudoSocketService.postMessage).toHaveBeenCalledWith('stop');
    expect(mockPseudoSocketService.stop).toHaveBeenCalled();
  });

  it('should terminate pseudoSocketService on ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(mockPseudoSocketService.terminate).toHaveBeenCalled();
  });
});
