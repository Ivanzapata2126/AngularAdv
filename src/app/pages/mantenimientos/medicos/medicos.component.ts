import { Component, OnDestroy, OnInit} from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit,OnDestroy {
  public medicos:Medico[] = []
  private imgSubs:Subscription;
  public cargando:boolean = true;
  constructor(private medicoService:MedicoService,private modalImagenService:ModalImagenService,private busquedasService:BusquedasService){}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(
      delay(600)
    )
    .subscribe(() => this.cargarMedicos());
  }

  // async abrirModalSweetAlert(){
  //   const {value} = await Swal.fire({
  //     title:'Crear hospital',
  //     text:'Ingrese el nombre del hospital',
  //     showCancelButton:true,
  //     input: 'text',
  //   })
  //   if(value.trim().length > 0){
  //     this.medicoService.(value).subscribe((hospital:Hospital) => this.hospitales.push(hospital));
  //   }else {
  //     Swal.fire('','El nombre es obligatorio','error');
  //   }
  // }
  

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe(medicos => {
      this.cargando = false;
      this.medicos = medicos;
    });
  }

  borrarMedico(medico:Medico){
    return Swal.fire({
      title: `¿Borrar médico?`,
      text: `Estás a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, borrarlo!'
    }).then((result) => {
      if (result.value) {
        this.medicoService.borrarMedico(medico._id).subscribe(()=>{
          this.cargarMedicos();
          Swal.fire(
            'Médico borrado!',
            `${medico.nombre} fue eliminado correctamente`,
            'success'
          );
        })
      }
    })

  }

  abrirModal(medico:Medico){
    this.modalImagenService.mostrarModal('medicos',medico._id,medico.img);
  }

  buscar(termino:string){
    if(termino != ''){
      return this.busquedasService.buscar('medicos',termino).subscribe((resp:Medico[]) => this.medicos = resp);
    }
    return this.cargarMedicos();
  }

}
