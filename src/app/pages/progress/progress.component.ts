import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css'],
})
export class ProgressComponent {
  progress1: number = 30;
  progress2: number = 60;

  get getPorcentaje1() {
    return `${this.progress1}%`;
  }
  get getPorcentaje2() {
    return `${this.progress2}%`;
  }
}
