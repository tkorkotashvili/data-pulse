import { TestBed } from '@angular/core/testing';
import { PseudoSocketService, SocketMessage } from './pseudo-socket.service';

describe('PseudoSocketService', () => {
  let service: PseudoSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PseudoSocketService],
    });
    service = TestBed.inject(PseudoSocketService);
  });

  afterEach(() => {
    // Clean up worker after each test.
    if (service.worker) {
      service.worker.terminate();
      service.worker = undefined;
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize a worker when calling init', () => {
    service.init();
    expect(service.worker).toBeDefined();
  });

  it('should terminate a worker when calling terminate', () => {
    service.init();
    service.terminate();
    expect(service.worker).toBeUndefined();
  });

  it('should post "stop" to the worker when calling stop', () => {
    service.init();
    spyOn(service.worker as Worker, 'postMessage');
    service.stop();
    expect((service.worker as Worker).postMessage).toHaveBeenCalledWith('stop');
  });

  it('should post a message to the worker when calling postMessage', () => {
    const testMessage: SocketMessage = {
      interval: 100,
      arraySize: 1000,
    };
    service.init();
    spyOn(service.worker as Worker, 'postMessage');
    service.postMessage(testMessage);
    expect((service.worker as Worker).postMessage).toHaveBeenCalledWith(
      testMessage,
    );
  });

  it('should set an event listener on worker', () => {
    service.init();
    const callback = jasmine.createSpy('callback');
    service.addEventListener(callback);
    const testData = new ArrayBuffer(8);
    (service.worker as Worker).onmessage({ data: testData } as MessageEvent);
    expect(callback).toHaveBeenCalledWith(testData);
  });
});
