import { Component, OnInit, EventEmitter, Output, LOCALE_ID, Inject, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions, IDatasource, IGetRowsParams, GridApi } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject, ReplaySubject, combineLatest, merge, of } from "rxjs";
import * as moment from 'moment';
//import { AgGridAngular } from 'ag-grid-angular';

import { AssignmentType } from './../../domains/assignment-type';
import { Assignment } from './../../domains/assignment';
import { StudentBean } from './../../domains/student-bean';
import { SearchassignmentBean } from './../../domains/searchassignment-bean';
import { ShareService } from './../../services/share.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ButtonRendererComponent } from 'src/app/shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { CommonFunctionService } from './../../shared/common-function.service';
import { AssignmentTypeService } from './../../services/assignment-type.service';
import { AssignmentService } from './../../services/assignment.service';
import { AddClassService } from './../../services/add-class.service';

@Component({
  selector: 'app-display-assignments',
  templateUrl: './display-assignments.component.html',
  styleUrls: ['./display-assignments.component.css']
})
export class DisplayAssignmentsComponent implements OnInit {
  dateValue: string;
  @ViewChild('f') classForm: NgForm;
  private gridApi;
  private gridColumnApi;
  isFromCancel:boolean = false;
  isUpdate = false;
  frameworkComponents: any;
  public modules: any[] = [
    ClientSideRowModelModule
    ]; 

  columnDefs = []; 
 
  defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
  };
  private detailCellRendererParams;
  private defaultExportParams;
  private excelStyles;
  private rowData = [];
  private assignmentTypeList = [];
  private classnameList = [];
  private dueDayOfWeekList = [];

  assignment: Assignment;
  assignmentType: AssignmentType;
  searchAssignmentBean: SearchassignmentBean;
  academicTerms = [];
  hideSucceed = true;
  hideError = true;
  errorMessage = '';
  message= '';
  hideMessage = true;
  hideErrorMessage = true; 
  IsWait = false;
  constructor(
    private router: Router,
    private shareService: ShareService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private assignmentService: AssignmentService,
    private assignmentTypeService: AssignmentTypeService,
    private addClassService: AddClassService,
    private commonFunctionService: CommonFunctionService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.columnDefs = [
      {
        headerName: '',
        field: 'pkAssignmentId',
        hide: true
      },
      {
        headerName: 'Class Name',
        field: 'classname',
        resizable: true, 
        hide: false
      },
      {
        headerName: 'Assignment Type',
        field: 'assignmenttype',
        hide: false,
        maxWidth: 300,
        resizable: true 
      },
      {
        headerName: 'Due Date',
        field: 'dueDate',
        maxWidth:200,
        valueFormatter: function (params) {
          return moment(params.value).format('MM/DD/yyyy');
        },
        resizable: true 
      }, 
      {
        headerName: 'Due Day of Week',
        field: 'dueDayofweek',
        maxWidth:200,
        resizable: true         
      },
      {
        headerName: 'Description',
        field: 'description',
        minWidth:500,
        resizable: true 
      } 
    
    ];

    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      checkboxCellRenderer: CheckboxCellRendererComponent
    }    
   }

  ngOnInit(): void {
    this.assignmentType = new AssignmentType();
    this.assignmentType.student = new StudentBean();
    this.searchAssignmentBean = new SearchassignmentBean();
    this.assignment = new Assignment();
    this.getAssignmentTypeList();
   
    this.getClassnameList();
    this.dueDayOfWeekList = this.shareService.weekDays;
  }

  getAssignmentTypeList() {
    // this.employees = this.employeeService.getEmployeesList();
   this.IsWait=true;
   this.shareService.targetItem = "/assignmenttype";
   this.assignmentTypeService.getAssignmentTypeList()
        .subscribe(
          (data: AssignmentType[]) => {
            console.log(data);
            console.log(JSON.stringify(data));
            this.assignmentTypeList = data;
            this.assignmentTypeList.push({"pkId":0,
            "assignment":"--Choose Assignment Type--",
            "description":null,
            "errorMessage":null,
            "message":null});
            this.IsWait=false;
          },
          error => {console.log(error); this.IsWait=false;}
        );
  }

  getClassnameList(){
    this.IsWait=true;
    this.addClassService.getClassNameList()
         .subscribe(
           data => {
             console.log(data);
             console.log(JSON.stringify(data));
             this.classnameList = data;
             this.classnameList.push({"pkClsnmId":0,
             "student":null,
            "classname":"--Choose Class Name--",
            "classtype":null,
            "semester":null,
            "instructor":null,
            "classroom":null,
            "semStartDate":null,
            "semEndDate":null,
            "description":null,
            "errorMessage":null,
            "message": null,
            "classdayOfweek": null });
            this.IsWait=false;
         
           },
           error => {console.log(error); this.IsWait=false;}
         );
  }

  reloadData() {
    // this.employees = this.employeeService.getEmployeesList();
   this.IsWait=true;
   this.shareService.targetItem = "/assignment";
   this.assignmentService.searchAssignmentList(this.searchAssignmentBean)
        .subscribe(
          (data: Assignment[]) => {
            console.log(data);
            console.log(JSON.stringify(data));
            this.rowData = data;
            this.IsWait=false;
          },
          error => {console.log(error); this.IsWait=false;}
        );
  }

}
