import { Component, OnInit, EventEmitter, Output, LOCALE_ID, Inject, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject, ReplaySubject, combineLatest, merge, of  } from "rxjs";
import { map } from 'rxjs/operators';
import 'jquery-ui';
import * as $ from 'jquery';
import 'jqueryui';
import * as moment from 'moment';
/* import * as $ from 'jquery';
import 'jqueryui'; */
import { formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions, IDatasource, IGetRowsParams, GridApi } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { FormBuilder, NgForm, Validators, FormGroup, FormArray } from '@angular/forms';
import { ShareService } from './../../services/share.service';
import { ClassdayOfWeek } from './../../domains/classday-of-week';
import { ClassScheduleService } from '../../services/class-schedule.service';
import { CommonFunctionService } from './../../shared/common-function.service';
import { Assignment } from './../../domains/assignment';
import { AssignmentType } from './../../domains/assignment-type';
import { ClassName } from './../../domains/class-name';
import { StudentBean } from './../../domains/student-bean';
import { AddClassService } from './../../services/add-class.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ButtonRendererComponent } from 'src/app/shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';

@Component({
  selector: 'app-add-class-schedule',
  templateUrl: './add-class-schedule.component.html',
  styleUrls: ['./add-class-schedule.component.css']
})
export class AddClassScheduleComponent implements OnInit {
  pkClsnmId: number;
  classdayOfWeek: ClassdayOfWeek;
  submitted = false;
  hideSucceed = true;
  hideError = true;
  errorMessage = "";
  message = "";
  isUpdate = false;
  isFromCancel = false;
  private className: ClassName;
  @ViewChild('f') classForm: NgForm;
  private gridApi;
  private gridColumnApi;
  error:any;
  IsWait=false;
  targetItem: any = "/addclasses";
  classdayOfWeeks: Observable<ClassdayOfWeek[]>;
  weekDayOptions = [];
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
  @ViewChild('scheduleForm') scheduleForm: NgForm;
  @Input() fromParent: any;  
  @Output() childClassdayOfWeekOutput = new EventEmitter<Observable<ClassdayOfWeek[]>>();

