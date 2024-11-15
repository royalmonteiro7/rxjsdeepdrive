import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { interval, map, Observable } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  //converting signal to Observable
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  //converting Observable to signal
  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, { initialValue: 0 });

  //custom observable
  customInterval$ = new Observable((subscriber) => {
    let timeExecuted = 0;
    const interval = setInterval(() => {
      if (timeExecuted > 3) {
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      console.log('Emitting new values...');
      subscriber.next({ message: 'New Value' });
      timeExecuted++;
    }, 2000);
  });

  // using signals
  // interval = signal(0);
  // doubleInterval = computed(() => this.interval() * 2);
  private destroyRef = inject(DestroyRef);

  constructor() {
    //using signals
    // effect(() => {
    //   console.log(`Clicked button ${this.clickCount()} times.`);
    // });
  }

  ngOnInit(): void {
    // using observables
    // const subscription = interval(1000)
    //   .pipe(map((val) => val * 2))
    //   .subscribe({
    //     next: (val) => console.log(val),
    //   });
    // this.destroyRef.onDestroy(() => {
    //   console.log('unsubscribed');
    //   subscription.unsubscribe();
    // });

    //using signals
    // setInterval(() => {
    //   this.interval.update((prevInternalNumber) => prevInternalNumber + 1);
    // }, 1000);

    this.customInterval$.subscribe({
      next: (val) => {
        console.log(val);
      },
      complete: () => console.log('completed'),
    });

    const subscription = this.clickCount$.subscribe({
      next: (val) => console.log(`Clicked button ${val} times`),
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onClick() {
    this.clickCount.update((prevCount) => prevCount + 1);
  }
}
