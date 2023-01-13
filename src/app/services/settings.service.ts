import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  linkTheme = document.querySelector('#theme');
  constructor() {
    const url = localStorage.getItem('theme') || './assets/css/colors/purple-dark.css';
    this.linkTheme?.setAttribute('href',url);
  }

  changeTheme(theme:string){
    const url = `./assets/css/colors/${theme}.css`;
    this.linkTheme?.setAttribute('href',url);
    localStorage.setItem('theme',url);
    this.checkCurrentTheme();
  }

  checkCurrentTheme(){
    const links = document.querySelectorAll('.selector');
    links.forEach(element=>{
      element.classList.remove('working');
      const btnThema = element.getAttribute('data-theme');
      const btnFindUrl = `./assets/css/colors/${btnThema}.css`;
      const currentTheme = this.linkTheme?.getAttribute('href');
      if(btnFindUrl == currentTheme){
        element.classList.add('working');
      }
    })
  }
}
