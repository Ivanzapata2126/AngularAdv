import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.getUsuarios().then(usuarios=>console.log(usuarios));
    // Ejemplo basico de una promesa.
    // const promesa = new Promise((resolve,reject)=> {
    //   if(false){
    //     resolve('Todo good');
    //   }else{
    //     reject('Algo anda mal...');
    //   }
    // });
    // promesa.then((message)=> {
    //   console.log('Todo nice',message);
    // }).catch((error)=> {
    //   console.log(error);
    // })
  }

  getUsuarios(){
    return new Promise(resolve => {
      fetch('https://reqres.in/api/users')
      .then(resp=>resp.json())
      .then(body=>resolve(body.data));
    });
  }
}
