import { Component, OnInit } from '@angular/core';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';

import {UserService} from '../../services/user.service';

import {AlertService} from '../../services/alert.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;


  constructor(
    private socialAuthService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  get f() { return this.registerForm.controls; }


  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    console.log(socialPlatform);
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + ' sign in data : ' , userData);
        // Now sign-in with userData
        // ...

      }
    );
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    
    // returns a 401 (Unauthorized) error if the user already exists
    this.userService.registerUser(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log("registerUser SUCCESS");
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
        },
        error => {
          console.log("registerUser ERROR =");
          console.log(error);
          this.alertService.error(error);
          this.loading = false;
        });
  }
  /*
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : {notSame: true};
  }

*/

}
