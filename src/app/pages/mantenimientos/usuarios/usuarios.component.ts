import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit,OnDestroy{
  public totalUsuarios:number = 0;
  public usuarios:Usuario[] = [];
  public usuariosTemp:Usuario[] = [];
  public desde = 0;
  public cargando = true;
  public paginasMostradas = 5;
  public imgSubs:any;
  constructor(private usuarioService:UsuarioService,private busquedasService:BusquedasService,private ModalImagenService:ModalImagenService){}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.ModalImagenService.nuevaImagen.pipe(
        delay(600)
      )
      .subscribe(() => this.cargarUsuarios());
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe(({total,usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });
  }
  cambiarPagina(valor:number){
    this.desde += valor;
    if(this.desde < 0){
      this.desde = 0;
    }else if(this.desde >= this.totalUsuarios){
      this.desde -= valor;
    }
    if(valor > 0){
      this.paginasMostradas+=5;
    }else{
      this.paginasMostradas-=5;
    }
  
    this.cargarUsuarios();
  }

  buscar(termino:string){
    if(termino != ''){
      return this.busquedasService.buscar('usuarios',termino).subscribe((resp:Usuario[]) => this.usuarios = resp);
    }
    return this.usuarios = this.usuariosTemp;
  }

  eliminarUsuario(usuario:Usuario){
    if(usuario.uid === this.usuarioService.uid){
      return Swal.fire('Error','No puede borrarse a si mismo','error');
    }
    return Swal.fire({
      title: `¿Borrar usuario?`,
      text: `Estás a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario(usuario).subscribe(()=>{
          this.cargarUsuarios();
          Swal.fire(
            'Usuario borrado!',
            `${usuario.nombre} fue eliminado correctamente`,
            'success'
          );
        })
      }
    })
  }

  cambiarRole(usuario:Usuario){
    this.usuarioService.guardarUsuario(usuario).subscribe(resp => console.log(resp));
  }

  abrirModal(usuario:Usuario){
    this.ModalImagenService.mostrarModal('usuarios',usuario.uid,usuario.img);
  }
}
