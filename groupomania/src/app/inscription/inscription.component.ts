import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {catchError, EMPTY, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {

  signupForm!: FormGroup;
  loading!: boolean;
  errorMsg!: string;

  constructor(private formBuilder: FormBuilder,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      pseudo: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }

  onSignup() {
    this.loading = true;
    const email = this.signupForm.get('email')!.value;
    const password = this.signupForm.get('password')!.value;
    const confirmPassword = this.signupForm.get('confirmPassword')!.value;
    const pseudo = this.signupForm.get('pseudo')!.value;
    if (password == confirmPassword) {
      this.auth.createUser(email, password, pseudo).pipe(
        switchMap(() => this.auth.loginUser(email, password)),
        tap(() => {
          this.loading = false;
          this.router.navigate(['/list']);
        }),
        catchError(error => {
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    } else {
      this.loading = false;
      this.errorMsg = 'Les mots de passe ne sont pas identiques';
    }
    
  }

}
