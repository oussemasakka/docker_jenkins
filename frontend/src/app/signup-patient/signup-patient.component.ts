import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Import AuthService

// Interface definition for API response
interface ApiResponse {
  status: string;
  message: string;
  data?: {
    age: string;
    email: string;
    gender: string;
    name: string;
    role: string;
    cnss: string;
    _id: string;
    token: string;
  };
}

@Component({
  selector: 'app-signup-patient',
  templateUrl: './signup-patient.component.html',
  styleUrls: ['./signup-patient.component.css']
})
export class SignupPatientComponent {
  user = {
    name: '',
    password: '',
    age: '',
    gender: '',
    email: '',
    role: 'Patient', // Set role to 'Patient' for patient signup
    cnss: ''
  };
  roles = ['Patient', 'Doctor'];
  genders = ['male', 'female'];


  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) { }

  signupMessage: string = '';
  signupStatus: string = '';

  submitForm() {
    console.log('User:', this.user);

    this.http.post<ApiResponse>('http://127.0.0.1:3000/user/signup-patient', this.user)
      .subscribe(response => {
        console.log('response:', response);
        this.signupMessage = response.message;
        this.signupStatus = response.status;

        if (response.status === 'SUCCESS' && response.data && response.data.token) {
          // Store the token using AuthService
          this.authService.storeToken(response.data.token).subscribe(() => {
            console.log('Token stored successfully');
          }, error => {
            console.error('Error storing token:', error);
          });

          // Redirect to doctor interface after signup
          this.router.navigate(['/login-patient']);
        }
      }, error => {
        console.error('error:', error);
      });
  }
}  
