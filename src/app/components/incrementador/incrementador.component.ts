import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit  {
  ngOnInit() {
    this.btnClass = `btn ${this.btnClass}`;
  }

  @Input() progress:number = 50;
  @Input() btnClass:string = 'btn btn-primary';
  //Otra forma para darle otro nombre @Input('valor') progress:number = 50;
  @Output() valorSalida:EventEmitter<number> = new EventEmitter();

  get getPorcentaje(){
    return `${this.progress}%`;
  }

  cambiarValor(valor:number){
    if(this.progress >= 100 && valor >= 0){
      this.valorSalida.emit(100);
      return this.progress = 100;
    }
    if(this.progress <= 0 && valor < 0){
      this.valorSalida.emit(0)
      return this.progress = 0;
    }
    this.valorSalida.emit(this.progress+=valor);
    return this.progress+=valor;
  }

  onChange(event:number){
    if(event >= 100){
      this.progress = 100;
    }else if(event <= 0){
      this.progress = 0;
    }else{
      this.progress = event;
    }
    this.valorSalida.emit(this.progress);
  }

}
