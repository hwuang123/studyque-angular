import { Component, OnInit, EventEmitter, Output, Input, LOCALE_ID, Inject, ViewChild,  AfterViewInit, forwardRef, Pipe, PipeTransform } from '@angular/core';
import { browser } from 'protractor';
import { formatDate, DatePipe } from '@angular/common';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
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
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import { ClassName } from './../../domains/class-name';
import { Assignment } from './../../domains/assignment';
import { MethodBean } from './../../domains/method-bean';
import { StudentBean } from './../../domains/student-bean';
import { ShareService } from './../../services/share.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ButtonRendererComponent } from 'src/app/shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { CommonFunctionService } from './../../shared/common-function.service';
import { AssignmentService } from './../../services/assignment.service';
import { AlertService } from './../../services/alert.service';
import { AddClassService } from './../../services/add-class.service';
import { GuardianService } from './../../services/guardian.service';
import { ContactService } from './../../services/contact.service';
import { AlertBean } from './../../domains/alert-bean';
import { GuardianBean } from './../../domains/guardian-bean';
import { ContactBean } from './../../domains/contact-bean.bean';
import { SearchassignmentBean } from './../../domains/searchassignment-bean';
import { SearchAlertBean } from './../../domains/searchAlert-bean';
import { SelectZeroValidatorDirective } from './../../directive/select-zero-validator.directive';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  dateValue: string;
  @ViewChild('f') classForm: NgForm;
  private gridApi;
  private gridColumnApi;
  isFromCancel:boolean = false;
  isUpdate = false;
  browserType;
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
 
  fmt = 'MM/dd/yyyy h:mm:ss a';
  timefmt = 'h:mm:ss a';
  dtfmt = "MM/dd/yyyy, h:mm a";
  defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
  };
  private detailCellRendererParams;
  private defaultExportParams;
  private excelStyles;
  private rowData = [];

  private classnameList = [];
  private assignmentList = [];
  private guardianList = [];
  private contactList = [];
  private methodList = [];
  private repeatDaysList = [];
  assignment: Assignment;
  searchassignmentBean: SearchassignmentBean;
  alert: AlertBean;
  searchAlertBean: SearchAlertBean;
  academicTerms = [];
  /* hideSucceed = true;
  hideError = true; */
  errorMessage = '';
  private message= '';
  hideMessage = true;
  hideErrorMessage = true; 
  IsWait = false;
  isStudentNotification: string="No";
  formGroup : FormGroup;
  dateModel: Date = new Date();
  stringDateModel: string = new Date().toString();
  showDueDate: any;
  alertStartDatetime: any;
  alertEndDatetime: any;
  alertTime: any;
  notificationStatus = [];
  contactChoices: any[] = [{ 
    "value":"Yes",
    "label":"Yes"        
   },
   {
    "value":"No",
    "label":"No"        
   }];
  constructor(
    private router: Router,
    private shareService: ShareService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private assignmentService: AssignmentService,
    private alertService: AlertService,
    private addClassService: AddClassService,
    private guardianService: GuardianService,
    private contactService: ContactService,
    private commonFunctionService: CommonFunctionService,
    private datePipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string
  ) { 
    this.columnDefs = [
      {
        headerName: '',
        field: 'pkAlertId',
        hide: true
      },
      {
        headerName: '',
        field: 'pkClsnmId',
        hide: true
      },
      {
        headerName: '',
        field: 'pkAssignmentId',
        hide: true
      },
      {
        headerName: '',
        field: 'pkGuardianId',
        hide: true
      },
      {
        headerName: '',
        field: 'pkContactId',
        hide: true
      },
      {
        headerName: '',
        field: 'pkMethodId',
        hide: true
      },
      {
        headerName: 'Class Name',
        field: 'assignmentBean.classname',
        resizable: true,
        cellStyle: {'text-align': 'left'}  
      },
      {
        headerName: 'Assignment',
        field: 'assignmentBean.assignmenttype',
        resizable: true,
        maxWidth: 150,
        cellStyle: {'text-align': 'left'}  
      },
      {
        headerName: 'Guardian',
        field: 'guardianName',
        resizable: true,
        maxWidth: 150,
        cellStyle: {'text-align': 'left'}  
      },
      {
        headerName: 'Notify With',
        field: 'mediaVal',
        resizable: true,
        maxWidth: 140,
        cellStyle: {'text-align': 'left'}  
      },
      {
        headerName: 'Notification Time',
        field: 'alerttime',
        resizable: true,
        minWidth: 100,
        cellStyle: {'text-align': 'left'}  
      },     
      {
        headerName: 'Notification Start Time',
        field: 'alertStartDateTime',
        resizable: true,
        minWidth: 165,
        cellStyle: {'text-align': 'left'}  
      },
      {
        headerName: 'Notification End Time',
        field: 'alertEndDateTime',
        minWidth: 165,
        resizable: true,
        cellStyle: {'text-align': 'left'}  
      },
      {
        headerName: 'Days of Alert',
        field: 'repeatDays',
        maxWidth: 150,
        resizable: true 
      },
      {
        headerName: 'Alert Message',
        field: 'alertMessage',
        resizable: true,
        cellStyle: {'text-align': 'left'}  
      },
      {
        headerName: '',
        field: 'alertSubject',
        hide: true
      },
      {
        headerName: '',
        field: 'alertedStatus',
        hide: true
      },
      {
          headerName: 'Update',
          template: `<button data-action-type="edit" class="mybtn" type="button" >edit</button>`,
       width: 105,
       //   minWidth:100,
        //  maxWidth: 70,
          resizable: true 
      },  
      {
          headerName: 'Delete',
          template: `<button data-action-type="delete" class="mybtn" type="button" >delete</button>`,
          width: 100,
        //  minWidth:50,
      //    maxWidth: 100,
          resizable: true 
      }
    ];

    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      checkboxCellRenderer: CheckboxCellRendererComponent
    }    
  }

  ngOnInit(): void {
    this.assignment = new Assignment();
    this.alert = new AlertBean();
    this.alert.alertedStatus = 1;
    this.searchAlertBean = new SearchAlertBean();
    this.searchassignmentBean = new SearchassignmentBean();
    this.getClassnameList();
    this.getAssignmentList();
    this.getGuardianList();
    this.getMethodList();
    this.getRepeatDaysList();
    this.browserType = this.myBrowser();
    this.notificationStatus = this.shareService.notificationStatus;
    this.formGroup = new FormGroup({
      activeEndDate:  new FormControl(new Date(), {validators: [Validators.required, DateTimeValidator]})
    }, { updateOn: 'change' });
  }

  getClassnameList(){
    this.IsWait=true;
    this.addClassService.getClassNameList()
         .subscribe(
           data => {
             console.log(data);
             console.log(JSON.stringify(data));
             const newClassName: ClassName = new ClassName();
             newClassName.pkClsnmId = 0;
             newClassName.classname = "Select a Class Name"; 
             this.classnameList = data;
             this.classnameList.unshift(JSON.parse(JSON.stringify(newClassName)));
             this.IsWait=false;
         
           },
           error => {console.log(error); this.IsWait=false;}
         );
  }

  getAssignmentList(){
    this.IsWait=true;
   /*  this.assignmentService.getAssignmentList()
         .subscribe( */
    this.assignmentService.searchAssignmentList(this.searchassignmentBean)
          .subscribe(       
           data => {
             console.log(data);
             console.log(JSON.stringify(data));
             const newAssignment: Assignment = new Assignment();
             newAssignment.pkAssignmentId = 0;
             newAssignment.assignmenttype = "Select an Assignment";
        
             this.assignmentList = data;
            //  this.assignmentList.unshift(JSON.parse(JSON.stringify(newAssignment)));
             this.IsWait=false;
         
           },
           error => {console.log(error); this.IsWait=false;}
         );
  }

  getGuardianList(){
    this.IsWait=true;
    this.guardianService.getGuardianList()
         .subscribe(
           data => {
             console.log(data);
             console.log(JSON.stringify(data));
             const newGuardianBean: GuardianBean = new GuardianBean();
             newGuardianBean.guardianId = 0;
             newGuardianBean.firstName = "Select a Guardian";
             this.guardianList = data;
             this.guardianList.unshift(JSON.parse(JSON.stringify(newGuardianBean)));
             this.IsWait=false;
         
           },
           error => {console.log(error); this.IsWait=false;}
         );
  }

