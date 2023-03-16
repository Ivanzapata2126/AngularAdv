import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, Subscription } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit,OnDestroy {
  public medicoForm:FormGroup;
  public hospitales:Hospital[] = [];
  public hospitalSeleccionado:Hospital;
  public medicoSeleccionado:Medico;
  public idHospital:string;
  private imgSubs:Subscription;
  constructor(private fb:FormBuilder, private hospitalService:HospitalService, private medicoService:MedicoService, private router:Router,
    private activatedRoute:ActivatedRoute, private modalImagenService:ModalImagenService){}
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id}) => this.getMedicoById(id));
    this.medicoForm = this.fb.group({
      nombre:['',Validators.required],
      hospital:['',Validators.required]
    })
    this.cargarHospitales();
    this.medicoForm.get('hospital').valueChanges.subscribe(hospitalId => 
      this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId)
      )
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe(
      delay(600)
    )
    .subscribe(() => window.location.reload());
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales().subscribe((hospitales:Hospital[]) => {
      this.hospitales = hospitales;
    })
  }

  guardarMedico(){
    if(this.medicoSeleccionado){
      const data  = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data).subscribe(() => Swal.fire('Actualizado',`${data.nombre}`,'success'))
    }else {
      const {nombre} = this.medicoForm.value;
      this.medicoService.crearMedico(this.medicoForm.value).subscribe((resp:any) => {
        Swal.fire('Creado',`${nombre}`,'success');
        this.router.navigateByUrl(`/dashboard/medico/${resp.medicoDb._id}`)
      });
    }
  }
  abrirModal(medico:Medico){
    this.modalImagenService.mostrarModal('medicos',medico._id,medico.img);
    this.medicoSeleccionado.img = medico.img;
  }

  getMedicoById(id:string){
    if(id === 'nuevo'){
      return;
    }
    this.medicoService.getMedicoById(id).pipe(
      delay(100)
    ).subscribe(medico => {
      if(!medico){
        return this.router.navigateByUrl(`/dashboard/medicos`)
      }
      const {nombre,hospital:{_id} } = medico;
      this.medicoSeleccionado = medico;
      this.hospitalSeleccionado = medico.hospital;
      this.medicoForm.setValue({nombre,hospital:_id});
    });
  }

}
