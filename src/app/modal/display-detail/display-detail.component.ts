import { Component, OnInit, ViewEncapsulation , EventEmitter, Output, LOCALE_ID, Inject, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { FormBuilder, NgForm, Validators, FormGroup, FormArray } from '@angular/forms';
import { Observable, BehaviorSubject, ReplaySubject, combineLatest, merge, of  } from "rxjs";
import 'jquery-ui';
import * as $ from 'jquery';
import 'jqueryui';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { UserBean } from './../../domains/user-bean.bean';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ShareService } from './../../services/share.service';
import { CommonFunctionService } from './../../shared/common-function.service';
import { ButtonRendererComponent } from 'src/app/shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { AdminService } from './../../services/admin.service';
import { AlertService } from './../../services/alert.service';
import { AddClassService } from 'src/app/services/add-class.service';
import { GuardianService } from './../../services/guardian.service';
import { AssignmentService } from './../../services/assignment.service';
import { ContactService } from './../../services/contact.service';
import { ContactBean } from './../../domains/contact-bean.bean';

@Component({
  selector: 'app-display-detail',
  templateUrl: './display-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./display-detail.component.css']
})
export class DisplayDetailComponent implements OnInit {
  hideSucceed = true;
  hideError = true;
  hideErrorMessage = true;
  errorMessage = "";
  message = "";
  isUpdate = false;
  isFromCancel = false;
  IsWait=false;
  rowdetails=false;
  userBean: UserBean =  new UserBean();
  displayOptions: any[];
  selectDetailType: any="";
  gridWidth:number = 1000;
  targetItem: any = "/manageuser";
  expandRows: boolean[];
  nestedGrids: any[] = new Array();
  nestedGridContainer: any;
  @Input() fromParent: any; 
  @Input() detailType: any; 
  @ViewChild('myGrid') myGrid: jqxGridComponent;

  source: any = {
    localdata: null,
    datafields: [],
    id: "pkStudentId",
    datatype: 'json'
};
dataAdapter: any;
renderer = (row: number, column: any, value: string): string => {
  return '<span style="margin-left: 4px; margin-top: 9px; float: left;">' + value + '</span>';
}
columns: any[];
initRowDetails = (index: number, parentElement: any, gridElement: any, record: any): void => {

  if(parentElement)
   {
    let id = record.uid.toString();
    this.nestedGridContainer = parentElement.children[0];
    this.nestedGrids[index] = this.nestedGridContainer;
    this.rowDetails(id);
   }
  
  }

rowdetailstemplate: any = {
  rowdetails: '<div id="nestedGrid" style="margin: 10px;"></div>', rowdetailsheight: 220, rowdetailshidden: true
};

ready = (): void => {
  this.myGrid.showrowdetails(1);
  let data = this.myGrid.getrows();
 /*  for (var i = 0; i < data.length; i++) {
          this.expandRows.push(false);
      }; */
};

  constructor(@Inject(LOCALE_ID) private locale: string,
  private route: ActivatedRoute,
  public dialog: MatDialog,
  private modalService: NgbModal,
  private adminService: AdminService,
  private router: Router, 
  public activeModal: NgbActiveModal,
  private shareService: ShareService,
  private alertService: AlertService,
  private addClassService: AddClassService,
  private guardianService: GuardianService,
  private assignmentService: AssignmentService,
  private contactService: ContactService,
  private commonFunctionService: CommonFunctionService) { }

