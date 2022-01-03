import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { IonInput, ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
})
export class LoginModalComponent implements OnInit{
  public loginForm: FormGroup | undefined;

  constructor(private builder: FormBuilder, private modCtrl: ModalController, public alertController: AlertController) { }

  ngOnInit() {
    this.loginForm = this.builder.group({
      username: this.builder.control('', [Validators.required, Validators.email]),
      password: this.builder.control('', [Validators.required])
    });
  }

  async validateAndTry(){
    if(this.loginForm.valid){
      this.modCtrl.dismiss(this.loginForm.value);
    } else {
      const alert = await this.alertController.create({
        message: this.getInvalidMessage(),
        buttons: ['Ok']
      });
      await alert.present();
    }
  }

  getInvalidMessage(): string{
    if(!this.loginForm.controls['username'].valid){
      return "Ingrese un correo electrónico válido.";
    } else {
      return "Ingrese una contraseña.";
    }
  }

  updateValue(input: IonInput){
    this.loginForm.controls[input.name].setValue(input.value);
  }
}
