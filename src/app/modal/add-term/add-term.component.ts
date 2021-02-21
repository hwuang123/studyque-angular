import { Component, OnInit, EventEmitter, Output, LOCALE_ID, Inject, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, NgForm, Validators, FormGroup, FormArray } from '@angular/forms';
import { Observable, BehaviorSubject, ReplaySubject, combineLatest, merge, of  } from "rxjs";
import 'jquery-ui';
import * as $ from 'jquery';
import 'jqueryui';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { TermBean } from './../../domains/term-bean';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ShareService } from './../../services/share.service';
import { CommonFunctionService } from './../../shared/common-function.service';
import { ButtonRendererComponent } from 'src/app/shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { AdminService } from './../../services/admin.service';


@Component({
  selector: 'app-add-term',
  templateUrl: './add-term.component.html',
  styleUrls: ['./add-term.component.css']
})
export class AddTermComponent implements OnInit {
 
  hideSucceed = true;
  hideError = true;
  errorMessage = "";
  message = "";
  isUpdate = false;
  isFromCancel = false;
  IsWait=false;
  termBean: TermBean =  new TermBean();
  targetItem: any = "/term";
  @ViewChild('termForm') termForm: NgForm;
  @Input() fromParent: any;  

  constructor(
    @Inject(LOCALE_ID) private locale: string,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private modalService: NgbModal,
              private adminService: AdminService,
              private router: Router, 
              public activeModal: NgbActiveModal,
              private shareService: ShareService,
              private commonFunctionService: CommonFunctionService
  ) { }

  ngOnInit(): void {
    this.termBean = this.fromParent;
    this.hideSucceed = true;
    this.hideError = true;
    this.IsWait = false;
    if(this.termBean.pkTermId > 0){
      this.isUpdate = true;
    } 
//    this.cancel();
    this.shareService.currentTargetItem.subscribe( targetItem => this.targetItem = targetItem);
    $(document).ready(function () {
      let modalContent: any = $('.modal-content');
      modalContent.draggable({
        handle: '.modal-header',
        revert: true,
        revertDuration: 1400,
      });
    });
  }

  cancel(){
    this.termBean = new TermBean();
    this.isUpdate = false;
    this.hideSucceed = true;
    this.hideError = true;
  }

  saveTerm() {
    //this.spinnerOverlayService.show("Updating...");
    this.IsWait = true;
    this.adminService.createTerm(this.termBean)
      .subscribe((data : TermBean) => {
        console.log(data);
        //this.activeModal.close();
/*         this.classdayOfWeeks = this.classScheduleService.getClassdayOfWeekList(data.pkClsnmId);
        this.childClassdayOfWeekOutput.emit(this.classdayOfWeeks); */
        if(data.pkTermId > 0){
        this.message = "A New Term Is Saved";       
        this.hideSucceed = false;
        this.hideError = true;
        }
        else{
          this.message = "";
          this.errorMessage = data.label;       
          this.hideSucceed = true;
          this.hideError = false;
        }
        this.IsWait = false;
       },
       error => {
        this.errorMessage = error.message;
        this.hideError = false;
        this.hideSucceed = true; 
        this.IsWait = false;
        console.log(error);
      });
  }

  updatTerm(){

    this.adminService.updateTerm(this.termBean.pkTermId,this.termBean)
    .subscribe((data: TermBean) => {
      console.log(data);
      if(data.pkTermId <= 0){
         this.hideError = false;
         this.hideSucceed = true;
         this.errorMessage = data.label;
         this.IsWait = false;
      }
      else{
         this.hideError = true;      
         this.message = "Succeedfully update Term for term value " + data.term;
         this.hideSucceed = false;
         this.IsWait = false;
      }
      
    },
     err =>{ 
       console.log(err);
       this.hideError = false;
       this.hideSucceed = false;
       this.errorMessage = err.error.errorMessage;        
    }
     
     ); 
     this.isUpdate = false;

}

  onSubmit() {
    if(this.isUpdate){
      this.updatTerm();
   }
   else{
      this.saveTerm();    
   }
  }


}
