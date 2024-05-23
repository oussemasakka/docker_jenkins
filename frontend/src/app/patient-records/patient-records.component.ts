import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { PatientRecordsService } from '../patient-records.service';
import { DoctorService } from '../doctor.service';
import { PatientService } from '../patient.service';



// Define an interface for the structure of PatientRecord
interface PatientRecord {
  doctorId: string;
  diagnosis: string;
  details: string;
}

interface DiagnosisRecord {
  doctorId: string;
  diagnosis: string;
  details: string;
} 

@Component({
  selector: 'app-patient-records',
  templateUrl: './patient-records.component.html',
  styleUrls: ['./patient-records.component.css']
})
export class PatientRecordsComponent implements OnInit {
  patientId: string = '';
  patientRecords: PatientRecord[] = [];
  newRecord: any = { diagnosis: '', details: '' };
  patientName: string = '';
  gender: string = '';
  age: number = 0;


  constructor(
    private route: ActivatedRoute,
    private patientRecordsService: PatientRecordsService,
    private doctorService: DoctorService,
    private patientService: PatientService // Inject PatientService

  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = params['id'];
      this.getPatientInfo(); // Fetch patient info for the specific patient ID

      this.loadPatientRecords();

    });
  }

  loadPatientRecords(): void {
    this.patientRecordsService.getPatientRecords(this.patientId).subscribe(
      (response: any) => {
        // Check if 'cards' property exists in the response
        if (response.cards) {
          // Use 'response.cards' directly for mapping
          this.patientRecords = response.cards.map((record: DiagnosisRecord) => {
            return {
              doctorId: record.doctorId,
              diagnosis: record.diagnosis,
              details: record.details
            };
          });
        } else {
          // Handle case when 'cards' property is not present in the response
          console.error('No records found in the response');
          this.patientRecords = []; // Reset patientRecords array
        }
      },
      (error) => {
        console.error('Error fetching patient records:', error);
        // Handle error as needed
      }
    );
  }
  


  
  

  getPatientInfo(): void {
    this.patientService.getPatientInfos(this.patientId).subscribe(
    //  console.log(this.patientId)
      (response) => {
        // Extract patient's name and age from the response
        this.patientName = response.name,
        this.age = response.age,
        this.gender = response.gender,
        console.log(this.patientName);
      },
      (error) => {
        console.error('Error fetching patient info:', error);
        // Handle error as needed
      }
    );
  }

  // Add other methods as needed


  addRecord(): void {
    this.doctorService.getDoctorInfo().subscribe(
      (doctorInfo) => {
        const doctorId = doctorInfo.doctorId;
        console.log(this.patientName)
  
        // Assuming you have doctorId available and newRecord is properly populated
        const { diagnosis, details } = this.newRecord;
  
        // Call a service method to add a new record
        this.patientRecordsService.addDiagnosisRecord(this.patientId, { doctorId, diagnosis, details }).subscribe(
          () => {
            // Clear the form and reload patient records
            this.newRecord = { doctorId: '', diagnosis: '', details: '' };
            this.loadPatientRecords();
          },
          (error) => {
            console.error('Error adding diagnosis record:', error);
            // Handle error as needed
          }
        );
      },
      (error) => {
        console.error('Error fetching doctor info:', error);
        // Handle error as needed
      }
    );
  }
}  
