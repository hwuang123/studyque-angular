import { Component, OnInit,  ViewChild  } from '@angular/core';
import { FormBuilder, NgForm, Validators, FormGroup, FormArray } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ShareService } from './../../services/share.service';
import { AdminService } from './../../services/admin.service';
import { ScheduleBean } from './../../domains/schedule-bean';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  public isSlideChecked: boolean = true;
  on_off: string="Off";
  public toggleEvents: string[] = [];
  scheduleBean : ScheduleBean = new ScheduleBean();
  message: string="";
  errorMessage: string="";
  hideErrorMessage: boolean = true;
  hideMessage: boolean = true;

  @ViewChild('scheduleForm') methodForm: NgForm;
  constructor( public dialog: MatDialog,
    private shareService: ShareService,   
    private adminService: AdminService) { }

  ngOnInit(): void {
  //  this.on_off= (this.isSlideChecked)?"Off":"On";
   this.checkRunning();
  // this.scheduleBean.isCronTaskRunning = "On";
   this.scheduleBean.cronTabExpression = "*/5 * * * * *";
  }

  toggleChanges(event: any ) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '510px',
      height: "180px",
      panelClass: 'mat-dialog-container',
      data: "Are you sure you want to turn " + this.on_off + " Notification Cron Service?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log('Yes clicked');
        // DO SOMETHING
        this.changeCronService(event);
      }
    });

    
  }

 startCronService(){
    this.adminService.start(this.scheduleBean)
     .subscribe(
      (data: ScheduleBean) => {
        this.errorMessage = data.errorMessage;
        if(this.errorMessage == ""){
          this.hideErrorMessage= true;
          this.hideMessage = false;
          this.errorMessage = "";
          this.message = data.message;
        }
        else{
          this.hideErrorMessage= false;
          this.hideMessage = true;
          this.errorMessage = data.errorMessage;
          this.message = "";
        }
      },
      err =>{ 
          console.log(err);
          this.hideErrorMessage = false;
          this.hideMessage = true;
          this.message="";
          this.errorMessage = err.message;
       }
    );//End of start()
  }

  stopCronService(){
    this.adminService.stop(this.scheduleBean)
     .subscribe(
      (data: ScheduleBean) => {
        this.errorMessage = data.errorMessage;
        if(this.errorMessage == ""){
          this.hideErrorMessage= true;
          this.hideMessage = false;
          this.errorMessage = "";
          this.message = data.message;
        }
        else{
          this.hideErrorMessage= false;
          this.errorMessage = data.errorMessage;
          this.hideMessage = true;
          this.message = "";
        }
        
      },
      err =>{ 
          console.log(err);
          this.hideErrorMessage = false;
          this.hideMessage = true;
          this.message="";
          this.errorMessage = err.message;
       }
    );//End of stop()
  }



  changeCronService(event: any){
    this.on_off= (this.isSlideChecked)?"On":"Off";
    if(event.target.checked == true){
      this.startCronService();
    }
    else{
      this.stopCronService();
    }
 
    this.toggleEvents.push("Toggle Event: " + event.target.checked);
    this.isSlideChecked =  event.target.checked;
  }

  changeCron(){
    this.adminService.changeCron(this.scheduleBean)
    .subscribe(
     (data: ScheduleBean) => {
       this.errorMessage = data.errorMessage;
       if(this.errorMessage == ""){
         this.hideErrorMessage= true;
         this.hideMessage = false;
         this.errorMessage = "";
         this.message = data.message;
         this.isSlideChecked = data.isCronTaskRunning == "YES"? true : false;
       }
       else{
         this.hideErrorMessage= false;
         this.errorMessage = data.errorMessage;
         this.hideMessage = true;
         this.message = "";
       }
       
     },
     err =>{ 
         console.log(err);
         this.hideErrorMessage = false;
         this.hideMessage = true;
         this.message="";
         this.errorMessage = err.message;
      }
   );//End of stop()
  }

  onSubmit() {
     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '586px',
      height: "180px",
      panelClass: 'mat-dialog-container',
      data: "Are you sure you want to reset Cron Expression for Notification Service?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log('Yes clicked');
        // DO SOMETHING
        this.changeCron();
      }
    });
  }

  checkRunning(){
    this.adminService.checkRunning()
    .subscribe(
     (data: ScheduleBean) => {
       this.errorMessage = data.errorMessage;
       if(this.errorMessage == ""){
         this.hideErrorMessage= true;
         this.hideMessage = false;
         this.errorMessage = "";
         this.message = data.message;
         this.isSlideChecked = data.isCronTaskRunning == 'YES'? true:false;
       }
       else{
         this.hideErrorMessage= false;
         this.errorMessage = data.errorMessage;
         this.hideMessage = true;
         this.message = "";
       }
       
     },
     err =>{ 
         console.log(err);
         this.hideErrorMessage = false;
         this.hideMessage = true;
         this.message="";
         this.errorMessage = err.message;
      }
   );//End of stop()
  }
}
