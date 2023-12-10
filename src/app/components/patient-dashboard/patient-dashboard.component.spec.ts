import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { PatientDashboardComponent } from './patient-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { PatientServiceService } from 'src/app/core/services/patient/patient-service.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Patient } from 'src/app/core/models/patient.model';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs/internal/Observable';
import { By } from '@angular/platform-browser';
import { every, from, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
describe('PatientDashboardComponent', () => {
  let component: PatientDashboardComponent;
  let fixture: ComponentFixture<PatientDashboardComponent>;
  let service: PatientServiceService;
  let pagenator: MatPaginator;
  const dt = new Date();
  let testPatients: Patient[] = [
    {
      id: 1,
      first_Name: 'Rambabu',
      last_Name: 'Sankoju',
      birth_Date: new Date('12/12/2023'),
      create_Date: new Date('12/12/2023'),
      gender: 'M',
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatTableModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatIconModule,
      ],
      declarations: [PatientDashboardComponent],
      providers: [PatientServiceService, MatDatepicker],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call reset from ', (done) => {
    component.resetForm();
    fixture.detectChanges();
    done();
  });
  it('should save patient details when form is submitted', () => {
    const spy = spyOn(component, 'addPatient').and.callThrough();
    component.FrmgPatient.setValue(mockPatients[0]);
    component.FrmgPatient.controls['id'].setValue('');
    component.addPatient();

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalled();
  });
  it('should add patient details when form is submitted', () => {
    const spy = spyOn(component, 'addPatient').and.callThrough();
    component.FrmgPatient.setValue(mockPatients[0]);
    component.addPatient();
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });
  it('should update patient details when form is submitted', () => {
    const spy = spyOn(component, 'editPatient').and.callThrough();
    component.FrmgPatient.setValue(mockPatients[0]);
    component.editPatient(mockPatients[0]);
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });
  it('should show patient details for a particular patient', () => {
    const patient = {
      id: 1,
      first_Name: 'Ram',
      last_Name: 'Sankoju',
      birth_Date: new Date('12/12/2023'),
      gender: 'M',
      create_Date: new Date('12/12/2023'),
    };
    const spy = spyOn(component, 'mapPatientDetails').and.callThrough();
    component.patient = patient;
    fixture.detectChanges();
    const form = fixture.debugElement.query(By.css('.edit-patient'));
    component.patientList = mockPatients;
    component.mapPatientDetails(1);
    expect(spy).toHaveBeenCalled();
  });
  it('should call initial component', () => {
    component.paginator.pageIndex = 1;
    component.getPatientData();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.patientList).toEqual(testPatients);
    });
  });
  it('should check age date validation', () => {
    const spy = spyOn(component, 'checkValidDate').and.callThrough();
    const comp = fixture.debugElement.query(By.css('.birth-date'));
    fixture.detectChanges();
    comp.triggerEventHandler('dateChange', {
      target: {
        value: new Date(),
      },
    });
    expect(spy).toHaveBeenCalled();
  });
  it('should call getPatient method', () => {
    const restService = TestBed.inject(PatientServiceService);
    const data = mockPatients;
    component.patient = mockPatients[0];
    spyOn(restService, 'getPatientList').and.returnValue(of(mockPatients));
    component.getPatientData();
    expect(component.patientList.length).toBe(1);
  });
  it('should call deletePatient method', () => {
    const restService = TestBed.inject(PatientServiceService);
    const data = mockPatients;
    component.patient = mockPatients[0];
    spyOn(restService, 'deletePatient').and.returnValue(of(mockPatients[0]));
    component.deletePatient(1);
    expect(component.patientList.length).toBe(1);
  });
  it('should call Filler method', () => {
    const mockPaginator: MatPaginator = {
      length: 40,
      pageSize: 10,
      pageIndex: 0,
      pageSizeOptions: [10, 15, 20],
      hasPreviousPage: () => component.paginator.pageIndex > 0,
      hasNextPage: () =>
        component.paginator.pageIndex <
        Math.ceil(component.paginator.length / component.paginator.pageSize),
    } as MatPaginator;
    component.dataSource.paginator = mockPaginator;
    const spy = spyOn(component, 'applyFilter').and.callThrough();

    fixture.detectChanges();
    component.dataSource.data.push({
      id: 1,
      first_Name: 'Ram',
      last_Name: 'Sankoju',
      birth_Date: new Date('12/12/2023'),
      gender: 'M',
      create_Date: new Date('12/12/2023'),
    });

    component.dataSource.filter = 'Ram';
    const comp = fixture.debugElement.query(By.css('.input_filter'));
    comp.triggerEventHandler('keyup', {
      target: {
        value: 'Ram',
      },
    });

    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
});
const mockPatients = [
  {
    id: 1,
    first_Name: 'Ram',
    last_Name: 'Sankoju',
    birth_Date: new Date('12/12/2023'),
    gender: 'M',
    create_Date: new Date('12/12/2023'),
  },
];
