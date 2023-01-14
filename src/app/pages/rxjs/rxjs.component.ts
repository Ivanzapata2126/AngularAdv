import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription} from 'rxjs';
import { map, retry, take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {
  public intervalSubs:Subscription | undefined;
  constructor() {
    // this.retornaObservable().pipe(
    //   retry()
    // )
    // .subscribe(
    //   valor => console.log('subscripcion',valor),
    //   error => console.warn('error',error),
    //   () => console.log('Todo listo')
    // );
    this.intervalSubs = this.retornaIntervalo().subscribe(console.log);
  }
  ngOnDestroy(): void {
    this.intervalSubs?.unsubscribe();
  }
  
  retornaIntervalo():Observable<number>{
    return interval(500).pipe(
      take(10),
      map(value => value + 1),
      filter(value => (value%2 == 0))
    );
  }

  retornaObservable():Observable<number>{
    let i = -1;
    const obs$ = new Observable<number>(observer => {
      const intervalo = setInterval(()=>{
        i++;
        observer.next(i);
        console.log('tick..');
        if(i===3){
          clearInterval(intervalo);
          observer.complete();
        }
        if(i === 2){
          observer.error('Ha ocurrido un error');
          clearInterval(intervalo);
        }
      },1000)
    });
    return obs$;
  }
}
