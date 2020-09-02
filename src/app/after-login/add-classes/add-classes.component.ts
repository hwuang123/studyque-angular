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
/*import { MasterDetailModule } from '@ag-grid-enterprise/master-detail';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export'; */
import { AddClassScheduleComponent } from './../../modal/add-class-schedule/add-class-schedule.component';
import { Assignment } from './../../domains/assignment';
import { AssignmentType } from './../../domains/assignment-type';
import { ClassName } from './../../domains/class-name';
import { ClassdayOfWeek } from './../../domains/classday-of-week';
import { StudentBean } from './../../domains/student-bean';
import { ShareService } from './../../services/share.service';
import { AddClassService } from './../../services/add-class.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ButtonRendererComponent } from 'src/app/shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { CommonFunctionService } from './../../shared/common-function.service';

@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.component.html',
  styleUrls: ['./add-classes.component.css']
})
export class AddClassesComponent implements OnInit {
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
 /*  private rowData = [
    {
    classname:"Math",
    classtype:"high school",
    semester:"Semaster",
    instructor:"John Lee"  
    },
    {
    classname:"English",
    classtype:"high school",
    semester:"Semester",
    instructor:"Smith Dennis"
    }
  ]; */
  /* private rowData = [
    {"pkClsnmId":0,
   // "studentBean":{"title":null,"gender":"M","age":"19","firstName":"Steve","middleName":null,"lastName":"Hwuang","major":"CS","email":null,"confirmEmail":null,"homePhone":null,"cellPhone":null,"address":null,"city":null,"state":null,"zip":null},
    "classname":"Math",
    "classtype":"high school",
    "semester":"Semaster",
    "instructor":"John Lee",
    "classroom":"201",
    "semStartDate":null,
    "semEndDate":null,
    "description":"Math class",
    "errorMessage":null,
    "message":null,
   // "classdayOfweek":[]
    },
    {"pkClsnmId":0,
   // "studentBean":{"title":null,"gender":"M","age":"19","firstName":"Steve","middleName":null,"lastName":"Hwuang","major":"CS","email":null,"confirmEmail":null,"homePhone":null,"cellPhone":null,"address":null,"city":null,"state":null,"zip":null},
    "classname":"English",
    "classtype":"high school",
    "semester":"Semester",
    "instructor":"Smith Dennis",
    "classroom":"119",
    "semStartDate":null,
    "semEndDate":null,
    "description":"English one class",
    "errorMessage":null,
    "message":null,
  //  "classdayOfweek":[]
  }
  ]; */

  assignment: Assignment;
  assignmentType: AssignmentType;
  className: ClassName;
  classdayOfWeek: ClassdayOfWeek;
  academicTerms = [];
  hideSucceed = true;
  hideError = true;
  errorMessage = '';
  message= '';
  hideMessage = true;
  hideErrorMessage = true; 
  IsWait = false;
   
 /*  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
    this.apiService(params).subscribe(data => {
      params.successCallback(
        data,
        this.lastRow
      );
      this.IsWait = false;
    })
  }
}
 */

