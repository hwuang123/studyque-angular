import { Component, OnInit, EventEmitter, Output, LOCALE_ID, Inject, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { Module } from '@ag-grid-enterprise/all-modules';
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

@Component({
  selector: 'app-assignment-type',
  templateUrl: './assignment-type.component.html',
  styleUrls: ['./assignment-type.component.css']
})
export class AssignmentTypeComponent implements OnInit {

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

  assignment: Assignment;
  assignmentType: AssignmentType;
  academicTerms = [];
  /* hideSucceed = true;
  hideError = true; */
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
    private assignmentTypeService: AssignmentTypeService,
    private commonFunctionService: CommonFunctionService,
    @Inject(LOCALE_ID) private locale: string
  ) {

    this.columnDefs = [
      {
        headerName: '',
        field: 'pkId',
        hide: true
      },
      {
        headerName: 'Assignment Type',
        field: 'assignment',
        cellRenderer: 'agGroupCellRenderer',
        maxWidth: 300,
        resizable: true,
        cellStyle: {'text-align': 'left'}   
      },
      {
          headerName: 'Description',
          field: 'description',
          minWidth:400,
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
          width: 110,
          minWidth:110,
          maxWidth: 120,
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
  }

  saveAssignmentType(){
   
    this.assignmentTypeService.saveAssignmentType(this.assignmentType)
    .subscribe((data: AssignmentType) => {
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

  updateAssignmentType(){
   this.assignmentTypeService.updateAssignmentType(this.assignmentType.pkId,this.assignmentType)
    .subscribe((data: AssignmentType) => {
      console.log(data);
      if(data.errorMessage){
         this.hideErrorMessage = false;
         this.hideMessage = true;
         this.assignmentType.errorMessage = data.errorMessage;
         this.errorMessage = data.errorMessage;
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
     this.isUpdate = false;
  }

  onSubmit(): void{
    if(this.isUpdate){
       this.updateAssignmentType();
    }
    else{
      this.saveAssignmentType();
    }
 }

 deleteAssignmentType(id: number){
  this.IsWait=true;
  this.assignmentTypeService.deleteAssignmentType(id)
    .subscribe(
        data => {
        let obj: AssignmentType = JSON.parse(data);
        console.log(obj.errorMessage);
       /*  this.message = "Succefully deleted Assignment Type with ID " + id;
        this.hideErrorMessage = true;
        this.hideMessage = false;
        this.IsWait=false;
        this.reloadData(); */
        if(obj.errorMessage){
          this.hideErrorMessage = false;
          this.hideMessage = true;
          this.assignmentType.errorMessage = obj.errorMessage;
          this.errorMessage = obj.errorMessage;       
       }
       else{
        this.hideErrorMessage = true;      
        this.assignmentType.message = obj.message;
        this.message = obj.message;
        this.hideMessage = false;
        this.reloadData();
       
       }
      },
      error => { 
        console.log(error)
        this.hideErrorMessage = false;
        this.hideMessage = true;
        this.errorMessage = error.message;
      }
    );
}

 onRowClicked(e: any) {
  if (e.event.target !== undefined) {
  let actionType = e.event.target.getAttribute("data-action-type");
    switch (actionType) {
      case "edit":
          {
            this.isUpdate = true; 
            this.assignmentType.pkId =  e.data.pkId;
            this.assignmentType.assignment = e.data.assignment;
            this.assignmentType.description = e.data.description;
            this.assignmentType.errorMessage= "";
            this.assignmentType.message="";
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
              data: "Do you confirm the deletion of the Assignment Type with name " + e.data.assignment +" ?"
            });
            dialogRef.afterClosed().subscribe(result => {
              if(result) {
                console.log('Yes clicked');
                // DO SOMETHING
                this.deleteAssignmentType(e.data.pkId);
              }
            });
            break;
          }
    }
  }
}

reloadData() {
    // this.employees = this.employeeService.getEmployeesList();
   this.IsWait=true;
   this.shareService.targetItem = "/assignmenttype";
   this.assignmentTypeService.getAssignmentTypeList()
        .subscribe(
          data => {
            console.log(data);
            console.log(JSON.stringify(data));
            this.rowData = data;
            this.IsWait=false;
          },
          error => {console.log(error); this.IsWait=false;}
        );
  }
  
  cancel(){
    /*   this.isFromCancel = true;  */
      this.assignmentType = new AssignmentType();
      this.assignmentType.student = new StudentBean();
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
