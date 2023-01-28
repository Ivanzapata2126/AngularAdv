import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit{
  public perfilForm:FormGroup;
  public usuario:Usuario;
  public imagenSubir:File;
  public imgTemp:any;

  constructor(private fb:FormBuilder,private usuarioService:UsuarioService, private fileUpdloadService:FileUploadService){
    this.usuario = this.usuarioService.user;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre:[this.usuario.nombre,Validators.required],
      email:[this.usuario.email,[Validators.required,Validators.email]]
    });
  }

  actualizarPerfil(){
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(() => {
      const {nombre,email} = this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;
      Swal.fire('Guardado','Los cambios fueron guardados','success');
    }, (error) => {
      Swal.fire('Error',error.error.msg,'error');
    });
  }

  cambiarImagen(file:File){
    this.imagenSubir = file;
    if(!file){
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){
    this.fileUpdloadService.actualizarFoto(this.imagenSubir,'usuarios',this.usuario.uid).then(data => {
      if(data.ok){
        this.usuario.img=data.nombreArchivo;
        Swal.fire('Todo salió bien','Imagen actualizada correctamente','success');
      }else{
        Swal.fire('Error',data.msg,'error');
      }
    }).catch(error => {
      Swal.fire('Error',error.error.msg,'error');
      console.log(error);
    });
  }
}
