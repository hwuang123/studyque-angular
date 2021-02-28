import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ShareService } from './../../services/share.service';
import { AdminService } from './../../services/admin.service';
import { AddMethodComponent } from './../../modal/add-method/add-method.component';
import { MethodBean } from './../../domains/method-bean';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.css']
})
export class MethodComponent implements OnInit, AfterViewInit {
  methodBean: MethodBean =  new MethodBean();
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('f') classForm: NgForm;
  hideErrorMessage: boolean = true;
  errorMessage: string = "";
  message: string = "";

  source: any = {
    localdata: null,
    datafields: [
        { name: 'pkMethodId', type: 'int' },
        { name: 'contactMethod', type: 'string' },
    ],
    datatype: 'json'
};

dataAdapter: any = new jqx.dataAdapter(this.source);

columns: any[] = [
    { text: 'ID', datafield: 'pkMethodId', width: 100 },
    { text: 'Contact Method', datafield: 'contactMethod', width: 250 },
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
          data: "Do you confirm the deletion of the Method for " + this.myGrid.getrowdata(row).contactMethod +" ?"
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
    private adminService: AdminService) { 
    
  }

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
      this.adminService.getAllMethods()
          .subscribe(
            (data) => {
              this.source.localdata = data;
              this.myGrid.updatebounddata();
              this.hideErrorMessage= true;
              this.errorMessage = "";
              this.message = "Get Method List Successfully !";
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
      this.methodBean.pkMethodId = this.myGrid.getrowdata(row).pkMethodId;
      this.methodBean.contactMethod = this.myGrid.getrowdata(row).contactMethod;
      this.popupMethodModal();
    }
  
    onDeleteClick(row){
      this.methodBean.pkMethodId = this.myGrid.getrowdata(row).pkMethodId;
      this.adminService.deleteMethod(this.methodBean.pkMethodId).subscribe((res: MethodBean) => {
          if (res.pkMethodId > 0) {
            this.errorMessage = "";
            this.hideErrorMessage = true;
            this.message = "Method for "+ this.methodBean.contactMethod + " has been deleted."; 
  
          }
          else{
            this.message = "";
            this.hideErrorMessage = false;
            this.errorMessage = res.contactMethod;
          }
          this.getData();
        },
        err =>{ 
            console.log(err);
            this.hideErrorMessage = false;
            this.errorMessage = err.errorMessage;        
        });
    }
    
    popupMethodModal(){
      const modalRef = this.modalService.open(AddMethodComponent, {
        scrollable: true,
       //windowClass: 'md-Class',
       // keyboard: false,
       // backdrop: 'static'
        // size: 'xl',
         windowClass: 'modal-xxl', 
         size: 'lg'
      });
     modalRef.componentInstance.fromParent = this.methodBean;
     modalRef.result.then(
         result => {
             this.getData();
             console.log(result);
         },
         reason => {}
     );
    }
  
    onBtnClickCreateMethod(e){
       this.methodBean = new MethodBean();
       this.popupMethodModal();
     }
  

}
