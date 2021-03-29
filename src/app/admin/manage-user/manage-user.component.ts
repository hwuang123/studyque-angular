import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
//import * as moment from 'moment';
import { ShareService } from './../../services/share.service';
import { AdminService } from './../../services/admin.service';
import { EditUseraccountComponent } from './../../modal/edit-useraccount/edit-useraccount.component';
import { UserBean } from './../../domains/user-bean.bean';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit, AfterViewInit  {
  userBean: UserBean =  new UserBean();
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('f') classForm: NgForm;
  hideErrorMessage: boolean = true;
  errorMessage: string = "";
  message: string = "";

  source: any = {
    localdata: null,
    datafields: [
        { name: 'pkUseraccountId', type: 'int' },
        { name: 'userName', type: 'string' },
        { name: 'pkStudentId', type: 'int' },
        { name: 'firstName', type: 'string' },
        { name: 'lastName', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'pkStatusId', type: 'int' },        
        { name: 'gender', type: 'string' },
        { name: 'age', type: 'int' },
        { name: 'major', type: 'string' },
        { name: 'schoolId', type: 'int' },
        { name: 'expiredDate', type: 'date'}
    ],
    datatype: 'json'
};

dataAdapter: any = new jqx.dataAdapter(this.source);

columns: any[] = [
  { text: 'User Name', datafield: 'userName', width: 100 },
  { text: 'First Name', datafield: 'firstName', width: 100 },
  { text: 'Last Name', datafield: 'lastName', width: 100 },
  { text: 'Gender', datafield: 'gender', width: 100 },
  { text: 'Age', datafield: 'age', width: 100 },
  { text: 'Major', datafield: 'major', width: 200 },
  { text: 'Expired Ddate', datafield: 'expiredDate', width: 100, cellsformat: 'MM/dd/yyyy' },
  { text: 'Status', datafield: 'status', width: 100 },
  {
    text: 'Change Status',
    datafield: 'Edit',
    width: 100,
    cellsalign: 'center',
    columntype: 'button', 
    filterable: false,
    sortable: false,
    menu: false,
    cellclassname: (row) => {
      const draw = this.myGrid.getrowdata(row);
       let result = 'jqx-custom-button jqx-custom-button-green';
       return result;
    },
    cellsrenderer: () => {
      return 'Edit';
    },

    buttonclick: (row) => {
      this.onEditClick(row);
     }
  }//Edit
  /* {
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
        data: "Do you confirm the deletion of the Role for " + this.myGrid.getrowdata(row).roleName +" ?"
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          console.log('Yes clicked');
          // DO SOMETHING
          this.onDeleteClick(row);
        }
      });
     
    }
  } */
];

  constructor(private shareService: ShareService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private adminService: AdminService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.myGrid.theme('energyblue');
    this.getData();
  }
   
  getData() {
    this.myGrid.showloadelement();
    this.adminService.getUserBeanList()
        .subscribe(
          (data) => {
            this.source.localdata = data;
            this.myGrid.updatebounddata();
            this.hideErrorMessage= true;
            this.errorMessage = "";
            this.message = "Get User List Successfully !";
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
    if (document.body.offsetWidth < 1000) {
      return '90%';
    }
     return 1000;
  }

  onEditClick(row){
    this.userBean.pkUseraccountId = this.myGrid.getrowdata(row).pkUseraccountId;
    this.userBean.userName = this.myGrid.getrowdata(row).userName;
    this.userBean.status = this.myGrid.getrowdata(row).status;
    this.userBean.pkStatusId = this.myGrid.getrowdata(row).pkStatusId;
    this.userBean.expiredDate = this.myGrid.getrowdata(row).expiredDate;
    this.popupRoleModal();
  }

  popupRoleModal(){
    const modalRef = this.modalService.open(EditUseraccountComponent, {
      scrollable: true,
     //windowClass: 'md-Class',
     // keyboard: false,
     // backdrop: 'static'
      // size: 'xl',
       windowClass: 'modal-xxl', 
       size: 'lg'
    });
   modalRef.componentInstance.fromParent = this.userBean;
   modalRef.result.then(
       result => {
           this.getData();
           console.log(result);
       },
       reason => {}
   );
  }

  myGridOnRowSelect(event: any): void {
    const args = event.args;
    let selectedRowIndex = args.rowindex;
    let value = this.myGrid.getrowdata(selectedRowIndex);
   }
}
