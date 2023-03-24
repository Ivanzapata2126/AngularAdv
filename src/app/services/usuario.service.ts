import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { loginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import {catchError, map, tap} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { cargarUsuarios } from '../interfaces/cargar-usuarios';

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

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  get role():'ADMIN_ROLE' | 'USER_ROLE' {
    return this.user.role;

  }

  guardarLocalStorage(token:string,menu:any){
    localStorage.setItem('menu',JSON.stringify(menu));
    localStorage.setItem('token',token);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
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
      .get(`${this.base_url}/login/renew`,this.headers)
      .pipe(
        tap((resp: any) => {
          const {nombre,email,google,role,img,uid} = resp.user;
          this.user = new Usuario(nombre,email,'',img,google,role,uid);
          this.guardarLocalStorage(resp.token,resp.menu);
        }),
        map((resp) => true),
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${this.base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token,resp.menu);
      })
    );
  }

  actualizarPerfil(data:{email:string,nombre:string,role:string}){
    data = {
      ...data,
      role: this.user.role
    }
    return this.http.put(`${this.base_url}/usuarios/${this.uid}`,data,this.headers);
  }

  login(formData: loginForm) {
    return this.http.post(`${this.base_url}/login`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token,resp.menu);
      })
    );
  }

  loginGoogle(token: string) {
    return this.http.post(`${this.base_url}/login/google`, { token }).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token,resp.menu);
      })
    );
  }

  cargarUsuarios(desde:number = 0){
    return this.http.get<cargarUsuarios>(`${this.base_url}/usuarios?desde=${desde}`,this.headers)
    .pipe(
      map(resp => {
        const usuarios = resp.usuarios.map(user => new Usuario(user.nombre,user.email,'',user.img,user.google,user.role,user.uid));
        return {
          total: resp.total,
          usuarios
        }
      })
    )
  }

  eliminarUsuario(usuario:Usuario){
    return this.http.delete(`${this.base_url}/usuarios/${usuario.uid}`,this.headers);
  }

  guardarUsuario(usuario:Usuario){
    return this.http.put(`${this.base_url}/usuarios/${usuario.uid}`,usuario,this.headers);
  }
}