  constructor(private router: Router,
    private shareService: ShareService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private addClassService: AddClassService,
    private commonFunctionService: CommonFunctionService,
    @Inject(LOCALE_ID) private locale: string) { 

      this.columnDefs = [
        {
          headerName: '',
          field: 'pkClsnmId',
          hide: true
        },
        {
          headerName: 'Class Name',
          field: 'classname',
          cellRenderer: 'agGroupCellRenderer',
          resizable: true 
        },
        { headerName: 'Class Type',
          field: 'classtype',
          resizable: true  },
        { headerName: 'Instructor',
          field: 'instructor',
          resizable: true  },
        { headerName: 'Class Room',
          field: 'classroom',
          resizable: true  },
        { headerName: 'Academic Term',
          field: 'semester',
          resizable: true  },
        { headerName: 'Academic Start Date',
          field: 'semStartDate',
          valueFormatter: function (params) {
            return moment(params.value).format('MM/DD/yyyy');
        },
         /*  cellRenderer: (data) => { return formatDate(data.value, 'MM/dd/yyyy', this.locale); }, */
          resizable: true  },
        { headerName: 'Academic End Date',
          field: 'semEndDate',
          valueFormatter: function (params) {
            return moment(params.value).format('MM/DD/yyyy');
        },
          resizable: true  }, 
          {
            headerName: '',
            field: 'description',
            hide: true
          }, 
        {
            headerName: 'Update',
            template: `<button data-action-type="edit" class="mybtn" type="button" >edit</button>`,
            /* template: `<button data-action-type="edit" class="btn btn-info btn-sm btn-primary py-0" type="button" >Edit</button>`, */
            /* cellRenderer: 'buttonRenderer',
            cellRendererParams: {
              onClick: this.onBtnClickUpdate.bind(this),
              label: 'update'
            }, */
            width: 90,
            minWidth:80,
            maxWidth: 100,
            resizable: true 
        },  
        {
            headerName: 'Delete',
            template: `<button data-action-type="delete" class="mybtn" type="button" >delete</button>`,
           /*  cellRenderer: 'buttonRenderer',
            cellRendererParams: {
              onClick: this.onBtnClickDelete.bind(this),
              label: 'delete'
            }, */
            width: 90,
            minWidth:80,
            maxWidth: 100,
            resizable: true 
        } ,
        {
          headerName: 'Create Shedule',
          template: `<button data-action-type="schedule" class="mybtn" type="button" >schedule</button>`,
          /* cellRenderer: 'buttonRenderer',
          cellRendererParams: {
            onClick: this.onBtnClickCreateSchedule.bind(this),
            label: 'schedule'
          }, */
          width: 150,
          minWidth:150,
          maxWidth: 160,
          resizable: true 
      }      
      ];
      this.detailCellRendererParams = {
        detailGridOptions: {
          columnDefs: [
            { headerName: 'Day of Week',
              field: 'weekday' },
            { headerName: 'Class Start Time',
              field: 'starttime',
              minWidth: 150, },
            { headerName: 'Class End Time',
              field: 'endtime',
              minWidth: 150, },
            /* {
              field: 'duration',
              valueFormatter: "x.toLocaleString() + 's'",
            }, */
           
          ],
          defaultColDef: {
            flex: 1,
            filter: true,
          },
        },
        getDetailRowData: function(params) {
          params.successCallback(params.data.classdayOfweek);
        },
      };

      this.frameworkComponents = {
        buttonRenderer: ButtonRendererComponent,
        checkboxCellRenderer: CheckboxCellRendererComponent
      }               
    }

  ngOnInit(): void {
    this.assignment = new Assignment();
    this.assignmentType = new AssignmentType();
    this.assignmentType.student = new StudentBean();
    this.className = new ClassName();
    this.className.classdayOfweek = new Array<ClassdayOfWeek>();
    this.className.classdayOfweek = null;
    this.className.student = new StudentBean();
    this.classdayOfWeek = new ClassdayOfWeek();
   // this.classdayOfWeek.classname = this.className;
    this.academicTerms = this.shareService.academicTerms;

  }

  validateDates(){
    let validateInfo = this.commonFunctionService.validateDateRange( this.className.semStartDate, this.className.semEndDate);
    this.errorMessage = validateInfo.errorMessage;
    this.hideMessage = validateInfo.error;
    this.hideErrorMessage = !validateInfo.error;
    if(validateInfo.error == true){
      this.classForm.controls['semStartDate'].setErrors({ 'incorrect': true});
      this.classForm.controls['semEndDate'].setErrors({ 'incorrect': true});
    }
    else{
      this.classForm.controls['semStartDate'].setErrors(null);
      this.classForm.controls['semEndDate'].setErrors(null);
    }
  }