  ngOnInit(): void {
    this.userBean = this.fromParent;
    this.displayOptions = this.shareService.displayOptios;
    this.hideSucceed = true;
    this.hideError = true;
    this.IsWait = false;
    this.nestedGrids = new Array();
//    this.cancel();
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
  
  getWidth() : any {
    if (document.body.offsetWidth < this.gridWidth) {
      return '90%';
    }
     return this.gridWidth;
  }

  onDetailTypeChanged(){
    this.rowdetails = false;
    switch(this.selectDetailType) {
      case "Alert": {
        this.displayAlert();
        break;
      }
      case "Assignment": {
        this.displayAssignment();
        break;
      }
      case "Classes": {
        this.rowdetails = true;
        this.displayClasses();
        break;
      }
      case "Contact": {
        this.displayContact();
        break;
      }
      case "Guardian": {
        this.displayGuardian();
        break;
      }
      default: {
        console.log("Invalid choice");
        break;
     }

    }
  }

  displayAlert(){
    this.gridWidth = 1200;
    this.source.datafields =  [
      { name: 'pkAlertId', type: 'int' },
      { name: 'pkAssignmentId', type: 'int' },
      { name: 'pkGuardianId', type: 'int' },
      { name: 'pkContactId', type: 'int' },
      { name: 'pkMethodId', type: 'int' },
      { name: 'classname', map: 'assignmentBean>classname',type: 'string' },
      { name: 'assignmenttype', map: 'assignmentBean>assignmenttype', type: 'string' },
      { name: 'guardianName', type: 'string' },
      { name: 'mediaVal', type: 'string' },
      { name: 'alerttime', type: 'date' },
      { name: 'alertStartDateTime', type: 'date' },
      { name: 'alertEndDateTime', type: 'date' },
      { name: 'repeatDays', type: 'int' },
      { name: 'alertMessage', type: 'string' }
    ];

    this.columns = [
      { text: 'Class Name', datafield: 'classname', width: 150 },
      { text: 'Assignment', datafield: 'assignmenttype', width: 150 },
      { text: 'Guardian', datafield: 'guardianName', width: 200 },
      { text: 'Notify With', datafield: 'mediaVal', width: 200 },                 
      { text: 'Notification Time', datafield: 'alerttime', width: 200, cellsformat: 'MM/dd/yyyy h:mm:ss tt' },
      { text: 'Notification Start Time', datafield: 'alertStartDateTime', width: 200, cellsformat: 'MM/dd/yyyy h:mm:ss tt' },
      { text: 'Notification End Time', datafield: 'alertEndDateTime', width: 200, cellsformat: 'MM/dd/yyyy h:mm:ss tt' },
      { text: 'Days of Alert', datafield: 'repeatDays', width: 100 },
      { text: 'Alert Message', datafield: 'alertMessage', width: 200 }
    ];
    this.dataAdapter = new jqx.dataAdapter(this.source);
    this.alertService.getAlertListByStudentId(this.userBean.pkStudentId).subscribe(
      data => {
               console.log(JSON.stringify(data));
               this.source.localdata = data;
               this.myGrid.updatebounddata();
               this.hideErrorMessage= true;
               this.errorMessage = "";
               this.message = "Get Alert List Successfully !";
               this.myGrid.hideloadelement();
       },
       error => {
         console.log(error);
         this.hideErrorMessage = false;
         this.message="";
         this.errorMessage = error.message;
         this.myGrid.hideloadelement();        
      }
     );
  }//displayAlert

  displayAssignment(){
    this.gridWidth = 900;
    this.source.datafields = [
      { name: 'pkAssignmentId', type: 'int' },
      { name: 'classname', type: 'string' },
      { name: 'assignmenttype', type: 'string' },
      { name: 'dueDate', type: 'date' },
      { name: 'description', type: 'string' },
      { name: 'dueDayofweek', type: 'string' }
  ];

    this.columns = [
      { text: 'Class Name', datafield: 'classname', width: 200 },
      { text: 'Assignment Type', datafield: 'assignmenttype', width: 200 },
      { text: 'Due Date', datafield: 'dueDate', width: 150, cellsformat: 'MM/dd/yyyy' },
      { text: 'Description', datafield: 'description', width: 250 },
      { text: 'Due Day of Week', datafield: 'dueDayofweek', width: 200 }
  ];
    this.dataAdapter = new jqx.dataAdapter(this.source);
    this.assignmentService.getAssignmentListByStudentId(this.userBean.pkStudentId).subscribe(
      data => {
               console.log(JSON.stringify(data));
               this.source.localdata = data;
               this.myGrid.updatebounddata();
               this.hideErrorMessage= true;
               this.errorMessage = "";
               this.message = "Get Assignnment List Successfully !";
               this.myGrid.hideloadelement();
       },
       error => {
         console.log(error);
         this.hideErrorMessage = false;
         this.message="";
         this.errorMessage = error.message;
         this.myGrid.hideloadelement();        
      }
     );
  }//displayAssignment

  displayClasses(){
    this.gridWidth = 1000;
    this.source.datafields = [
      { name: 'pkClsnmId', type: 'int' },
      { name: 'classname', type: 'string' },
      { name: 'classtype', type: 'string' },
      { name: 'instructor', type: 'string' },
      { name: 'semStartDate', type: 'date' },
      { name: 'semEndDate', type: 'date' }
  ];
  this.source.id = "pkClsnmId";
    this.columns = [
      { text: 'ID', datafield: 'pkClsnmId', width: 150 },
      { text: 'Class Name', datafield: 'classname', width: 200 },
      { text: 'Class Type', datafield: 'classtype', width: 150 },
      { text: 'Instructor', datafield: 'instructor', width: 200 },
      { text: 'Start Date', datafield: 'semStartDate', width: 150, cellsformat: 'MM/dd/yyyy' },
      { text: 'End Date', datafield: 'semEndDate', width: 150, cellsformat: 'MM/dd/yyyy' }
  ];
    this.dataAdapter = new jqx.dataAdapter(this.source);
    this.addClassService.getClassnamesByStudentId(this.userBean.pkStudentId).subscribe(
      data => {
               console.log(JSON.stringify(data));
               this.source.localdata = data;
               this.myGrid.updatebounddata();
               this.hideErrorMessage= true;
               this.errorMessage = "";
               this.message = "Get Classes List Successfully !";
               this.myGrid.hideloadelement();
       },
       error => {
         console.log(error);
         this.hideErrorMessage = false;
         this.message="";
         this.errorMessage = error.message;
         this.myGrid.hideloadelement();        
      }
     );
  }//displayClasses

  displayContact(){
   // let tdata = [{"pkContactId":3,"pkMethodId":2,"pkGuardianId":1,"pkStudentId":1,"firstName":"Steve","lastName":"Hwuang","mediaVal":"0987654321","relationship":"Parent","isStudentContact":"No","errorMessage":null,"message":null},{"pkContactId":5,"pkMethodId":2,"pkGuardianId":0,"pkStudentId":1,"firstName":"Steve","lastName":"Hwuang","mediaVal":"1234567890","relationship":null,"isStudentContact":"Yes","errorMessage":null,"message":null},{"pkContactId":11,"pkMethodId":1,"pkGuardianId":4,"pkStudentId":1,"firstName":"Sharon","lastName":"Hwuag","mediaVal":"9737843642","relationship":"Parent","isStudentContact":"No","errorMessage":null,"message":null},{"pkContactId":1,"pkMethodId":3,"pkGuardianId":1,"pkStudentId":1,"firstName":"Steve","lastName":"Hwuang","mediaVal":"hwuang13@gmail.com","relationship":"Parent","isStudentContact":"No","errorMessage":null,"message":null},{"pkContactId":2,"pkMethodId":1,"pkGuardianId":1,"pkStudentId":1,"firstName":"Steve","lastName":"Hwuang","mediaVal":"1234567890","relationship":"Parent","isStudentContact":"No","errorMessage":null,"message":null},{"pkContactId":4,"pkMethodId":3,"pkGuardianId":0,"pkStudentId":1,"firstName":"Steve","lastName":"Hwuang","mediaVal":"hwuang@aim.com","relationship":null,"isStudentContact":"Yes","errorMessage":null,"message":null}];
    this.displayClasses();
    this.gridWidth = 960;
    this.source.datafields = [
      { name: 'pkContactId', type: 'int' },
      { name: 'pkMethodId', type: 'int' },
      { name: 'pkGuardianId', type: 'int' },
      { name: 'pkStudentId', type: 'int' },
      { name: 'firstName', type: 'string' },
      { name: 'lastName', type: 'string' },    
      { name: 'email', type: 'string' },    
      { name: 'phone', type: 'string' },    
      { name: 'relationship', type: 'string' }, 
      { name: 'isStudentContact', type: 'string' },
      { name: 'errorMessage', type: 'string' },
      { name: 'message', type: 'string' }
  ];
    this.columns = [
      { text: 'First Name', datafield: 'firstName', width: 150 },
      { text: 'Last Name', datafield: 'lastName', width: 150 },
      { text: 'Email', datafield: 'email', width: 200 },
      { text: 'Cell Phone', datafield: 'phone', width: 200 },
      { text: 'Relationship', datafield: 'relationship', width: 100 },
      { text: 'Is for Student Contact?', datafield: 'isStudentContact', width: 200 }
  ];
    this.dataAdapter = new jqx.dataAdapter(this.source);
    this.contactService.getContactListByStudentId(this.userBean.pkStudentId).subscribe(
      data => {
               console.log(JSON.stringify(data));
               this.source.localdata = data;
               this.myGrid.updatebounddata();
               this.hideErrorMessage= true;
               this.errorMessage = "";
               this.message = "Get Contact List Successfully !";
               this.myGrid.hideloadelement();
       },
       error => {
         console.log(error);
         this.hideErrorMessage = false;
         this.message="";
         this.errorMessage = error.message;
         this.myGrid.hideloadelement();        
      }
     );
  }//displayContact

  displayGuardian(){
    this.gridWidth = 1200;
    this.source.datafields = [
      { name: 'guardianId', type: 'int' },
      { name: 'addressId', type: 'int' },
      { name: 'firstName', type: 'string' },
      { name: 'middleName', type: 'string' },   
      { name: 'lastName', type: 'string' },        
      { name: 'gender', type: 'string' }, 
      { name: 'age', type: 'int' }, 
      { name: 'relationship', type: 'string' },  
      { name: 'city', type: 'string' },  
      { name: 'state', type: 'string' },    
      { name: 'zip', type: 'string' }, 
      { name: 'address', type: 'string' },      
      { name: 'addressSameAsStudent', type: 'string' }
  ];

    this.columns = [
      { text: 'First Name', datafield: 'firstName', width: 150 },
      { text: 'Last Name', datafield: 'lastName', width: 150 },
      { text: 'Gender', datafield: 'gender', width: 60 },
      { text: 'Age', datafield: 'age', width: 40 },
      { text: 'Relationship', datafield: 'relationship', width: 100 },
      { text: 'City', datafield: 'city', width: 200 },
      { text: 'State', datafield: 'state', width: 100 },
      { text: 'Zip', datafield: 'zip', width: 50 },
      { text: 'Address', datafield: 'address', width: 200},
      { text: 'Address Same As Student', datafield: 'addressSameAsStudent', width: 200 },
  ];
    this.dataAdapter = new jqx.dataAdapter(this.source);
    this.guardianService.getGuardianListByStudentId(this.userBean.pkStudentId).subscribe(
      data => {
               console.log(JSON.stringify(data));
               this.source.localdata = data;
               this.myGrid.updatebounddata();
               this.hideErrorMessage= true;
               this.errorMessage = "";
               this.message = "Get Guardian List Successfully !";
               this.myGrid.hideloadelement();
       },
       error => {
         console.log(error);
         this.hideErrorMessage = false;
         this.message="";
         this.errorMessage = error.message;
         this.myGrid.hideloadelement();        
      }
     );
  }//displayGuardian

 rowDetails(id): void {
 
  let secondSource = {
      dataType: "json",
      datafields: [
        { name: 'pkAssignmentId', type: 'int' },
        { name: 'classname', type: 'string' },
        { name: 'assignmenttype', type: 'string' },
        { name: 'dueDate', type: 'date' },
        { name: 'description', type: 'string' },
        { name: 'dueDayofweek', type: 'string' }
      ],
      id: "pkStudentId",
      async: false,
      localdata: null
    };
    let secondLevelAdapter = new jqx.dataAdapter(secondSource);
    this.assignmentService.getAssignmentListByClassId(id)
     .subscribe(
       data => {
         console.log(JSON.stringify(data));
         secondSource.localdata = data;
         if (this.nestedGridContainer != null) {
          let settings = {
              width: 1000,
              height: 200,
              source: secondLevelAdapter, 
              columns: [
                { text: 'Class Name', datafield: 'classname', width: 200 },
                { text: 'Assignment Type', datafield: 'assignmenttype', width: 200 },
                { text: 'Due Date', datafield: 'dueDate', width: 150, cellsformat: 'MM/dd/yyyy' },
                { text: 'Description', datafield: 'description', width: 250 },
                { text: 'Due Day of Week', datafield: 'dueDayofweek', width: 200 }
            ]
          };
          jqwidgets.createInstance(`#${this.nestedGridContainer.id}`, 'jqxGrid', settings);
         }//if
        },
        error => {console.log(error); }
      );
    }
  
}//End of class