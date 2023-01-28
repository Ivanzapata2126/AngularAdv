import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { loginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import {catchError, map, tap} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

declare const google:any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  base_url = environment.base_url;
  public user: Usuario;
  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {}

  get token():string{
    return localStorage.getItem('token') || '';
  }

  get uid():string{
    return this.user.uid || '';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
    google.accounts.id.revoke('ivanzapata2126@gmail.com', () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http
      .get(`${this.base_url}/login/renew`, {
        headers: {
          'x-token': token,
        },
      })
      .pipe(
        tap((resp: any) => {
          const {nombre,email,google,role,img,uid} = resp.user;
          this.user = new Usuario(nombre,email,'',img,google,role,uid);
          localStorage.setItem('token', resp.token);
        }),
        map((resp) => true),
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${this.base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }

  actualizarPerfil(data:{email:string,nombre:string,role:string}){
     data = {
      ...data,
      role:this.user.role
    };
    return this.http.put(`${this.base_url}/usuarios/${this.uid}`,data, {
      headers: {
        'x-token': this.token,
      },
    });
  }

  login(formData: loginForm) {
    return this.http.post(`${this.base_url}/login`, formData).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }
  loginGoogle(token: string) {
    return this.http.post(`${this.base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      })
    );
  }


}
