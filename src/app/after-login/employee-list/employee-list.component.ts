import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ModelUpdateComponent } from './../model-update/model-update.component';
import { EmployeeDetailsComponent } from '../employee-details/employee-details.component';
import { Observable, of } from "rxjs";
import { ShareService } from './../../services/share.service';
import { EmployeeService } from "../employee.service";
import { Employee } from "../employee";
//import { ConfirmDialogComponent } from './../../shared/confirm-dialog/confirm-dialog.component';
import { ConfirmationDialogComponent } from './../../shared/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Observable<Employee[]>;
  hideSucceed = true;
  hideError = true;
  message = "";
  errorMessage = "";
  IsWait=false;
  @ViewChild(ModelUpdateComponent) child: ModelUpdateComponent;
  constructor(private employeeService: EmployeeService,
    private router: Router,public dialog: MatDialog,
    private modalService: NgbModal,
    private shareService: ShareService)
   { 
       
   }

   openModal(id: number){
    const modalRef = this.modalService.open(ModelUpdateComponent, {
       // scrollable: true,
       //windowClass: 'md-Class',
       // keyboard: false,
       // backdrop: 'static'
        // size: 'xl',
        // windowClass: 'modal-xxl', 
        // size: 'lg'
      });
     modalRef.componentInstance.fromParent = id;
     modalRef.result.then(
         result => {
          // this.employees = this.child.employees;
             this.reloadData();
             console.log(result);
         },
         reason => {}
     );
   }

   receiveMessage($event) {
    this.employees = $event
  }

  ngOnInit(): void {
    this.hideSucceed = true;
    this.hideError = true;
    this.reloadData();
  }

  reloadData() {
    // this.employees = this.employeeService.getEmployeesList();
   this.IsWait=true;
   this.shareService.targetItem = "\employees";
   this.employeeService.getEmployeesList()
        .subscribe(
          data => {
            console.log(data);
            this.employees = of(data);
            this.IsWait=false;
            // let tempArr:Employee[] = Object.values(data) as Employee[];
            // let Obsobj = of(tempArr);
            // this.employees = Obsobj;
          },
          error => {console.log(error); this.IsWait=false;}
        );
  }

  deleteEmployeeByService(id: number){
    this.IsWait=true;
    this.employeeService.deleteEmployee(id)
      .subscribe(
        data => {
          console.log(data);

          this.message = "Succefully deleted employee with ID " + id;
          this.hideError = true;
          this.hideSucceed = false;
          this.IsWait=false;
          this.reloadData();
        },
        error => { 
          console.log(error)
          this.hideError = false;
          this.hideSucceed = true;
          this.errorMessage = error.message;
        }
        );
  }

  deleteEmployee(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '490px',
      height: "160px",
      panelClass: 'mat-dialog-container',
      data: "Do you confirm the deletion of the employee with ID " + id +" ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log('Yes clicked');
        // DO SOMETHING
        this.deleteEmployeeByService(id);
      }
    });
    // this.employeeService.deleteEmployee(id)
    //   .subscribe(
    //     data => {
    //       console.log(data);

    //       this.message = "Succefully deleted employee with ID " + id;
    //       this.hideError = true;
    //       this.hideSucceed = false;
    //       this.reloadData();
    //     },
    //     error => { 
    //       console.log(error)
    //       this.hideError = false;
    //       this.hideSucceed = true;
    //       this.errorMessage = error.message;
    //     }
    //     );
  }

  employeeDetails(id: number){
    this.router.navigate(['details', id]);
  }

  updateEmployee(id: number){
    this.router.navigate(['update', id]);
  }
//if ('details' in navigator) 
}
