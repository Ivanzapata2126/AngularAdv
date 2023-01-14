import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {
  titulo:string = '';
  tituloSubs$:Subscription = new Subscription;
  constructor(private router:Router) {
    this.tituloSubs$ = this.getArgumentosRuta().subscribe((data) => {
      this.titulo = data;
      document.title = `adminPro - ${data}`;
    });
  }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getArgumentosRuta(){
    return this.router.events
    .pipe(
      filter((event:any) => event instanceof ActivationEnd),
      filter(event => event.snapshot.firstChild === null),
      map(event => event.snapshot.data.titulo)
    )
  }
}
