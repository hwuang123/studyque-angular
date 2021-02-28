import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ShareService } from './../../services/share.service';
import { AdminService } from './../../services/admin.service';
import { AddRoleComponent } from './../../modal/add-role/add-role.component';
import { RoleBean } from './../../domains/role-bean';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit, AfterViewInit {
  roleBean: RoleBean =  new RoleBean();
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('f') classForm: NgForm;
  hideErrorMessage: boolean = true;
  errorMessage: string = "";
  message: string = "";

  source: any = {
    localdata: null,
    datafields: [
        { name: 'pkRoleId', type: 'int' },
        { name: 'roleName', type: 'string' },
        { name: 'description', type: 'string' }
    ],
    datatype: 'json'
};

dataAdapter: any = new jqx.dataAdapter(this.source);

columns: any[] = [
    { text: 'ID', datafield: 'pkRoleId', width: 100 },
    { text: 'Role Name', datafield: 'roleName', width: 250 },
    { text: 'Role Description', datafield: 'description', width: 250 },
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
    }
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

  sortData(column, direction) {
    this.myGrid.showloadelement();
 
/*     this.dataService.sortData({ column, direction })
      .subscribe((data) => {
        this.source.localdata = data;
        this.myGrid.updatebounddata('sort');
        this.myGrid.hideloadelement();
      }); */
  }

  getData() {
    this.myGrid.showloadelement();
    this.adminService.getAllRoles()
        .subscribe(
          (data) => {
            this.source.localdata = data;
            this.myGrid.updatebounddata();
            this.hideErrorMessage= true;
            this.errorMessage = "";
            this.message = "Get Role List Successfully !";
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
    if (document.body.offsetWidth < 700) {
      return '90%';
    }
     return 700;
  }

  onEditClick(row){
    this.roleBean.pkRoleId = this.myGrid.getrowdata(row).pkRoleId;
    this.roleBean.roleName = this.myGrid.getrowdata(row).roleName;
    this.roleBean.description = this.myGrid.getrowdata(row).description;
    this.popupRoleModal();
  }

  onDeleteClick(row){
    this.roleBean.pkRoleId = this.myGrid.getrowdata(row).pkRoleId;
    this.adminService.deleteRole(this.roleBean.pkRoleId).subscribe((res: RoleBean) => {
        if (res.pkRoleId > 0) {
          this.errorMessage = "";
          this.hideErrorMessage = true;
          this.message = "Role with name "+ this.roleBean.roleName + " has been deleted."; 

        }
        else{
          this.message = "";
          this.hideErrorMessage = false;
          this.errorMessage = res.description;
        }
        this.getData();
      },
      err =>{ 
          console.log(err);
          this.hideErrorMessage = false;
          this.errorMessage = err.errorMessage;        
      });
  }

  popupRoleModal(){
    const modalRef = this.modalService.open(AddRoleComponent, {
      scrollable: true,
     //windowClass: 'md-Class',
     // keyboard: false,
     // backdrop: 'static'
      // size: 'xl',
       windowClass: 'modal-xxl', 
       size: 'lg'
    });
   modalRef.componentInstance.fromParent = this.roleBean;
   modalRef.result.then(
       result => {
           this.getData();
           console.log(result);
       },
       reason => {}
   );
  }

  onBtnClickCreateRole(e){
     this.roleBean = new RoleBean();
     this.popupRoleModal();
   }


}
