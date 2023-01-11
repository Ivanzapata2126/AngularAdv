import { Component,Input, SimpleChanges } from '@angular/core';
import { ChartData, ChartEvent, ChartType} from 'chart.js';
@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent  {
  @Input() legend:string = 'Sales';
  @Input('labels') doughnutChartLabels: string[] = ['Por defecto1','Por defecto2','Por defecto3'];
  @Input('data') datos = [350,450,100];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: this.datos,backgroundColor:['#6857E6','#009FEE','#F02059'] }
    ],
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.doughnutChartData={
      labels: this.doughnutChartLabels,
      datasets:[{ data: this.datos, backgroundColor:['#6857E6','#009FEE','#F02059']}]
    }
  }
  // events
  public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

}
