import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../../Types/register-request';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  public form!: UntypedFormGroup;
  public errorMessage = "";

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.form = new UntypedFormGroup({ 
      username: new FormControl('', [Validators.required, Validators.minLength(3)]), 
      password: new FormControl('', [Validators.required, Validators.minLength(3)]),
      confirmPassword: new FormControl('', Validators.required),
    });
  }

  // TODO: implement validators and only send valid credentials
  onSubmit() {
    // Check if form is invalid before submitting
    if (this.form.invalid) { 
      console.log('invalid form')
      return;
    }

    let registerRequest : RegisterRequest = <RegisterRequest> { 
      username: this.form.controls["username"].value,
      password: this.form.controls["password"].value,
    };

    this.authService.register(registerRequest).subscribe(
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

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
