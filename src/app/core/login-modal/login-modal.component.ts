import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
      username: new FormControl('', Validators.email),
      password: new FormControl('', Validators.required)
    });
  }

  async validateAndTry(){
    if(this.loginForm.valid){
      this.modCtrl.dismiss(this.loginForm.value);
    } else {
      const alert = await this.alertController.create({
        message: "Llene los campos correctamente para continuar.",
        buttons: ['Ok']
      });
      await alert.present();
    }
  }

  updateValue(input: IonInput){
    this.loginForm.controls[input.name].setValue(input.value);
  }
}
