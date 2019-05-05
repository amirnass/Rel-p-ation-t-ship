import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from '../auth/auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AddPatientService } from './add-patient.service';
import { AddPatient } from './add-patient.model';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.page.html',
  styleUrls: ['./add-patient.page.scss']
})
export class AddPatientPage implements OnInit, OnDestroy {
  isLoading = false;
  usersSub: Subscription;
  usersList: AddPatient[];
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private addPatientService: AddPatientService
  ) {}

  ngOnInit() {
    this.usersSub = this.addPatientService.addedPatient.subscribe(users => {
      this.usersList = users;
    });
  }

  ngOnDestroy() {
    if (this.usersSub) {
      this.usersSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.addPatientService.fetchUsers().subscribe(() => {
      this.isLoading = false;
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const uid = form.value.uid + '@test.com';
    const password = form.value.uid;
    const name = form.value.name;
    const type = form.value.type;
    const room = form.value.room ? form.value.room : '0';
    console.log(uid, password, name, type, room);
    this.createUser(uid, password, name, type, room);
    form.reset();
  }

  createUser(
    uid: string,
    password: string,
    name: string,
    type: string,
    room: string
  ) {
    let localId: string;
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Creating User...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        authObs = this.authService.signup(uid, password);
        authObs.subscribe(
          resData => {
            localId = resData.localId;
            this.isLoading = false;
            loadingEl.dismiss();
            const newAddedUser = new AddPatient(uid, name, type, room, localId);
            this.addPatientService.add(newAddedUser).subscribe(() => {
              return;
            });
            this.router.navigateByUrl('/requests/tabs/my-requests');
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not add user, please try again.';
            if (code === 'EMAIL_EXISTS') {
              message = 'This Id exists already!';
            }
            this.showAlert(message);
          }
        );
      });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'User creation failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
