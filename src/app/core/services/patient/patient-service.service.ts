import { Injectable } from '@angular/core';
import{HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
import { Patient } from '../../models/patient.model';
@Injectable({
  providedIn: 'root'
})
export class PatientServiceService {
  private options = { headers: new HttpHeaders().set('Content-Type', 'application/json'), withCredentials: false };
  constructor(private httpClient:HttpClient) { }

  getPatientList(){
    return this.httpClient.get<Patient[]>('https://localhost:7105/api/patient');
  }

  addPatient(patient:any){
    return this.httpClient.post('https://localhost:7105/Create',patient,this.options);
  }
  updatePatient(patient:any){
    return this.httpClient.put('https://localhost:7105/Update',patient);
  }
  deletePatient(id:number){   
    return this.httpClient.delete(`https://localhost:7105/Delete/${id}`);
  }
}
