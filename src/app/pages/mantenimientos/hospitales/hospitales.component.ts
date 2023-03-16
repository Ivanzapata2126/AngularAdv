import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { HospitalService } from 'src/app/services/hospital.service';
import Swal from 'sweetalert2';
import { delay, Subscription } from 'rxjs';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit,OnDestroy {
  public hospitales:Hospital[] = [];
  public cargando:boolean = true;
  private imgSubs:Subscription;
  constructor(private hospitalService:HospitalService, private modalImagenService:ModalImagenService, private busquedasService:BusquedasService){
  }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(
      delay(600)
    )
    .subscribe(() => this.cargarHospitales());
  }
  
  cargarHospitales(){
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe(hospitales => {
      this.hospitales = hospitales;
      this.cargando = false;
    });
  }

  actualizarHospital(hospital:Hospital){
    this.hospitalService.actualizarHospital(hospital._id,hospital.nombre).subscribe(() => 
    Swal.fire('Actualizado',hospital.nombre,'success'));
  }

  eliminarHospital(_id:string){
    this.hospitalService.eliminarHospital(_id).subscribe(() => {
      this.cargarHospitales();
      Swal.fire('Eliminado','Hospital eliminado correctamente','success');
    })
  }

  async abrirModalSweetAlert(){
    const {value} = await Swal.fire({
      title:'Crear hospital',
      text:'Ingrese el nombre del hospital',
      showCancelButton:true,
      input: 'text',
    })
    if(value.trim().length > 0){
      this.hospitalService.crearHospital(value).subscribe((hospital:Hospital) => this.hospitales.push(hospital));
    }else {
      Swal.fire('','El nombre es obligatorio','error');
    }
  }

  buscar(termino:string){
    if(termino != ''){
      return this.busquedasService.buscar('hospitales',termino).subscribe((resp:Hospital[]) => this.hospitales = resp);
    }
    return this.cargarHospitales();
  }

  abrirModal(hospital:Hospital){
    this.modalImagenService.mostrarModal('hospitales',hospital._id,hospital.img);
  }

}
