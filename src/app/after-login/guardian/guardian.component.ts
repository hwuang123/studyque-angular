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
import { GuardianService } from './../../services/guardian.service';
import { GuardianBean } from './../../domains/guardian-bean';
/* import { AssignmentService } from './../../services/assignment.service';
import { AddClassService } from './../../services/add-class.service';
 */

@Component({
  selector: 'app-guardian',
  templateUrl: './guardian.component.html',
  styleUrls: ['./guardian.component.css']
})
export class GuardianComponent implements OnInit {
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
 /*  private assignmentTypeList = [];
  private classnameList = []; */

  genderOptions=[];
  yesOrNoOptions=[];
  relationOptions= [];
  stateOptions = [];
  guardian: GuardianBean;
  // assignmentType: AssignmentType;
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
    private guardianService: GuardianService,
 /*    private assignmentService: AssignmentService,
    private assignmentTypeService: AssignmentTypeService,
    private addClassService: AddClassService, */
    private commonFunctionService: CommonFunctionService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.columnDefs = [
      {
        headerName: '',
        field: 'guardianId',
        hide: true
      },
      {
        headerName: '',
        field: 'addressId',
        hide: true
      },
      {
        headerName: '',
        field: 'address',
        hide: true
      },
      {
        headerName: '',
        field: 'state',
        hide: true
      },
      {
        headerName: '',
        field: 'city',
        hide: true
      },
      {
        headerName: '',
        field: 'zip',
        hide: true
      },
      {
        headerName: '',
        field: 'addressSameAsStudent',
        hide: true
      },
      {
        headerName: 'First Name',
        field: 'firstName',
        resizable: true, 
        hide: false,
        cellStyle: {'text-align': 'left'}
      },
      {
        headerName: 'Middle Name',
        field: 'middleName',
        resizable: true, 
        hide: false,
        cellStyle: {'text-align': 'left'}
      },
      {
        headerName: 'Last Name',
        field: 'lastName',
        hide: false,
        maxWidth: 300,
        resizable: true,
        cellStyle: {'text-align': 'left'} 
      },
      {
        headerName: 'Relationship',
        field: 'relationship',
        hide: false,
        minWidth: 250,
        resizable: true,
        cellStyle: {'text-align': 'left'} 
      }, 
      {
        headerName: 'Gender',
        field: 'gender',
        maxWidth:80,
        resizable: true    
      },
      {
        headerName: 'Age',
        field: 'age',
        maxWidth:50,
        resizable: true 
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
    this.guardian = new GuardianBean();
    this.stateOptions = this.shareService.stateOptions;
    this.genderOptions = this.shareService.genderOptions;
    this.relationOptions = this.shareService.relationOptions;
    this.yesOrNoOptions = this.shareService.yesOrNoOptions;
  }

  clickGuardianGender(selectedValue): void{
    this.guardian.gender = selectedValue;
  }
  
  clickSameAddress(selectedValue): void{
     this.guardian.addressSameAsStudent = selectedValue;
  }

  saveGuardian(){
    this.guardianService.saveGuardian(this.guardian)
    .subscribe((data: GuardianBean) => {
      console.log(data);
      if(data.errorMessage){
         this.hideErrorMessage = false;
         this.hideMessage = true;
         this.errorMessage = data.errorMessage;
         this.message = data.errorMessage;
      }
      else{
         this.hideErrorMessage = true;      
         this.guardian.message = data.message;
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
   
   this.IsWait=true;
   this.shareService.targetItem = "/alert";
   this.guardianService.getGuardianList()
        .subscribe(
          (data: GuardianBean[]) => {
            console.log(data);
            console.log(JSON.stringify(data));
            this.rowData = data;
            this.IsWait=false;
          },
          error => {console.log(error); this.IsWait=false;}
        );
  }

  updateGuardian(){

    this.guardianService.updateGuardian(this.guardian.guardianId,this.guardian)
     .subscribe((data: GuardianBean) => {
       console.log(data);
       if(data.errorMessage){
          this.hideErrorMessage = false;
          this.hideMessage = true;
          this.guardian.errorMessage = data.errorMessage;
          this.errorMessage = data.errorMessage;
       }
       else{
          this.hideErrorMessage = true;      
          this.guardian.message = data.message;
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
        this.updateGuardian();
     }
     else{
       this.saveGuardian();
     }
  }

  deleteGuardian(id: number){
    this.IsWait=true;
    this.guardianService.deleteGuardian(id)
      .subscribe(
        data => {
          console.log(data);
          this.message = "Succefully deleted Guardian with ID " + id;
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

  onRowClicked(e: any) {
    if (e.event.target !== undefined) {
    let actionType = e.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "edit":
            {
              this.isUpdate = true; 
              this.guardian.guardianId =  e.data.guardianId;
              this.guardian.addressId =  e.data.addressId;
              this.guardian.firstName = e.data.firstName;
              this.guardian.middleName = e.data.middleName;
              this.guardian.lastName = e.data.lastName;
              this.guardian.gender=  e.data.gender;
              this.guardian.age=  e.data.age;
              this.guardian.relationship=  e.data.relationship;
              this.guardian.city=  e.data.city;
              this.guardian.state=  e.data.state;  
              this.guardian.zip=  e.data.zip;    
              this.guardian.address=  e.data.address;  
              this.guardian.addressSameAsStudent=  e.data.addressSameAsStudent;           
              this.guardian.errorMessage= "";
              this.guardian.message="";
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
                data: "Do you confirm the deletion of the Guardian with Name " + e.data.firstName + " " + e.data.lastName +" ?"
              });
              dialogRef.afterClosed().subscribe(result => {
                if(result) {
                  console.log('Yes clicked');
                  // DO SOMETHING
                  this.deleteGuardian(e.data.guardianId);
                }
              });
              break;
            }
      }
    }
  }
  
  cancel(){
      // this.isFromCancel = true;  
      this.guardian = new GuardianBean();
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
