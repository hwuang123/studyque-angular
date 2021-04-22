import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ShareService } from './../../services/share.service';
import { AlertService } from './../../services/alert.service';
import { ContactService } from './../../services/contact.service';
import { ContactBean } from './../../domains/contact-bean.bean';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { AddContactComponent } from './../../modal/add-contact/add-contact.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactBean: ContactBean =  new ContactBean();
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('f') classForm: NgForm;
  hideErrorMessage: boolean = true;
  errorMessage: string = "";
  message: string = "";
  source = {
    dataType: "json",
    datafields:[
      { name: 'pkContactId', type: 'int' },
      { name: 'pkMethodId', type: 'int' },
      { name: 'pkGuardianId', type: 'int' },
      { name: 'pkStudentId', type: 'int' },
      { name: 'firstName', type: 'string' },
      { name: 'lastName', type: 'string' },  
      { name: 'mediaVal', type: 'string' },      
      { name: 'email', type: 'string' },    
      { name: 'phone', type: 'string' },    
      { name: 'relationship', type: 'string' }, 
      { name: 'isStudentContact', type: 'string' },
      { name: 'errorMessage', type: 'string' },
      { name: 'message', type: 'string' }
  ],
    id: "pkContactId",
    async: false,
    localdata: null
  };

  dataAdapter = new jqx.dataAdapter(this.source);
columns: any[] = [
  {
        text: '#', sortable: false, filterable: false, editable: false,
        groupable: false, draggable: false, resizable: false,
        datafield: '', columntype: 'number', width: 50,
        cellsrenderer: function (row, column, value) {
            return "<div style='margin:4px;'>" + (value + 1) + "</div>";
        }
  },
  { text: 'First Name', datafield: 'firstName', width: 150 },
  { text: 'Last Name', datafield: 'lastName', width: 150 },
  { text: 'Email', datafield: 'email', width: 200 },
  { text: 'Cell Phone', datafield: 'phone', width: 200 },
  { text: 'Relationship', datafield: 'relationship', width: 100 },
  { text: 'Is for Student Contact?', datafield: 'isStudentContact', width: 200 },
  {
      text: 'Edit',
      datafield: 'Edit',
      width: 50,
      cellsalign: 'center',
      columntype: 'button',
      filterable: false,
      sortable: false,
      menu: false,
      cellclassname: (row) => {
        const draw = this.myGrid.getrowdata(row);
         let result = 'jqx-custom-button jqx-custom-button-green';
     /*   if (draw.FormattedStatus === 'In Progress') {
          result += ' jqx-custom-button-disable';
        } */
     
        return result;
      },
      cellsrenderer: () => {
        return 'Edit';
      },
 
      buttonclick: (row) => {
       this.onEditClick(row);
      }
    },//Edit
    {
      text: 'Delete',
      datafield: 'Delete',
      width: 50,
      cellsalign: 'center',
      columntype: 'button',
      filterable: false,
      sortable: false,
      menu: false,
      cellclassname: (row) => {
        const draw = this.myGrid.getrowdata(row);
         let result = 'jqx-custom-button jqx-custom-button-green';
     /*   if (draw.FormattedStatus === 'In Progress') {
          result += ' jqx-custom-button-disable';
        } */
     //   let result = 'mybtn';
        return result;
      },
      cellsrenderer: () => {
        return 'Delete';
      },
      buttonclick: (row) => {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '510px',
          height: "180px",
          panelClass: 'mat-dialog-container',
          data: "Do you confirm the deletion of the Contact for " + this.myGrid.getrowdata(row).mediaVal +" ?"
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result) {
            console.log('Yes clicked');
            // DO SOMETHING
            this.onDeleteClick(row);
          }
        });
       
      }
    }
];

