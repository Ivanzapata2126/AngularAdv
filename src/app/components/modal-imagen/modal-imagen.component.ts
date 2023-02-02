import { Component } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent {
  public ocultarModal = false;
  public imagenSubir:File;
  public imgTemp:any;
  constructor(public modalImagenService:ModalImagenService,private fileUpdloadService:FileUploadService){}

  cerrarModal(){
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;
    this.fileUpdloadService.actualizarFoto(this.imagenSubir,tipo,id).then(data => {
      if(data.ok){
        console.log(data);
        Swal.fire('Todo salió bien','Imagen actualizada correctamente','success');
        this.modalImagenService.nuevaImagen.emit(data.nombreArchivo);
        this.cerrarModal();
      }else{
        Swal.fire('Error',data.msg,'error');
      }
    }).catch(error => {
      Swal.fire('Error',error.error.msg,'error');
      console.log(error);
    });
  }
}