  constructor( 
              @Inject(LOCALE_ID) private locale: string,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private modalService: NgbModal,
              private addClassService: AddClassService,
              private router: Router, 
              public activeModal: NgbActiveModal,
              private shareService: ShareService,
              private classScheduleService: ClassScheduleService,
              private commonFunctionService: CommonFunctionService) { 
              this.weekDayOptions = shareService.weekDays;
              this.columnDefs = [
                {
                  headerName: '',
                  field: 'pkClsdowId',
                  hide: true
                },
                {
                  headerName: '',
                  field: 'pkClsnmId',
                  hide: true
                },
                {
                  headerName: 'Day of Week',
                  field: 'weekday',
                  cellRenderer: 'agGroupCellRenderer',
                  resizable: true 
                },
                { headerName: 'Start Time',
                  field: 'starttime',
                  resizable: true  },
                { headerName: 'End Time',
                  field: 'endtime',
                  resizable: true  },
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
    this.classdayOfWeek = new ClassdayOfWeek();
    this.pkClsnmId = this.fromParent;
    this.classdayOfWeek.pkClsnmId = this.pkClsnmId;
   /*  this.classdayOfWeek.starttime;
    this.classdayOfWeek.endtime; */
    this.hideSucceed = true;
    this.hideError = true;
    this.IsWait = false;
    this.cancel();
    this.className = new ClassName();
    this.getClassNameById();  
    
   /*  let now = new Date("25 July 2016");
   
    let hours = ("0" + now.getHours()).slice(-2);
    let minutes = ("0" + now.getMinutes()).slice(-2);
    let str = hours + ':' + minutes;
    this.classdayOfWeek.starttime = str;
    this.classdayOfWeek.endtime = str; */

    this.shareService.currentTargetItem.subscribe( targetItem => this.targetItem = targetItem);
    $(document).ready(function () {
      let modalContent: any = $('.modal-content');
     
      modalContent.draggable({
        handle: '.modal-header',
        revert: true,
        revertDuration: 1400,
      });
    });
  }

  cancel(){
    let now = new Date("25 July 2016");
   
    let hours = ("0" + now.getHours()).slice(-2);
    let minutes = ("0" + now.getMinutes()).slice(-2);
    let str = hours + ':' + minutes;
    this.classdayOfWeek.starttime = str;
    this.classdayOfWeek.endtime = str;
    this.classdayOfWeek.weekday = "";
    this.isUpdate = false;
    this.hideSucceed = true;
    this.hideError = true;
  }

  saveClassSchedule() {
    //this.spinnerOverlayService.show("Updating...");
    this.IsWait = true;
    this.classScheduleService.saveClassdayOfWeek(this.classdayOfWeek)
      .subscribe((data : ClassdayOfWeek) => {
        console.log(data);
        //this.activeModal.close();
        this.classdayOfWeeks = this.classScheduleService.getClassdayOfWeekList(data.pkClsnmId);
        this.childClassdayOfWeekOutput.emit(this.classdayOfWeeks);
       // this.employee = new Employee();
        this.message = data.message;       
        this.hideSucceed = false;
        this.hideError = true;
        this.reloadData();
        this.IsWait = false;
        //this.spinnerOverlayService.hide();
      //  this.gotoList();
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

  validateTimes(){
    let validateInfo = this.commonFunctionService.validateTimeRange(this.classdayOfWeek.starttime,this.classdayOfWeek.endtime);
    
    this.hideError = !validateInfo.error;
    this.errorMessage = validateInfo.errorMessage;
    if(this.hideError != true){
      this.scheduleForm.controls['starttime'].setErrors({ 'incorrect': true});
      this.scheduleForm.controls['endtime'].setErrors({ 'incorrect': true});
    }
    else{
      this.scheduleForm.controls['starttime'].setErrors(null);
      this.scheduleForm.controls['endtime'].setErrors(null);
    }
  
  }

getClassNameById(){
  this.addClassService.getClassNameBeanById(this.pkClsnmId)
    .subscribe((data: ClassName) => {
      this.className.classname = data.classname;
      console.log(data);
    },
     err =>{ 
       console.log(err);
       this.errorMessage = err.error.errorMessage;        
    });
}


updatClassSchedule(){

    this.classScheduleService.updateClassdayOfWeek(this.classdayOfWeek.pkClsdowId,this.classdayOfWeek)
    .subscribe((data: ClassdayOfWeek) => {
      console.log(data);
      if(data.errorMessage){
         this.hideError = false;
         this.hideSucceed = true;
         this.classdayOfWeek.errorMessage = data.errorMessage;
         this.errorMessage = data.errorMessage;
         this.IsWait = false;
      }
      else{
         this.hideError = true;      
         this.classdayOfWeek.message = data.message;
         this.message = "Succeedfully update class schedule for class " + this.className.classname + "!";
         this.hideSucceed = false;
         this.reloadData();
         this.IsWait = false;
      }
      
    },
     err =>{ 
       console.log(err);
       this.hideError = false;
       this.hideSucceed = false;
       this.errorMessage = err.error.errorMessage;        
    }
     
     ); 
     this.isUpdate = false;

}

  onSubmit() {
    if(this.isUpdate){
      this.updatClassSchedule();
   }
   else{
      this.saveClassSchedule();    
   }
  }

  onRowClicked(e: any) {
    if (e.event.target !== undefined) {
    let actionType = e.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "edit":
            {
              this.isUpdate = true; 
              this.classdayOfWeek.pkClsnmId =  e.data.pkClsnmId;
              this.classdayOfWeek.pkClsdowId =  e.data.pkClsdowId;
              this.classdayOfWeek.weekday = e.data.weekday;
              this.classdayOfWeek.starttime = moment(e.data.starttime, ["h:mm A"]).format("HH:mm");
              this.classdayOfWeek.endtime = moment(e.data.endtime, ["h:mm A"]).format("HH:mm");
              this.classdayOfWeek.errorMessage= "";
              this.classdayOfWeek.message="";
              this.hideError = true;
              this.hideSucceed = true;
              break;
            }
        case "delete":
            { 
              /* const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '490px',
                height: "160px",
                panelClass: 'mat-dialog-container',
                data: "Do you confirm the deletion of the class day of week for " + e.data.weekday +" ?"
              });
              dialogRef.afterClosed().subscribe(result => {
                if(result) {
                  console.log('Yes clicked');
                  // DO SOMETHING
                  this.classScheduleService.deleteClassdayOfWeek(e.data.pkClsdowId);
                }
              }); */
              if(confirm('Are you sure you want to delete class schedule for '+ e.data.weekday + '?')){
                this.classScheduleService.deleteClassdayOfWeek(e.data.pkClsdowId)
                .subscribe((data: any) => {
                  this.message = "Succeedfully delete class schedule for class " + this.className.classname + "!";
                   this.hideError = true;
                   this.hideSucceed = false; 
                   this.reloadData();       
                },
                 err =>{ 
                   console.log(err);
                   this.errorMessage = err.error.errorMessage;
                   this.hideError = false;
                   this.hideSucceed = true;        
                });
              }
              break;
            }
 
      }
    }
  }

  gotoList() {
    //this.router.navigate(['/employees']);
    const nextTarget = this.shareService.targetItem;
    this.router.navigate( [nextTarget]);
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
   /* this.shareService.targetItem = "/grid"; */
   this.classScheduleService.getClassdayOfWeekList(this.pkClsnmId)
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
