import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ShareService } from './../../services/share.service';
import { AdminService } from './../../services/admin.service';
import { AddPrivilegeComponent } from './../../modal/add-privilege/add-privilege.component';
import { PrivilegeBean } from './../../domains/privilege-bean';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.css']
})
export class PrivilegeComponent implements  OnInit, AfterViewInit {
  privilegeBean: PrivilegeBean =  new PrivilegeBean();
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('f') classForm: NgForm;
  hideErrorMessage: boolean = true;
  errorMessage: string = "";
  message: string = "";

  source: any = {
    localdata: null,
    datafields: [
        { name: 'pkPrivilegeId', type: 'int' },
        { name: 'privName', type: 'string' },
        { name: 'privDesc', type: 'string' }
    ],
    datatype: 'json'
};

dataAdapter: any = new jqx.dataAdapter(this.source);

columns: any[] = [
    { text: 'ID', datafield: 'pkPrivilegeId', width: 100 },
    { text: 'Privilege Name', datafield: 'privName', width: 250 },
    { text: 'Privilege Description', datafield: 'privDesc', width: 250 },
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
          data: "Do you confirm the deletion of the Privilege for " + this.myGrid.getrowdata(row).privName +" ?"
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
    this.adminService.getAllPrivileges()
        .subscribe(
          (data) => {
            this.source.localdata = data;
            this.myGrid.updatebounddata();
            this.hideErrorMessage= true;
            this.errorMessage = "";
            this.message = "Get Privilege List Successfully !";
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
    this.privilegeBean.pkPrivilegeId = this.myGrid.getrowdata(row).pkPrivilegeId;
    this.privilegeBean.privName = this.myGrid.getrowdata(row).privName;
    this.privilegeBean.privDesc = this.myGrid.getrowdata(row).privDesc;
    this.popupPrivilegeModal();
  }

  onDeleteClick(row){
    this.privilegeBean.pkPrivilegeId = this.myGrid.getrowdata(row).pkPrivilegeId;
    this.adminService.deletePrivilege(this.privilegeBean.pkPrivilegeId).subscribe((res: PrivilegeBean) => {
        if (res.pkPrivilegeId > 0) {
          this.errorMessage = "";
          this.hideErrorMessage = true;
          this.message = "Privilege with name "+ this.privilegeBean.privName + " has been deleted."; 

        }
        else{
          this.message = "";
          this.hideErrorMessage = false;
          this.errorMessage = res.privDesc;
        }
        this.getData();
      },
      err =>{ 
          console.log(err);
          this.hideErrorMessage = false;
          this.errorMessage = err.errorMessage;        
      });
  }

  popupPrivilegeModal(){
    const modalRef = this.modalService.open(AddPrivilegeComponent, {
      scrollable: true,
     //windowClass: 'md-Class',
     // keyboard: false,
     // backdrop: 'static'
      // size: 'xl',
       windowClass: 'modal-xxl', 
       size: 'lg'
    });
   modalRef.componentInstance.fromParent = this.privilegeBean;
   modalRef.result.then(
       result => {
           this.getData();
           console.log(result);
       },
       reason => {}
   );
  }

  onBtnClickCreatePrivilege(e){
     this.privilegeBean = new PrivilegeBean();
     this.popupPrivilegeModal();
   }

}
