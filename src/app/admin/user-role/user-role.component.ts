import { Component, OnInit,  ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jqxListBoxComponent } from 'jqwidgets-ng/jqxlistbox';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ShareService } from './../../services/share.service';
import { AdminService } from './../../services/admin.service';
import { AddPrivilegeComponent } from './../../modal/add-privilege/add-privilege.component';
import { UserBean } from './../../domains/user-bean.bean';
import { UserRole } from './../../domains/user-role.bean';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { RoleBean } from './../../domains/role-bean';


@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.css']
})
export class UserRoleComponent implements OnInit {
  userlist: UserBean[];
  userRoleBean: UserRole = new UserRole();
  @ViewChild('listBoxA') listBoxA: jqxListBoxComponent;
  @ViewChild('listBoxB') listBoxB: jqxListBoxComponent;
  @ViewChild('f') classForm: NgForm;
  hideErrorMessage: boolean = true;
  errorMessage: string = "";
  message: string = "";
  source1: any = {
    localdata: null,
    datafields: [
        { name: 'pkUseraccountId', type: 'int' },
        { name: 'roleName', type: 'string' },
        { name: 'description', type: 'string' }
    ],
    datatype: 'json'
  };
  dataAdapter1: any = new jqx.dataAdapter(this.source1);

  source2: any = {
    localdata: null,
    id: 'id',
    datafields: [
      { name: 'pkUseraccountId', type: 'int' },
      { name: 'roleName', type: 'string' },
      { name: 'description', type: 'string' }
    ],
    datatype: 'json'
  };
  dataAdapter2: any = new jqx.dataAdapter(this.source2);

  constructor( public dialog: MatDialog,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.userRoleBean = new UserRole();
    this.getUserList();
  }

  getUserList() {
    this.adminService.getUserBeanList()
        .subscribe(
          (data: UserBean[]) => {
            this.userlist = data;
            this.hideErrorMessage= true;
            this.errorMessage = "";
            this.message = "";

          },
          err =>{ 
            console.log(err);
            this.hideErrorMessage = false;
            this.message="";
            this.errorMessage = err.message;
      
          }
        );//End of subscribe()
  };//End of getData()

  selectUserHandler(event: any){
    this.userRoleBean.pkUseraccountId = event.target.value;
    this.getUserRoles();
  }

  getUserRoles() {
    if(this.userRoleBean.pkUseraccountId == 0){
      this.cancel();
    }
    else{
      this.adminService.getUserRoles(this.userRoleBean
          ).subscribe(
          (data: UserRole) => {
            this.userRoleBean = data;
            this.refreshListBox( this.listBoxA, this.userRoleBean.roleList);
            this.refreshListBox( this.listBoxB, this.userRoleBean.selectedRoleList);
            this.hideErrorMessage= true;
            this.errorMessage = "";
            this.message = "";
   //         console.log(this.source1.localdata);
          },
          err =>{ 
            console.log(err);
            this.hideErrorMessage = false;
            this.message="";
            this.errorMessage = err.message;
          }
        );//End of subscribe()
    }
  };//End of getUserRoles

  dragEndA(event: any): void {
    let role: RoleBean = this.userRoleBean.roleList.find(e => e.pkRoleId === event.args.value);
    this.userRoleBean.roleList = this.userRoleBean.roleList.filter(e => e.pkRoleId != event.args.value);
    this.userRoleBean.selectedRoleList.push(role);
   //   this.onDragEnd(event);
  };
  
  dragEndB(event: any): void {
      let role: RoleBean = this.userRoleBean.selectedRoleList.find(e => e.pkRoleId === event.args.value);
      this.userRoleBean.selectedRoleList = this.userRoleBean.selectedRoleList.filter(e => e.pkRoleId != event.args.value);
      this.userRoleBean.roleList.push(role);
   //   this.onDragEnd(event);
  };

  cancel(){
    this.source1.localdata = [];
    this.listBoxA.refresh();
    this.source2.localdata = [];
    this.listBoxB.refresh();
    this.userRoleBean = new UserRole();
  }
 
  refreshListBox(listBox:jqxListBoxComponent, items: RoleBean[]){
    listBox.clear();
    items.forEach(e => listBox.addItem(e));
  }

  saveChange(){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '330px',
      height: "180px",
      panelClass: 'mat-dialog-container',
      data: "Do you confirm this assignment ?"});
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          console.log('Yes clicked');
          this.adminService.saveUserRoles(this.userRoleBean
            ).subscribe(
            (data: UserRole) => {

              this.hideErrorMessage= true;
              this.errorMessage = "";
              this.message = "Successfully Assign Roles to User !";
            },
            err =>{ 
              console.log(err);
              this.hideErrorMessage = false;
              this.message="";
              this.errorMessage = err.message;
            }
          );//End of subscribe()
        }
      });
 
  }

}