nestedGrids: any[] = new Array();
nestedGridContainer: any;
initRowDetails = (index: number, parentElement: any, gridElement: any, record: any): void => {
        let id = record.uid.toString();
        this.nestedGridContainer = parentElement.children[0];
        this.nestedGrids[index] = this.nestedGridContainer;
        this.getAlertListById(this.nestedGridContainer,id);
 
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


  constructor(private shareService: ShareService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private contactService: ContactService,
    private alertService: AlertService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.myGrid.theme('energyblue');
    this.getData();
  }

  getData() {
    this.myGrid.showloadelement();
    this.contactService.getContactList()
        .subscribe(
          (data) => {
            this.source.localdata = data;
            this.myGrid.updatebounddata();
            this.hideErrorMessage= true;
          //  this.errorMessage = "";
            this.message = "Get Contact List Successfully !";
            this.myGrid.hideloadelement();
          },
          err =>{ 
            console.log(err);
            this.hideErrorMessage = false;
            this.message="";
            this.errorMessage = err.message;
            this.myGrid.hideloadelement();       
          }
        );//End of subscribe()
  };//End of getData()

  getWidth() : any {
    if (document.body.offsetWidth < 1170) {
      return '90%';
    }
    
    return 1170;
  }

  onEditClick(row){
    this.contactBean.pkContactId = this.myGrid.getrowdata(row).pkContactId;
    this.contactBean.pkMethodId = this.myGrid.getrowdata(row).pkMethodId;
    this.contactBean.pkGuardianId = this.myGrid.getrowdata(row).pkGuardianId;
    this.contactBean.pkStudentId = this.myGrid.getrowdata(row).pkStudentId;   
    this.contactBean.firstName = this.myGrid.getrowdata(row).firstName; 
    this.contactBean.lastName = this.myGrid.getrowdata(row).lastName; 
    this.contactBean.mediaVal = this.myGrid.getrowdata(row).mediaVal; 
    this.contactBean.email = this.myGrid.getrowdata(row).email; 
    this.contactBean.phone = this.myGrid.getrowdata(row).phone;
    this.contactBean.relationship = this.myGrid.getrowdata(row).relationship;
    this.contactBean.isStudentContact = this.myGrid.getrowdata(row).isStudentContact;
    this.popupMethodModal();
  }

  onDeleteClick(row){
    this.contactBean.pkContactId = this.myGrid.getrowdata(row).pkContactId;
    this.contactService.deleteContact(this.contactBean.pkContactId).subscribe((res) => {
        if (res) {
          this.message = "";
          this.hideErrorMessage = false;
          this.errorMessage = res;
          console.log(this.errorMessage);
        }
        else{
          this.errorMessage = "";
          this.hideErrorMessage = true;
          this.message = "Contact with ID: "+ this.contactBean.pkContactId + " has been deleted."; 
         }
        this.getData();
      },
      err =>{ 
          console.log(err);
          this.hideErrorMessage = false;
          this.errorMessage = err.message;        
      });
  }
  
  popupMethodModal(){
    const modalRef = this.modalService.open(AddContactComponent, {
      scrollable: true,
     //windowClass: 'md-Class',
     // keyboard: false,
     // backdrop: 'static'
      // size: 'xl',
       windowClass: 'modal-xxl', 
       size: 'lg'
    });
   modalRef.componentInstance.fromParent = this.contactBean;
   modalRef.result.then(
       result => {
           this.getData();
           console.log(result);
       },
       reason => {}
   );
  }

  onBtnClickCreateContact(e){
  //   let pkStudentId = this.contactBean.pkStudentId;
   //  this.contactBean = new ContactBean();
     this.contactBean.isStudentContact = "No";
     this.contactBean.mediaVal = "";
     this.contactBean.phone = "";
     this.contactBean.email = "";
     this.contactBean.pkContactId = 0;
     this.contactBean.pkMethodId = 0;
     this.contactBean.pkGuardianId = 0;
     this.contactBean.firstName = this.shareService.userName;
     this.contactBean.lastName = "";
     this.errorMessage="";
 //    this.contactBean.pkStudentId = pkStudentId;
     this.popupMethodModal();
   }

   getAlertListById(nestedGridContainer: any,pkContactId: number) {

    let secondSource = {
      dataType: "json",
      datafields: [
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
      ],
      id: "pkAlertId",
      async: false,
      localdata: null
    };
    let secondLevelAdapter = new jqx.dataAdapter(secondSource);

    this.alertService.getAlertListByContactId(pkContactId)
     .subscribe(
       data => {
         console.log(JSON.stringify(data));
         secondSource.localdata = data;
         if (nestedGridContainer != null) {
          let settings = {
              width: 1060,
              height: 200,
              columnsresize : true,
              source: secondLevelAdapter, 
          //    autowidth: true,
              columns: [
                  { text: 'Class Name', datafield: 'classname', width: 150 },
                  { text: 'Assignment', datafield: 'assignmenttype', width: 150 },
                  { text: 'Guardian', datafield: 'guardianName', width: 200 },
                  { text: 'Notify With', datafield: 'mediaVal', width: 200 },                 
                  { text: 'Notification Time', datafield: 'alerttime', width: 200, cellsformat: 'MM/dd/yyyy h:mm:ss tt' },
                  { text: 'Notification Start Time', datafield: 'alertStartDateTime', width: 200, cellsformat: 'MM/dd/yyyy h:mm:ss tt' },
                  { text: 'Notification End Time', datafield: 'alertEndDateTime', width: 200, cellsformat: 'MM/dd/yyyy h:mm:ss tt' },
                  { text: 'Days of Alert', datafield: 'repeatDays', width: 100 },
                  { text: 'Alert Message', datafield: 'alertMessage', width: 200 }
                  
              ]
          };
          jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
         }//if
        },
        error => {console.log(error); }
      );
  } //getAlertListById
}//End of class
