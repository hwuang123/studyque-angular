import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ShareService } from './../../services/share.service';
import { AdminService } from './../../services/admin.service';
import { StatusBean } from './../../domains/status-bean.bean';
import { AddStatusComponent } from './../../modal/add-status/add-status.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styles: [
  ]
})
export class StatusComponent implements  OnInit, AfterViewInit {
  statusBean: StatusBean =  new StatusBean();
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('f') classForm: NgForm;
  hideErrorMessage: boolean = true;
  errorMessage: string = "";
  message: string = "";

  source: any = {
    localdata: null,
    datafields: [
        { name: 'pkStatusId', type: 'int' },
        { name: 'status', type: 'string' },
    ],
    datatype: 'json'
};

dataAdapter: any = new jqx.dataAdapter(this.source);

columns: any[] = [
    { text: 'ID', datafield: 'pkStatusId', width: 100 },
    { text: 'Account Statusd', datafield: 'status', width: 250 },
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
          data: "Do you confirm the deletion of the Status " + this.myGrid.getrowdata(row).status +" ?"
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
      this.adminService.getAllStatus()
          .subscribe(
            (data) => {
              this.source.localdata = data;
              this.myGrid.updatebounddata();
              this.hideErrorMessage= true;
              this.errorMessage = "";
              this.message = "Get Status List Successfully !";
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
      if (document.body.offsetWidth < 450) {
        return '90%';
      }
      
      return 450;
    }
  
    onEditClick(row){
      this.statusBean.pkStatusId = this.myGrid.getrowdata(row).pkStatusId;
      this.statusBean.status = this.myGrid.getrowdata(row).status;
      this.popupStatusModal();
    }
  
    onDeleteClick(row){
      this.statusBean.pkStatusId = this.myGrid.getrowdata(row).pkStatusId;
      this.adminService.deleteStatus(this.statusBean.pkStatusId).subscribe((res: StatusBean) => {
          if (res.pkStatusId > 0) {
            this.errorMessage = "";
            this.hideErrorMessage = true;
            this.message = "Status value "+ this.statusBean.status + " has been deleted."; 
  
          }
          else{
            this.message = "";
            this.hideErrorMessage = false;
            this.errorMessage = res.status;
          }
          this.getData();
        },
        err =>{ 
            console.log(err);
            this.hideErrorMessage = false;
            this.errorMessage = err.errorMessage;        
        });
    }
    
    popupStatusModal(){
      const modalRef = this.modalService.open(AddStatusComponent, {
        scrollable: true,
       //windowClass: 'md-Class',
       // keyboard: false,
       // backdrop: 'static'
        // size: 'xl',
         windowClass: 'modal-xxl', 
         size: 'lg'
      });
     modalRef.componentInstance.fromParent = this.statusBean;
     modalRef.result.then(
         result => {
             this.getData();
             console.log(result);
         },
         reason => {}
     );
    }
  
    onBtnClickCreateStatus(e){
       this.statusBean = new StatusBean();
       this.popupStatusModal();
     }
  

}
