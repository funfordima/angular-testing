import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe('Async testing', () => {
  it('examples with Jasmine done callback', (done) => {
    let test = false;

    setTimeout(() => {
      console.log('running assertions');
      test = true;

      expect(test).toBeTruthy();
      done();
    }, 160);
  });

  it('async test example - fakeAsync', fakeAsync(() => {
    let test = false;
    setTimeout(() => { }, 4000);

    setTimeout(() => {
      console.log('running assertions');
      test = true;
    }, 160);

    // tick(160);
    flush();

    expect(test).toBeTruthy();
  }));

  it('async test example - plain Promise', fakeAsync(() => {
    let test = false;
    console.log('creating a promise');

    // setTimeout(() => console.log('setTimeout callback is triggered'), 1000);

    // setTimeout(() => console.log('setTimeout callback is triggered - 1'), 0);

    Promise.resolve().then(() => {
      console.log('handle first then promise');

      return Promise.resolve();
    }).then(() => {
      console.log('handle second then promise');

      test = true;
    });

    flushMicrotasks();

    console.log('running test assertions');
    expect(test).toBeTruthy();
  }));

  it('async test example - Promises + setTimeout', fakeAsync(() => {
    let counter = 0;

    console.log('creating a promise');

    setTimeout(() => console.log('setTimeout callback is triggered'), 1000);

    setTimeout(() => console.log('setTimeout callback is triggered - 1'), 0);

    Promise.resolve().then(() => {
      console.log('handle first then promise');

      counter += 10;

      setTimeout(() => counter += 1, 1000);

      return Promise.resolve();
    }).then(() => {
      console.log('handle second then promise');
    });

    expect(counter).toBe(0);
    flushMicrotasks();
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(11);

    console.log('running test assertions');
    // flush();
  }));

  it('async example - Observables', fakeAsync(() => {
    let test = false;
    console.log('creating observable');

    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;

    });

    tick(1000);

    console.log('running test assertions');
    expect(test).toBeTruthy();
  }));
});
