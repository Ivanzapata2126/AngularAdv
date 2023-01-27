import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['.././login/login.component.css']
})
export class RegisterComponent {
  public formSubmitted= false;
  public registerForm = this.fb.group({
    nombre:['',[Validators.required,Validators.minLength(3)]],
    email:['',[Validators.required,Validators.email]],
    password:['',Validators.required],
    password2:['',Validators.required],
    terminos:[false,Validators.required]
  },{
    validators: this.passwordsIguales('password','password2')
  })

  constructor(private fb:FormBuilder, private usuarioService:UsuarioService, private router:Router) { }

  crearUsuario(){
    this.formSubmitted = true;
    console.log(this.registerForm.value);
    if(this.registerForm.invalid){
      return;
    }

    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(async data => {
      console.log(data);
      await Swal.fire('Success','Usuario registrado correctamente','success');
      this.router.navigateByUrl('/');
    },(error) =>
      Swal.fire('Error',error.error.msg,'error')
    )};

  validarCampo(campo:string):boolean{
    if(this.registerForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  validarClaves():boolean{
    const password1 = this.registerForm.get('password')?.value;
    const password2 = this.registerForm.get('password2')?.value;

    if((password1 !== password2) && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  passwordsIguales(passName1:string,passName2:string){
    return (formGroup:FormGroup) => {
      const password1Control = formGroup.get(passName1);
      const password2Control = formGroup.get(passName2);

      if(password1Control?.value === password2Control?.value){
        password2Control?.setErrors(null);
      }else{
        password2Control?.setErrors({noEsIgual:true});
      }
    }
  }
}