  saveClassName(){
    this.className.semStartDate= this.addDays(this.className.semStartDate,1); 
    this.className.semEndDate= this.addDays(this.className.semEndDate,1); 
    this.addClassService.saveClassName(this.className)
    .subscribe((data: ClassName) => {
      console.log(data);
      if(data.errorMessage){
         this.hideErrorMessage = false;
         this.hideMessage = true;
         this.className.errorMessage = data.errorMessage;
         this.errorMessage = data.errorMessage;
      }
      else{
         this.hideErrorMessage = true;      
         this.className.message = data.message;
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

addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
}

updateClassName(){
    this.className.semStartDate = this.addDays(this.className.semStartDate,1);
    this.className.semEndDate = this.addDays(this.className.semEndDate,1);
    this.dateValue = formatDate(this.className.semStartDate, 'MM/dd/yyyy', this.locale);
    this.addClassService.updateClassName(this.className.pkClsnmId,this.className)
    .subscribe((data: ClassName) => {
      console.log(data);
      if(data.errorMessage){
         this.hideErrorMessage = false;
         this.hideMessage = true;
         this.className.errorMessage = data.errorMessage;
         this.errorMessage = data.errorMessage;
      }
      else{
         this.hideErrorMessage = true;      
         this.className.message = data.message;
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
       this.updateClassName();
    }
    else{
      this.saveClassName();
    }

 }

 onBtnClickCreateSchedule(e){
  const modalRef = this.modalService.open(AddClassScheduleComponent, {
     scrollable: true,
    //windowClass: 'md-Class',
    // keyboard: false,
    // backdrop: 'static'
     // size: 'xl',
      windowClass: 'modal-xxl', 
      size: 'lg'
   });
  modalRef.componentInstance.fromParent = e.data.pkClsnmId;
  modalRef.result.then(
      result => {
          this.reloadData();
          console.log(result);
      },
      reason => {}
  );
 }

/*  onMyDateChange(event: any) {
  this.className.semEndDate= new Date(event.target.value);
} */

onRowClicked(e: any) {
  if (e.event.target !== undefined) {
  let actionType = e.event.target.getAttribute("data-action-type");
    switch (actionType) {
      case "edit":
          {
            this.isUpdate = true; 
            this.className.pkClsnmId =  e.data.pkClsnmId;
            this.className.classname = e.data.classname;
            this.className.classtype= e.data.classtype;
            this.className.semester= e.data.semester;
            this.className.instructor= e.data.instructor;
            this.className.classroom= e.data.classroom;
            this.className.semStartDate= new Date(e.data.semStartDate);
            this.className.semStartDate= this.addDays(this.className.semStartDate,-1); 
            this.className.semEndDate= new Date(e.data.semEndDate);
            this.className.semEndDate= this.addDays(this.className.semEndDate,-1); 
            this.className.description= e.data.description;
            this.className.errorMessage= "";
            this.className.message="";
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
              data: "Do you confirm the deletion of the class name with name " + e.data.classname +" ?"
            });
            dialogRef.afterClosed().subscribe(result => {
              if(result) {
                console.log('Yes clicked');
                // DO SOMETHING
                this.deleteClassNameByService(e.data.pkClsnmId);
              }
            });
            break;
          }
       case "schedule":
         {
           this.onBtnClickCreateSchedule(e);
           break;
         }   
    }
  }
}

 onBtnClickUpdate(e) {
  this.isUpdate = true; 
  this.className.pkClsnmId =  e.rowData.pkClsnmId;
	this.className.classname = e.rowData.classname;
	this.className.classtype= e.rowData.classtype;
	this.className.semester= e.rowData.semester;
	this.className.instructor= e.rowData.instructor;
  this.className.classroom= e.rowData.classroom;
  this.className.semStartDate= new Date(e.rowData.semStartDate);
	this.className.semEndDate= new Date(e.rowData.semEndDate); 
	this.className.description= e.rowData.description;
/* 
  const modalRef = this.modalService.open(ModelUpdateComponent, {
    // scrollable: true,
    //windowClass: 'md-Class',
    // keyboard: false,
    // backdrop: 'static'
     // size: 'xl',
     // windowClass: 'modal-xxl', 
     // size: 'lg'
   });
  modalRef.componentInstance.fromParent = e.rowData.id;
  modalRef.result.then(
      result => {
          this.reloadData();
          console.log(result);
      },
      reason => {}
  ); */
}

deleteClassNameByService(id: number){
  this.IsWait=true;
  this.addClassService.deleteClassName(id)
    .subscribe(
      data => {
        console.log(data);

        this.message = "Succefully deleted clssname with ID " + id;
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

onBtnClickDelete(e) {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '490px',
    height: "160px",
    panelClass: 'mat-dialog-container',
    data: "Do you confirm the deletion of the class name with name " + e.rowData.classname +" ?"
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result) {
      console.log('Yes clicked');
      // DO SOMETHING
      this.deleteClassNameByService(e.rowData.pkClsnmId);
    }
  });
 }

 cancel(){
/*   this.isFromCancel = true;  */
  this.className = new ClassName();
  this.className.classdayOfweek = new Array<ClassdayOfWeek>();
  this.className.classdayOfweek = null;
  this.className.student = new StudentBean();
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

reloadData() {
  // this.employees = this.employeeService.getEmployeesList();
 this.IsWait=true;
 this.shareService.targetItem = "/grid";
 this.addClassService.getClassNameList()
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

onFirstDataRendered(params) {
  setTimeout(function() {
    params.api.getDisplayedRowAtIndex(1).setExpanded(true);
  }, 0);
}


}
