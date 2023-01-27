import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { loginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import {catchError, map, tap} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

declare const google:any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  base_url = environment.base_url;
  constructor(private http:HttpClient,private router:Router,private ngZone:NgZone ) { }

  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login')
    google.accounts.id.revoke('ivanzapata2126@gmail.com', () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login')
      })
    })
  }

  validarToken():Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${this.base_url}/login/renew`,{
      headers: {
        "x-token":token
      }
    }).pipe(
      tap((resp:any) => localStorage.setItem('token',resp.token)),
      map(resp => true),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData:RegisterForm){
    return this.http.post(`${this.base_url}/usuarios`,formData).pipe(
      tap( (resp:any) => {
        localStorage.setItem('token',resp.token);
      })
    )
  }

  login(formData:loginForm){
    return this.http.post(`${this.base_url}/login`,formData).pipe(
      tap( (resp:any) => {
        localStorage.setItem('token',resp.token);
      })
    )
  }
  loginGoogle(token:string){
    return this.http.post(`${this.base_url}/login/google`,{token}).pipe(
      tap((resp:any) => {
        localStorage.setItem('token',resp.token);
      })
    )
  }
}
