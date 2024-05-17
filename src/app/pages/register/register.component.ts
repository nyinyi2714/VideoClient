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
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.minLength(3), this.usernameValidator]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), this.passwordValidator]),
      confirmPassword: new FormControl('', Validators.required),
    }, this.passwordMatchValidator );
  }

  onSubmit(event: any) {
    event.preventDefault();
    if(this.form.status === "INVALID") {
      console.log('a')
      this.errorMessage = "Please enter valid inputs in the above fields."
      return;
    }
    let registerRequest: RegisterRequest = <RegisterRequest>{
      email: this.form.controls["email"].value,
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

  // Custom validator functions
  private usernameValidator(control: AbstractControl): ValidationErrors | null {
    const username: string = control.value;
    const usernameRegex: RegExp = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username) ? null : { invalidUsername: true };
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    return control.value.password === control.value.confirmPassword
    ? null
    : { passwordNoMatch: true };
  }

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password: string = control.value;

    // Regular expressions for checking password criteria
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    // Check if password meets all criteria
    const isLowercaseValid = lowercaseRegex.test(password);
    const isUppercaseValid = uppercaseRegex.test(password);
    const isDigitValid = digitRegex.test(password);
    const isSpecialCharValid = specialCharRegex.test(password);

    // Return validation errors if any criteria is not met
    return !isLowercaseValid ||
      !isUppercaseValid ||
      !isDigitValid ||
      !isSpecialCharValid
      ? { invalidPassword: true }
      : null;
  }
}
