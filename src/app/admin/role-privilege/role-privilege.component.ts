import { Component, OnInit,  ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jqxListBoxComponent } from 'jqwidgets-ng/jqxlistbox';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ShareService } from './../../services/share.service';
import { AdminService } from './../../services/admin.service';
import { AddPrivilegeComponent } from './../../modal/add-privilege/add-privilege.component';
import { PrivilegeBean } from './../../domains/privilege-bean';
import { RolePrivilege } from './../../domains/role-privilege.bean';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { RoleBean } from './../../domains/role-bean';

@Component({
  selector: 'app-role-privilege',
  templateUrl: './role-privilege.component.html',
  styleUrls: ['./role-privilege.component.css']
})
export class RolePrivilegeComponent implements OnInit {
  rolelist: RoleBean[];
  roleprivilegeBean: RolePrivilege = new RolePrivilege();
  @ViewChild('listBoxA') listBoxA: jqxListBoxComponent;
  @ViewChild('listBoxB') listBoxB: jqxListBoxComponent;
  @ViewChild('f') classForm: NgForm;
  hideErrorMessage: boolean = true;
  errorMessage: string = "";
  message: string = "";
  source1: any = {
    localdata: null,
    datafields: [
        { name: 'pkPrivilegeId', type: 'int' },
        { name: 'privName', type: 'string' },
        { name: 'privDesc', type: 'string' }
    ],
    datatype: 'json'
  };
  dataAdapter1: any = new jqx.dataAdapter(this.source1);

  source2: any = {
    localdata: null,
    id: 'id',
    datafields: [
      { name: 'pkPrivilegeId', type: 'int' },
      { name: 'privName', type: 'string' },
      { name: 'privDesc', type: 'string' }
    ],
    datatype: 'json'
  };
  dataAdapter2: any = new jqx.dataAdapter(this.source2);

  constructor(private shareService: ShareService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.roleprivilegeBean = new RolePrivilege();
    this.getRoleList();
  }

onDragStart(event: any): void {
  /*   this.dragStartLog.nativeElement.innerHTML = 'Drag Start: ' + event.args.label;
    this.dragEndLog.nativeElement.innerHTML = ''; */
}
onDragEnd(event: any): void {
 //   this.dragEndLog.nativeElement.innerHTML = 'Drag End';
    if (event.args.label) {
        let ev = event.args.originalEvent;
        let x = ev.pageX;
        let y = ev.pageY;
        
        if (event.args.originalEvent && event.args.originalEvent.originalEvent && event.args.originalEvent.originalEvent.touches) {
            let touch = event.args.originalEvent.originalEvent.changedTouches[0];
            x = touch.pageX;
            y = touch.pageY;
        }
       /*  let textareaElement = this.myTextArea.elementRef.nativeElement.firstElementChild;
        let width = textareaElement.offsetWidth;
        let height = textareaElement.offsetHeight;
        let right = parseInt(textareaElement.offsetLeft) + width;
        let bottom = parseInt(textareaElement.offsetTop) + height;
        
        if (x >= parseInt(textareaElement.offsetLeft) && x <= right) {
            if (y >= parseInt(textareaElement.offsetTop) && y <= bottom) {
                this.myTextArea.val(event.args.label);
            }
        } */
    }
}

  getRolePrivileges() {
    if(this.roleprivilegeBean.pkRoleId == 0){
      this.cancel();
    }
    else{
      this.adminService.getRolePrivileges(this.roleprivilegeBean
          ).subscribe(
          (data: RolePrivilege) => {
            this.roleprivilegeBean = data;
            this.source1.localdata = this.roleprivilegeBean.privilegeList;
            this.listBoxA.refresh();
            this.source2.localdata = this.roleprivilegeBean.selectedPrivilegeList;
            this.listBoxB.refresh();
            this.hideErrorMessage= true;
            this.errorMessage = "";
            this.message = "";
            console.log(this.source1.localdata);
          },
          err =>{ 
            console.log(err);
            this.hideErrorMessage = false;
            this.message="";
            this.errorMessage = err.message;
          }
        );//End of subscribe()
    }
  };//End of getRolePrivileges()

  getRoleList() {
    this.adminService.getAllRoles()
        .subscribe(
          (data) => {
            this.rolelist = data;
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

  selectRoleandler(event: any){
    this.roleprivilegeBean.pkRoleId = event.target.value;
    this.getRolePrivileges();
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
          this.adminService.saveRolePrivileges(this.roleprivilegeBean
            ).subscribe(
            (data: RolePrivilege) => {
              this.roleprivilegeBean = data;
              this.hideErrorMessage= true;
              this.errorMessage = "";
              this.message = "Successfully Assign Privileges to Role !";
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

  dragStart = (item: any): boolean => {
    if (item.label == 'Breve') {
        return false;
    }
};
dragEnd = (dragItem: any, dropItem: any): boolean => {
    if (dragItem.label == 'Frappuccino')
        return false;
};
renderer1 = (index: number, label: string, value: string): string => {
    if (label == 'Breve') {
        return '<span style="color: red;">' + label + '</span>';
    }
    return label;
};
renderer2 = (index: number, label: string, value: string): string => {
    if (label == 'Frappuccino') {
        return '<span style="color: red">' + label + '</span>';
    }
    return label;
};
// Events
dragStartA(event: any): void {
    this.onDragStart(event);
};
dragStartB(event: any): void {
    this.onDragStart(event);
};
dragEndA(event: any): void {
  let privilege: PrivilegeBean = this.roleprivilegeBean.privilegeList.find(e => e.pkPrivilegeId === event.args.value);
  this.roleprivilegeBean.privilegeList = this.roleprivilegeBean.privilegeList.filter(e => e.pkPrivilegeId != event.args.value);
  this.roleprivilegeBean.selectedPrivilegeList.push(privilege);
 //   this.onDragEnd(event);
};
dragEndB(event: any): void {
    let privilege: PrivilegeBean = this.roleprivilegeBean.selectedPrivilegeList.find(e => e.pkPrivilegeId === event.args.value);
    this.roleprivilegeBean.selectedPrivilegeList = this.roleprivilegeBean.selectedPrivilegeList.filter(e => e.pkPrivilegeId != event.args.value);
    this.roleprivilegeBean.privilegeList.push(privilege);
 //   this.onDragEnd(event);
};
 cancel(){
   this.source1.localdata = [];
   this.listBoxA.refresh();
   this.source2.localdata = [];
   this.listBoxB.refresh();
   this.roleprivilegeBean = new RolePrivilege();
 }
}
