import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
//import 'node_modules/jqwidgets-ng/jqwidgets/styles/jqx.energyblue.css';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ShareService } from './../../services/share.service';
import { AdminService } from './../../services/admin.service';
import { AddTermComponent } from './../../modal/add-term/add-term.component';
import { TermBean } from './../../domains/term-bean';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements AfterViewInit  {
  termBean: TermBean =  new TermBean();
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  @ViewChild('f') classForm: NgForm;
  hideErrorMessage: boolean = true;
  errorMessage: string = "";
  message: string = "";
  
  ngAfterViewInit() {
   this.myGrid.theme('energyblue');

  //  this.myGrid.autoshowloadelement();
    this.getData();
  //  this.myGrid.hideloadelement();

  }

  
  source: any = {
    localdata: null,
    datafields: [
        { name: 'pkTermId', type: 'int' },
        { name: 'term', type: 'int' },
        { name: 'label', type: 'string' },
        { name: 'price', type: 'number' }       
    ],
    datatype: 'json'
};

dataAdapter: any = new jqx.dataAdapter(this.source);

columns: any[] = [
 //   { text: 'ID', datafield: 'pkTermId', width: 100 },
    { text: 'Term', datafield: 'term', width: 180 },
    { text: 'Label', datafield: 'label', width: 250 },
    { text: 'Price', datafield: 'price', width: 100 },
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
          width: '490px',
          height: "180px",
          panelClass: 'mat-dialog-container',
          data: "Do you confirm the deletion of the Term with term value " + this.myGrid.getrowdata(row).pkTermId +" ?"
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

  constructor(
    private shareService: ShareService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private adminService: AdminService) { }

 
  getData() {
    this.myGrid.showloadelement();
    this.adminService.getAllTerms()
        .subscribe(
          (data) => {
            this.source.localdata = data;
            this.myGrid.updatebounddata();
            this.hideErrorMessage= true;
            this.errorMessage = "";
            this.message = "Get Term List Successfully !";
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
		if (document.body.offsetWidth < 630) {
			return '90%';
		}
		
		return 630;
	}

  onEditClick(row){
    this.termBean.pkTermId = this.myGrid.getrowdata(row).pkTermId;
    this.termBean.term = this.myGrid.getrowdata(row).term;
    this.termBean.label = this.myGrid.getrowdata(row).label;
    this.termBean.price = this.myGrid.getrowdata(row).price;
    this.popupTermModal();
  }

  onDeleteClick(row){
    this.termBean.pkTermId = this.myGrid.getrowdata(row).pkTermId;
  
    this.adminService.deleteTerm(this.termBean.pkTermId).subscribe((res: TermBean) => {
        if (res.pkTermId > 0) {
          this.errorMessage = "";
          this.hideErrorMessage = true;
          this.message = "Term with value: "+ this.termBean.term + " has been deleted."; 

        }
        else{
          this.message = "";
          this.hideErrorMessage = false;
          this.errorMessage = res.label;
        }
        this.getData();
      },
      err =>{ 
          console.log(err);
          this.hideErrorMessage = false;
          this.errorMessage = err.errorMessage;        
      });
  }
  
  popupTermModal(){
    const modalRef = this.modalService.open(AddTermComponent, {
      scrollable: true,
     //windowClass: 'md-Class',
     // keyboard: false,
     // backdrop: 'static'
      // size: 'xl',
       windowClass: 'modal-xxl', 
       size: 'lg'
    });
   modalRef.componentInstance.fromParent = this.termBean;
   modalRef.result.then(
       result => {
           this.getData();
           console.log(result);
       },
       reason => {}
   );
  }

  onBtnClickCreateTerm(e){
     this.termBean = new TermBean();
     this.popupTermModal();
   }

   myGridOnRowSelect(event: any): void {
    const args = event.args;
    let selectedRowIndex = args.rowindex;
    let value = this.myGrid.getrowdata(selectedRowIndex);
   }
}//End of class
