import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatientServiceService } from './patient-service.service';
import { HttpClientModule } from '@angular/common/http';

describe('PatientServiceService', () => {
  let service: PatientServiceService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({

      imports: [HttpClientModule,HttpClientTestingModule],
    });
    service = TestBed.inject(PatientServiceService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll should make a GET HTTP request and return all data items', () => {
    service.getPatientList().subscribe(res => {
      expect(res).toEqual(mockPatients); 
      expect(res.length).toBe(1); 
     }); 
    const req = httpTestingController.expectOne('https://localhost:7105/api/patient');
    expect(req.request.method).toBe('GET');
    expect(req.cancelled).toBeFalsy(); 
    expect(req.request.responseType).toEqual('json');
    req.flush(mockPatients);
    httpTestingController.verify();
   });

   it('delete should make a DELETE HTTP request with id appended to end of url', () => {
    service.deletePatient(1).subscribe(res => {
      expect(res).toBe(1); 
     }); 
    const req = httpTestingController.expectOne('https://localhost:7105/Delete/1', 'delete to api');
    expect(req.request.method).toBe('DELETE');
    expect(req.cancelled).toBeFalsy(); 
    expect(req.request.responseType).toEqual('json');
    req.flush(1);
    httpTestingController.verify();
   });
   it('update should make a PUT HTTP request with id appended to end of url and resource as body', () => {
    const updateObj = { id: 1,
      first_Name: 'Ram',
      last_Name: 'Sankoju',
      birth_Date: new Date('12/12/2023'),
      gender: 'M',
      create_Date: new Date('12/12/2023'), };
    service.updatePatient(updateObj).subscribe(res => {
      expect(res).toBe(updateObj); 
     }); 
    const req = httpTestingController.expectOne('https://localhost:7105/Update', '');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(updateObj);
    expect(req.cancelled).toBeFalsy(); 
    expect(req.request.responseType).toEqual('json');
    req.flush(updateObj);
    httpTestingController.verify();
   });
   it('create should make a POST HTTP request with resource as body', () => {
    const createObj = { id: 1,
      first_Name: 'Ram',
      last_Name: 'Sankoju',
      birth_Date: new Date('12/12/2023'),
      gender: 'M',
      create_Date: new Date('12/12/2023'), };
    service.addPatient(createObj).subscribe(res => {
      expect(res).toBe(createObj); 
     }); 
    const req = httpTestingController.expectOne('https://localhost:7105/Create', '');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(createObj);
    expect(req.cancelled).toBeFalsy(); 
    expect(req.request.responseType).toEqual('json');
    req.flush(createObj);
    httpTestingController.verify();
    });
});


export const mockPatients = [
  {
    id: 1,
    first_Name: 'Ram',
    last_Name: 'Sankoju',
    birth_Date: new Date('12/12/2023'),
    gender: 'M',
    create_Date: new Date('12/12/2023'),
  }
];