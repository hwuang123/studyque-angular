import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";
import 'jquery-ui';
import * as $ from 'jquery';
import 'jqueryui';
/* import * as $ from 'jquery';
import 'jqueryui'; */

import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';

import { ShareService } from './../../services/share.service';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
//import { SpinnerOverlayService } from './../../shared/spinner-overlay/spinner-overlay.service';

//declare var $: any;

@Component({
  selector: 'app-model-update',
  templateUrl: './model-update.component.html',
  styleUrls: ['./model-update.component.css']
})
export class ModelUpdateComponent implements OnInit {
 
  id: number;
  employee: Employee;
  submitted = false;
  hideSucceed = true;
  hideError = true;
  errorMessage = "";
  IsWait=false;
  targetItem: any = "/employees";
  employees: Observable<Employee[]>;
  @Input() fromParent: any;  
  @Output() childEmployeesOutput = new EventEmitter<Observable<Employee[]>>();

  constructor(  // Close Bootstrap Modal
    // private route: ActivatedRoute,private router: Router, private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router, 
              public activeModal: NgbActiveModal, 
              private employeeService: EmployeeService,
              private shareService: ShareService) { }

    // employeeForm = this.fb.group({
    //   firstName: ['', Validators.required],
    //   lastName: ['',  Validators.required],
    //   emailId: ['',  Validators.required]
    // });

  ngOnInit(): void {
    this.employee = new Employee();
    // this.id = this.route.snapshot.params['id'];
    this.id = this.fromParent;
    this.hideSucceed = true;
    this.hideError = true;
    this.IsWait = true;
    this.shareService.currentTargetItem.subscribe( targetItem => this.targetItem = targetItem);
    this.employeeService.getEmployee(this.id)
      .subscribe(data => {
        console.log(data)
        this.employee = data;
        this.IsWait = false;
      }, error => { 
        console.log(error);
        this.IsWait = false;
      });
    $(document).ready(function () {
      let modalContent: any = $('.modal-content');
     
      modalContent.draggable({
        handle: '.modal-header',
        revert: true,
        revertDuration: 1400,

      });
    });
   
  }

  updateEmployee() {
    //this.spinnerOverlayService.show("Updating...");
    this.IsWait = true;
    this.employeeService.updateEmployee(this.id, this.employee)
      .subscribe(data => {
        console.log(data);
        //this.activeModal.close();
        this.employees = this.employeeService.getEmployeesList();
        this.childEmployeesOutput.emit(this.employees);
       // this.employee = new Employee();
        this.hideSucceed = false;
        this.hideError = true;
        this.IsWait = false;
        //this.spinnerOverlayService.hide();
        this.gotoList();
      },
       error => {
        this.errorMessage = error.message;
        this.hideError = false;
        this.hideSucceed = true; 
        this.IsWait = false;
        console.log(error);

      });
    // this.employee = new Employee();
    // this.gotoList();
  }

  onSubmit() {
    //this.submitted = true;
    this.updateEmployee();    
  }

  gotoList() {
    //this.router.navigate(['/employees']);
    const nextTarget = this.shareService.targetItem;
    this.router.navigate( [nextTarget]);
  }

}
//npm install --save jquery jqueryui