import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Import AuthService

// Interface definition for API response
interface ApiResponse {
  status: string;
  message: string;
  data?: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };
  loginMessage: string = '';
  loginStatus: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) { }

  submitForm() {
    console.log('User:', this.user);

    this.http.post<ApiResponse>('http://127.0.0.1:3000/user/login', this.user)
      .subscribe(response => {
        console.log('response:', response);
        this.loginMessage = response.message;
        this.loginStatus = response.status;

        if (response.status === 'SUCCESS' && response.data && response.data.token) {
          // Store the token using AuthService
          this.authService.storeToken(response.data.token).subscribe(() => {
            console.log('Token stored successfully');
          }, error => {
            console.error('Error storing token:', error);
          });

          // Redirect based on user role
          const role = response.data.user.role;
          console.log(role);
          switch (role) {
            case 'Patient':
              this.router.navigate(['/login-patient']); // Redirect to patient home page
              break;
            case 'Doctor':
              this.router.navigate(['/doctor-interface']); // Redirect to doctor home page
              break;
            case 'admin':
              this.router.navigate(['/dashboard']); // Redirect to doctor home page
              break;
            default:
              // Handle other roles or redirect to a default page
              break;
          }
        }
      }, error => {
        console.error('error:', error);
        this.loginMessage = error.error.message;
      });
  }
}
