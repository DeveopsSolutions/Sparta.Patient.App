import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Patient } from 'src/app/core/models/patient.model';
import { PatientServiceService } from 'src/app/core/services/patient/patient-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { event } from 'jquery';
declare var $: any;
@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss'],
})
export class PatientDashboardComponent implements OnInit {
  PatientList: Patient[] = [
    {
      id: 1,
      first_Name: 'Rambabu',
      last_Name: 'Sankoju',
      birth_Date: new Date('12/12/2023'),
      create_Date: new Date('12/12/2023'),
      gender: 'M',
    },
  ];
  showModalBox: boolean = false;
  idValidDate:boolean=false;
  modelTitle='';
  @ViewChild('content') content: any;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  patientList!: Patient[];
  patient!: Patient;
  FrmgPatient!: FormGroup;
  dataSource = new MatTableDataSource<Patient>();
  displayedColumns = [
    'id',
    'first_Name',
    'last_Name',
    'birth_Date',
    'create_Date',
    'actions',
  ];
  constructor(
    private _service: PatientServiceService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.getPatientData();

    this.FrmgPatient = this.fb.group({
      id: [''],
      first_Name: ['', Validators.required],
      last_Name: ['', Validators.required],
      gender: ['0', Validators.required],
      birth_Date: ['', Validators.required],
      create_Date: [''],
    });
    this.FrmgPatient.controls['gender'].setValue('0');
  }
  resetForm() {
    this.modelTitle='Add Patient';
    this.FrmgPatient.reset();
  }
  getPatientData() {
    this._service.getPatientList().subscribe((result) => {
      if (result) {
        this.patientList = result;
        this.dataSource = new MatTableDataSource<Patient>(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.FrmgPatient.reset();
        this.FrmgPatient.controls['gender'].setValue('0');
      }
    });
  }
  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addPatient() {   
    if (!this.FrmgPatient.controls['id'].value) {
      this.patient = this.FrmgPatient.value;
      this.patient.create_Date = new Date();
      this._service.addPatient(this.patient).subscribe((result) => {
        if (result) {
          alert('Successfully patient record created.');
          this.getPatientData();          
        } else {
          alert('error occured while creating patient record.');
        }
      });
    } else {
      this.patient = this.FrmgPatient.value;
      this.editPatient(this.patient);
    }
  }
  editPatient(patient: Patient) {
    this._service.updatePatient(patient).subscribe((result) => {
      if (result) {
        alert('Successfully updated patient record.');
        this.getPatientData();
      } else {
        alert('Update failed.');
      }
    });
  }
  mapPatientDetails(id: number) {
    this.modelTitle='Edit Patient';
    this.patient = this.patientList.filter((p) => p.id == id)[0];
    this.FrmgPatient.setValue(this.patient);
  }
  deletePatient(id: number) {
    this._service.deletePatient(id).subscribe((result) => {
      if (result) {
        alert('Deleted patient record.');
        this.getPatientData();
      } else {
        alert('Delete failed.');
      }
    });
  }
  checkValidDate(value: any) {
    var totalMonths =
      (new Date().getFullYear() - value.target.value.getFullYear()) * 12 +
      (new Date().getMonth() - value.target.value.getMonth());
      this.idValidDate= totalMonths >= 180 ? false : true;
    if(this.idValidDate)
    this.FrmgPatient.controls['birth_Date'].setValue('');
  }
}
