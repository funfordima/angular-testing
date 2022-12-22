import { TestBed, inject } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';

describe('CalculatorService', () => {
  let service: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    // pending();
    // fail();
    // service = new CalculatorService(loggerSpy);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy },
      ]
    });

    service = TestBed.inject(CalculatorService);
    // service = TestBed.get(CalculatorService);
  });

  it('should be created', inject([CalculatorService], (service: CalculatorService) => {
    expect(service).toBeTruthy();
  }));

  it('should add two numbers', () => {
    // const logger = jasmine.createSpyObj('LoggerService', ['log']);
    // spyOn(logger, 'log');

    // const service = new CalculatorService(logger);

    const result = service.add(2, 2);

    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    const result = service.subtract(2, 2);

    expect(result).toBe(0);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
