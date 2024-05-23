import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { DoctorService } from '../doctor.service';
import { PatientDoctorAccessService } from '../patient-doctor-access.service';
import { Observable,of } from 'rxjs';
import { Router } from '@angular/router';



interface AccessDocument {
  doctorId: string | string[]; // Assuming doctorId can be a string or an array of strings
  // Add other properties if needed
}
@Component({
  selector: 'app-login-patient',
  templateUrl: './login-patient.component.html',
  styleUrls: ['./login-patient.component.css']
})
export class LoginPatientComponent implements OnInit {
  patient: any = { name: '', age: '' };
  age: string = '';
  name: string = '';
  id: string = '';
  doctors: any[] = [];
  selectedDoctor: any;
  accessGranted: boolean = false;
  accessHolders: any[] = [];
  patientId:string='';


  constructor(
    private router: Router,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private patientDoctorAccessService: PatientDoctorAccessService
  ) {}

  ngOnInit(): void {
    this.getPatientInfo();
    this.getAllDoctors();
    this.getAccessHolders();
  }

  getPatientInfo(): void {
    this.patientService.getPatientInfo().subscribe(
      (response) => {
        this.patient = response;
        this.age = this.patient.age;
        this.name = this.patient.name;
        this.patientId = this.patient.id;
        console.log(this.patientId);


      },
      (error) => {
        console.error('Error fetching patient info:', error);
      }
    );
  }
  viewMedicalRecords(patientId: string): void {
    //this.getPatientInfo();

    console.log(this.patient.id);


    // Navigate to the patient-record-view component with the patient's ID as a parameter
    this.router.navigate(['/patient-record-view', this.patient.id]);

  }

  getAllDoctors(): void {
    this.doctorService.getAllDoctors().subscribe(
      (response) => {
        this.doctors = response;
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );
  }

  grantAccess() {
    const doctorId = this.selectedDoctor._id;
    if (doctorId) {
      const requestBody = { doctorId: doctorId };
      this.patientService.grantAccess(requestBody).subscribe(
        (response) => {
          console.log('Access granted:', response);
          // Update access holders immediately after access is granted
          this.patientDoctorAccessService.getDoctorDetails(doctorId).subscribe(
            (doctorDetails) => {
              this.accessHolders.push({
                name: doctorDetails.name,
                specialization: doctorDetails.specialization,
                doctorId:doctorId

              });
            },
            (error) => {
              console.error('Error fetching doctor details:', error);
            }
          );
          this.accessGranted = true;
          setTimeout(() => {
            this.accessGranted = false;
          }, 3000);
        },
        (error) => {
          console.error('Error granting access:', error);
        }
      );
    } else {
      console.error('No doctor selected');
    }
  }
  
  
  getAccessHolders(): Observable<any[]> {
    this.patientService.getPatientInfo().subscribe(
      (response) => {
        const currentPatientId = response.id;
        if (currentPatientId) {
          this.patientDoctorAccessService.getPatientDoctorAccess(currentPatientId).subscribe(
            (accessDocuments) => {
              console.log(typeof accessDocuments)
              if (Array.isArray(accessDocuments)) {
                accessDocuments.forEach((accessDocument) => {
                  const doctorIds = Array.isArray(accessDocument) ? accessDocument : [accessDocument];
                  doctorIds.forEach((doctorId: string) => {
                    this.patientDoctorAccessService.getDoctorDetails(doctorId).subscribe(
                      (doctorDetails) => {
                        this.accessHolders.push({
                          name: doctorDetails.name,
                          specialization: doctorDetails.specialization,
                          doctorId:doctorId
                        });
                      },
                      (error) => {
                        console.error('Error fetching doctor details:', error);
                      }
                    );
                  });
                });
              } else {
                console.error('Access documents is not an array');
              }
            },
            (error) => {
              console.error('Error fetching access holders:', error);
            }
          );
        } else {
          console.error('Current patient ID not available');
        }
      },
      (error) => {
        console.error('Error fetching patient info:', error);
      }
    );
    return of(this.accessHolders);

  }

  revokeAccess(doctorId: string) {
console.log(this.accessHolders)
    this.patientDoctorAccessService.revokeAccess(doctorId).subscribe(
      (response) => {
        console.log('Access revoked:', response);
        // Refresh access holders after revoking access
        this.accessHolders = this.accessHolders.filter(access => access.doctorId !== doctorId);

       // this.getAccessHolders();
      },
      (error) => {
        console.error('Error revoking access:', error);
      }
    );
  }

}  