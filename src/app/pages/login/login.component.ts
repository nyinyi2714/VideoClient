import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../Types/login-request';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public form!: UntypedFormGroup;
  public errorMessage = "";

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.form = new UntypedFormGroup({ 
      email: new FormControl('', [Validators.required, Validators.email]), 
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit(event: any) {
    event.preventDefault();
    if(this.form.status === "INVALID") {
      console.log('a')
      this.errorMessage = "Please enter valid inputs in the above fields."
      return;
    }

    let loginRequest : LoginRequest = <LoginRequest> { 
      email: this.form.controls["email"].value,
      password: this.form.controls["password"].value
    };

    this.authService.login(loginRequest).subscribe(
      {
        next: result => {
          this.router.navigate(['/']);

        },
        error: error => {
          console.error(error);
          this.errorMessage = error.error;
        }
      }
    );
  }
}
