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
    specialization: string;
    _id: string;
    token: string;
  };
}

@Component({
  selector: 'app-signup-doctor',
  templateUrl: './signup-doctor.component.html',
  styleUrls: ['./signup-doctor.component.css']
})
export class SignupDoctorComponent {

  user = {
    name: '',
    password: '',
    age: '',
    gender: '',
    email: '',
    role: 'Doctor', // Set role to 'Doctor' for doctor signup
    specialization: ''
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

    this.http.post<ApiResponse>('http://127.0.0.1:3000/user/signup-doctor', this.user)
      .subscribe(response => {
        console.log('response:', response);
        this.signupMessage = response.message;
        this.signupStatus = response.status;
        //console.log(response.data.token)

        if (response.status === 'SUCCESS' && response.data && response.data.token) {
          // Store the token using AuthService
          this.authService.storeToken(response.data.token).subscribe(() => {
            console.log('Token stored successfully');
          }, error => {
            console.error('Error storing token:', error);
          });

          // Redirect to doctor interface after signup
          this.router.navigate(['/doctor-interface']);
        }
      }, error => {
        console.error('error:', error);
      });
  }
}  