getStudentContactList(){
    this.contactList = [];
    this.alert.mediaVal = '';
    this.alert.pkGuardianId = 0;
    this.alert.pkContactId = 0;
    if(this.isStudentNotification == 'Yes'){
       this.IsWait=true;    
       this.contactService.getStudentOnlyContactList(0)
         .subscribe(
           data => {
             console.log(data);
             console.log(JSON.stringify(data));
             const newContactBean: ContactBean = new ContactBean();
             newContactBean.pkContactId = 0;
             newContactBean.contactMethod = "Select a Method";
             this.contactList = data;
             if(this.contactList.length > 1){
              this.contactList.unshift(JSON.parse(JSON.stringify(newContactBean)));
             }
             if(this.contactList.length == 1){
                let contact: ContactBean = this.contactList[0];
                this.alert.pkMethodId = contact.pkMethodId;
                this.alert.mediaVal = contact.mediaVal;
             }
             this.IsWait=false;
           },
            error => {console.log(error); this.IsWait=false;}
         );
      }
  }

  getContactList(){
    this.alert.mediaVal = '';
    if(this.alert.pkGuardianId == 0){
       this.alert.pkMethodId = 0;
       this.contactList = [];
    }
    else{
      this.IsWait=true;    
      this.contactService.getContactListByGuardianId(this.alert.pkGuardianId)
         .subscribe(
           data => {
             console.log(data);
             console.log(JSON.stringify(data));
             const newContactBean: ContactBean = new ContactBean();
             newContactBean.pkContactId = 0;
             newContactBean.contactMethod = "Select a Method";
             this.contactList = data;
             if(this.contactList.length > 1){
              this.contactList.unshift(JSON.parse(JSON.stringify(newContactBean)));
             }
             if(this.contactList.length == 1){
                let contact: ContactBean = this.contactList[0];
                this.alert.pkMethodId = contact.pkMethodId;
                this.alert.mediaVal = contact.mediaVal;
             }
          
             this.IsWait=false;

         
           },
           error => {console.log(error); this.IsWait=false;}
         );
    }  
  }

  getMediaValue(){
    if(this.alert.pkMethodId == 0){
      this.alert.mediaVal = '';
    }
    if(this.contactList.length > 0){
       let contact: ContactBean = this.contactList.filter(i => i.pkMethodId === Number(this.alert.pkMethodId))[0];
       this.alert.mediaVal = contact.mediaVal;
    }
   }

  getMethodList(){
    this.IsWait=true;
    this.alertService.getMethodList()
         .subscribe(
           data => {
             console.log(data);
             console.log(JSON.stringify(data));
             const newMethodBean: MethodBean = new MethodBean();
             newMethodBean.pkMethodId = 0;
             newMethodBean.contactMethod = "Select a Method";
             this.methodList = data;
             this.methodList.unshift(JSON.parse(JSON.stringify(newMethodBean)));
             this.IsWait=false;
         
           },
           error => {console.log(error); this.IsWait=false;}
         );
  }

  getRepeatDaysList(){
    for (let i = 1; i <= 60; i++) {
      this.repeatDaysList.push({"label":i,"value":i});
    }
    this.repeatDaysList.unshift({"label":"Select a Repeat Days","value":0});
  }

  saveAlert(){

    this.alertService.saveAlert(this.alert)
    .subscribe((data: AlertBean) => {
      console.log(data);
      if(data.errorMessage){
         this.hideErrorMessage = false;
         this.hideMessage = true;
         this.errorMessage = data.errorMessage;
      }
      else{
         this.alert.alerttime = moment(data.alerttime, ["h:mm:ss a"]).format(this.timefmt);
         this.hideErrorMessage = true;      
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
   this.searchAlertBean.pkClsnmId = this.alert.pkClsnmId;
   this.searchAlertBean.pkAssignmentId = this.alert.pkAssignmentId;
  //  this.alertService.getAlertList()
   this.alertService.searchAlertList(this.searchAlertBean)
        .subscribe(
          (data: AlertBean[]) => {
            console.log(data);
            console.log(JSON.stringify(data));
            this.rowData = data;
            this.IsWait=false;
          },
          error => {console.log(error); this.IsWait=false;}
        );
  }

  updateAlert(){
   // this.alert.alertEndDateTime = this.alertEndDatetime.toLocaleString();
    this.alertService.updateAlert(this.alert.pkAlertId,this.alert)
     .subscribe((data: AlertBean) => {
       console.log(data);
       if(data.errorMessage){
          this.hideErrorMessage = false;
          this.hideMessage = true;
          this.alert.errorMessage = data.errorMessage;
          this.errorMessage = data.errorMessage;
       }
       else{
          this.hideErrorMessage = true;      
          this.alert.message = data.message;
          this.message = data.message;
          this.hideMessage = false;
          let pkClsnmId = this.alert.pkClsnmId;
          let pkAssignmentId = this.alert.pkAssignmentId;
          this.alert.pkClsnmId = 0;
          this.alert.pkAssignmentId = 0;
          this.reloadData();
          this.alert.pkClsnmId = pkClsnmId;
          this.alert.pkAssignmentId = pkAssignmentId;
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

  getStartDateTime(event: any){
    
    this.alert.alertStartDateTime = this.datePipe.transform(event.value,this.fmt);
    this.calculateEndTime();
    // if(this.alert.repeatDays > 0){
    //    this.alert.alertEndDateTime = moment(this.alert.alertStartDateTime, 'MM/DD/YYYY h:mm:ss a').toDate();
    //    this.alert.alertEndDateTime.setDate(this.alert.alertEndDateTime.getDate() + Number(this.alert.repeatDays));
    //    this.alertEndDatetime = moment(this.alert.alertEndDateTime, 'MM/DD/YYYY h:mm:ss a').toDate();  
    // }
    console.log(this.alert.alertStartDateTime);
  }

  calculateEndTime(){
    if(this.alert.repeatDays > 0){
      this.alert.alertEndDateTime = moment(this.alert.alertStartDateTime, 'MM/DD/YYYY h:mm:ss a').toDate();
      this.alert.alertEndDateTime.setDate(this.alert.alertEndDateTime.getDate() + Number(this.alert.repeatDays));
      this.alertEndDatetime = moment(this.alert.alertEndDateTime, 'MM/DD/YYYY h:mm:ss a').toDate();  
      this.alert.alertEndDateTime = moment(this.alertEndDatetime).format('MM/DD/YYYY h:mm:ss a');
    }
  }

  getEndDateTime(event: any){
    this.alert.alertEndDateTime = this.datePipe.transform(event.value,this.fmt);
    let endDate: Date = moment(this.alert.alertEndDateTime, 'MM/DD/YYYY h:mm:ss a').toDate();
    this.alert.alertStartDateTime = moment(this.alert.alertStartDateTime, 'MM/DD/YYYY h:mm:ss a').toDate();
    let differenceInTime = this.alertEndDatetime.getTime() - this.alert.alertStartDateTime.getTime();
    // To calculate the no. of days between two dates
    this.alert.repeatDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
     console.log(this.alert.alertEndDateTime);
  }

  getAlertTime(event: any){
    this.alert.alerttime = this.datePipe.transform(event.value,this.timefmt);
    console.log(this.alert.alerttime);
  }


  onSubmit(): void{
   /*  this.alert.alertStartDateTime = moment(this.alert.alertStartDateTime).format(this.fmt);
    this.alert.alertEndDateTime = moment(this.alert.alertEndDateTime).format(this.fmt);
    this.alert.alerttime = moment(this.alert.alerttime, [this.timefmt]).format(this.timefmt); */
    this.alert.alerttime = this.datePipe.transform(this.alertTime,this.timefmt);
      if(this.isUpdate){
          this.updateAlert();
      }
      else{
          this.saveAlert();
      }
  }

  deleteAlert(id: number){
    this.IsWait=true;
    this.alertService.deleteAlert(id)
      .subscribe(
        data => {
          console.log(data);
         
            this.hideErrorMessage = true;      
            this.message = data;
            this.hideMessage = false;
            this.reloadData();
        
        },
        error => { 
          console.log(error)
          this.hideErrorMessage = false;
          this.hideMessage = true;
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
              this.alert.pkAlertId = e.data.pkAlertId;
              this.alert.pkClsnmId = e.data.pkClsnmId;
              this.alert.pkAssignmentId = e.data.pkAssignmentId;
              this.alert.pkGuardianId = e.data.pkGuardianId;
              this.alert.pkContactId = e.data.pkContactId;
              this.alert.pkMethodId = e.data.pkMethodId;
              this.alert.guardianName = e.data.guardianName;
              this.alert.assignmentBean = e.data.assignmentBean;
              this.alert.mediaVal = e.data.mediaVal;
             /*  this.alert.AlertStartDateTime = new Date(e.data.AlertStartDateTime);
              this.alert.AlertStartDateTime = this.addDays(this.alert.AlertStartDateTime,-1);  */
             /*  this.localCompleteDate = this.completeDate.toISOString();
              this.localCompleteDate = this.localCompleteDate.substring(0, this.localCompleteDate.length - 1); */
             /*               this.alert.AlertEndDateTime = new Date(e.data.AlertEndDateTime);
              this.alert.AlertEndDateTime = this.addDays(e.data.AlertEndDateTime,-1); */
             
              this.alert.alertStartDateTime = e.data.alertStartDateTime;
              this.alertStartDatetime = moment(e.data.alertStartDateTime, 'MM/DD/YYYY h:mm:ss a').toDate();  
              this.alert.alertEndDateTime = e.data.alertEndDateTime;
              this.alertEndDatetime = moment(e.data.alertEndDateTime, 'MM/DD/YYYY h:mm:ss a').toDate();  
              this.alert.alerttime =  moment(e.data.alerttime, this.timefmt);
              this.alertTime = moment(e.data.alerttime, 'h:mm:ss a').toDate();  
   //           this.alertTime = new Date('1968-11-16T11:23:34');
    //          this.alert.alerttime = moment(e.data.alerttime, [this.timefmt]).format(this.timefmt);
              this.alert.repeatDays = e.data.repeatDays; 
              this.alert.alertMessage = e.data.alertMessage;
              this.alert.alertSubject = e.data.alertSubject;
              this.alert.alertedStatus = e.data.alertedStatus;
              this.alert.errorMessage= "";
              this.alert.message="";
              this.hideErrorMessage = true;
              this.hideMessage = true;
              this.getShowDueDate(e.data.pkAssignmentId);
              break;
            }
        case "delete":
            { 
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '490px',
                height: "160px",
                panelClass: 'mat-dialog-container',
                data: "Do you confirm the deletion of the Alert with Alert Id " + e.data.pkAlertId + " for Assignment  " + e.data.assignmentBean.assignmenttype +" ?"
              });
              dialogRef.afterClosed().subscribe(result => {
                if(result) {
                  console.log('Yes clicked');
                  // DO SOMETHING
                  this.deleteAlert(e.data.pkAlertId);
                }
              });
              break;
            }
      }
    }
  }
  
  cancel(){
    /*   this.isFromCancel = true;  */
      this.alert = new AlertBean();
      this.isUpdate = false;
      this.hideErrorMessage = true;
      this.hideMessage = true;
      this.alertStartDatetime = null;
      this.alertEndDatetime = null;
      this.alertTime = null;
      this.isStudentNotification = 'No';
      this.contactList = [];
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

    selectClassHandler(event: any){
      this.searchassignmentBean.pkClsnmId = event.target.value;
      this.getAssignmentList();
      this.reloadData();
    }

    selectAssignmentHandler(event: any){
     // this.showDueDate = this.assignmentList.find(x=>x.pkAssignmentId == event.target.value).dueDate;
      this.getShowDueDate(event.target.value);
      this.reloadData();
    }

    getShowDueDate(assignmentId: any){
      this.showDueDate = this.assignmentList.find(x=>x.pkAssignmentId == assignmentId).dueDate;
    }

    myBrowser() { 
      if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) {
          return 'Opera';
      }else if(navigator.userAgent.indexOf("Chrome") != -1 ){
          return 'Chrome';
      }else if(navigator.userAgent.indexOf("Safari") != -1){
          return 'Safari';
      }else if(navigator.userAgent.indexOf("Firefox") != -1 ) {
           return 'Firefox';
      }else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.DOCUMENT_NODE == true )){
        return 'IE'; 
      } else {
         return 'unknown';
      }
  }

}

export const DateTimeValidator = (fc: FormControl) => {
  const date = new Date(fc.value);
  const isValid = !isNaN(date.valueOf());
  return isValid ? null : {
      isValid: {
          valid: false
      }
  };
};
