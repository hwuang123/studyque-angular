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

import { AssignmentType } from './../../domains/assignment-type';
import { Assignment } from './../../domains/assignment';
import { StudentBean } from './../../domains/student-bean';
import { ShareService } from './../../services/share.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ButtonRendererComponent } from 'src/app/shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { CommonFunctionService } from './../../shared/common-function.service';
import { AssignmentTypeService } from './../../services/assignment-type.service';
import { AssignmentService } from './../../services/assignment.service';
import { AddClassService } from './../../services/add-class.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {
  dateValue: string;
  @ViewChild('f') classForm: NgForm;
  private gridApi;
  private gridColumnApi;
  isFromCancel:boolean = false;
  isUpdate = false;
  frameworkComponents: any;
  public modules: any[] = [
    ClientSideRowModelModule
  /*  MasterDetailModule,
    MenuModule,
    ColumnsToolPanelModule,
    ClipboardModule,
    ExcelExportModule,*/
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

  assignment: Assignment;
  assignmentType: AssignmentType;
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
        hide: false,
        cellStyle: {'text-align': 'left'}
      },
      {
        headerName: 'Assignment Type',
        field: 'assignmenttype',
        hide: false,
        maxWidth: 300,
        resizable: true,
        cellStyle: {'text-align': 'left'} 
      },
      {
        headerName: 'Due Day',
        field: 'dueDate',
        maxWidth:200,
        valueFormatter: function (params) {
          return moment(params.value).format('MM/DD/yyyy');
        },
        resizable: true,
        cellStyle: {'text-align': 'left'} 
      }, 
      {
        headerName: 'Due Day of Week',
        field: 'dueDayofweek',
        maxWidth:200,
        resizable: true,
        cellStyle: {'text-align': 'left'}         
      },
      {
        headerName: 'Description',
        field: 'description',
        minWidth:500,
        resizable: true,
        cellStyle: {'text-align': 'left'} 
      }, 
      {
          headerName: 'Update',
          template: `<button data-action-type="edit" class="mybtn" type="button" >edit</button>`,
          width: 90,
          minWidth:80,
          maxWidth: 100,
          resizable: true 
      },  
      {
          headerName: 'Delete',
          template: `<button data-action-type="delete" class="mybtn" type="button" >delete</button>`,
          width: 90,
          minWidth:80,
          maxWidth: 100,
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
    this.assignment = new Assignment();
    this.getAssignmentTypeList();
    this.getClassnameList();
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
             this.IsWait=false;
         
           },
           error => {console.log(error); this.IsWait=false;}
         );
  }

  saveAssignment(){
    this.assignment.dueDate = this.addDays(this.assignment.dueDate,1);
    this.assignmentService.saveAssignment(this.assignment)
    .subscribe((data: Assignment) => {
      console.log(data);
      if(data.errorMessage){
         this.hideErrorMessage = false;
         this.hideMessage = true;
         this.errorMessage = data.errorMessage;
         this.message = data.errorMessage;
      }
      else{
         this.hideErrorMessage = true;      
         this.assignmentType.message = data.message;
         this.message = data.message;
         this.hideMessage = false;
         this.reloadData();
      }
      
    },
     err =>{ 
       console.log(err);
       this.hideErrorMessage = false;
       this.hideMessage = false;
       this.errorMessage = err.error.errorMessage;        
    }
     
     ); 
  }

  reloadData() {
    // this.employees = this.employeeService.getEmployeesList();
   this.IsWait=true;
   this.shareService.targetItem = "/assignment";
   this.assignmentService.getAssignmentList()
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

  updateAssignment(){
    this.assignment.dueDate = this.addDays(this.assignment.dueDate,1);
    this.assignmentService.updateAssignment(this.assignment.pkAssignmentId,this.assignment)
     .subscribe((data: Assignment) => {
       console.log(data);
       if(data.errorMessage){
          this.hideErrorMessage = false;
          this.hideMessage = true;
          this.assignment.errorMessage = data.errorMessage;
          this.errorMessage = data.errorMessage;
       }
       else{
          this.hideErrorMessage = true;      
          this.assignment.message = data.message;
          this.message = data.message;
          this.hideMessage = false;
          this.reloadData();
       }
       
     },
      err =>{ 
        console.log(err);
        this.hideErrorMessage = false;
        this.hideMessage = false;
        this.errorMessage = err.error.errorMessage;        
     }
      
      ); 
      this.isUpdate = false;
   }
 
   onSubmit(): void{
     if(this.isUpdate){
        this.updateAssignment();
     }
     else{
       this.saveAssignment();
     }
  }

  deleteAssignment(id: number){
    this.IsWait=true;
    this.assignmentService.deleteAssignment(id)
      .subscribe(
        data => {
          console.log(data);
          this.message = "Succefully deleted Assignment with ID " + id;
          this.hideError = true;
          this.hideSucceed = false;
          this.IsWait=false;
          this.reloadData();
        },
        error => { 
          console.log(error)
          this.hideError = false;
          this.hideSucceed = true;
          this.errorMessage = error.message;
        }
      );
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  onRowClicked(e: any) {
    if (e.event.target !== undefined) {
    let actionType = e.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "edit":
            {
              this.isUpdate = true; 
              this.assignment.pkAssignmentId =  e.data.pkAssignmentId;
              this.assignment.classname = e.data.classname;
              this.assignment.assignmenttype = e.data.assignmenttype;
              this.assignment.description = e.data.description;
              this.assignment.dueDate= new Date(e.data.dueDate);
              this.assignment.dueDate= this.addDays(this.assignment.dueDate,-1); 
             // this.assignment.dueDate = e.data.dueDate;
              this.assignment.dueDayofweek = e.data.dueDayofweek;
              this.assignment.errorMessage= "";
              this.assignment.message="";
              this.hideErrorMessage = true;
              this.hideMessage = true;
              break;
            }
        case "delete":
            { 
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '490px',
                height: "160px",
                panelClass: 'mat-dialog-container',
                data: "Do you confirm the deletion of the Assignment with Assignment Id " + e.data.pkAssignmentId + " for Assignment Type " + e.data.assignmenttype +" ?"
              });
              dialogRef.afterClosed().subscribe(result => {
                if(result) {
                  console.log('Yes clicked');
                  // DO SOMETHING
                  this.deleteAssignment(e.data.pkAssignmentId);
                }
              });
              break;
            }
      }
    }
  }
  
  cancel(){
    /*   this.isFromCancel = true;  */
      this.assignment = new Assignment();
      this.isUpdate = false;
      this.hideErrorMessage = true;
      this.hideMessage = true;
     }
    
  onGridReady(params: any) {
      this.IsWait = true;
      this.gridApi = params.api;
      this.gridApi.sizeColumnsToFit();
      this.gridApi.resetRowHeights();
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    
      this.reloadData();
    }
    
}
