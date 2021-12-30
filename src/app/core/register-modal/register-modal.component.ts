import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertController, ModalController, IonInput, IonIcon, PopoverController } from '@ionic/angular';
import { User } from 'src/app/user';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent implements OnInit {
  public registerForm: FormGroup | undefined;

  constructor(private builder: FormBuilder, private modCtrl: ModalController, private alertController: AlertController, private popoverCtrl: PopoverController) { }

  ngOnInit() {
    this.registerForm = this.builder.group({
      username: this.builder.control('', [Validators.required, Validators.minLength(4), Validators.pattern(environment.stringRegex.username)]),
      firstName: this.builder.control('', [Validators.required,Validators.minLength(4), Validators.pattern(environment.stringRegex.fullName)]),
      lastName: this.builder.control('', [Validators.required, Validators.minLength(4), Validators.pattern(environment.stringRegex.fullName)]),
      email: this.builder.control('', [Validators.required, Validators.email]),
      password: this.builder.control('', [Validators.required, Validators.minLength(8), Validators.pattern(environment.stringRegex.noSpace)]),
      passwordRepeat: this.builder.control('', [Validators.required, Validators.minLength(8), Validators.pattern(environment.stringRegex.noSpace)])
    });
  }

  async validateAndTry(password: IonInput, passwordRepeat: IonInput){
    if(password.value.toString() == passwordRepeat.value.toString() && this.registerForm.valid){
      this.modCtrl.dismiss(this.registerForm.value);
    } else {
      const alert = await this.alertController.create({
        message: this.getInvalidMessage(password.value.toString(), passwordRepeat.value.toString()),
        buttons: ['Ok']
      });
      await alert.present();
    }
  }

  getInvalidMessage(p1: string, p2: string): string{
    console.log(p1 +  " != " + p2 + " -> " + (p1!=p2));
    if(!this.registerForm.controls['username'].valid){
      return "Ingrese un nombre de usuario con al menos 4 caracteres.";
    } else if(!this.registerForm.controls['firstName'].valid){
      return "El campo 'Nombre(s)' no puede contener números ni símbolos, y debe contener al menos 4 caracteres.";
    } else if(!this.registerForm.controls['lastName'].valid){
      return "El campo 'Apellido(s)' no puede contener números ni símbolos, y debe contener al menos 4 caracteres.";
    } else if(!this.registerForm.controls['email'].valid){
      return "Ingrese una dirección de correo válida.";
    } else if(!this.registerForm.controls['password'].valid){
      return "La contraseña no puede tener espacios y debe contener al menos 8 caracteres.";
    } else if(!this.registerForm.controls['passwordRepeat'].valid){
      return "La contraseña no puede tener espacios y debe contener al menos 8 caracteres.";
    } else if(p1 != p2){
      return "Las contraseñas no coinciden"
    } else {
      return "Error de validación.";
    }
  }

  async updateValue(input: IonInput, icon: IonIcon){
    this.registerForm.controls[input.name].setValue(input.value);
    if(!this.registerForm.controls[input.name].valid){
      input.color = "danger";
      icon.name = "close"
    } else {
      input.color = "success";
      icon.name = "checkmark"
    }
  }
}
