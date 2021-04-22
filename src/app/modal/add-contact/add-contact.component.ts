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
import { ContactBean } from './../../domains/contact-bean.bean';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ShareService } from './../../services/share.service';
import { CommonFunctionService } from './../../shared/common-function.service';
import { ButtonRendererComponent } from 'src/app/shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { ContactService } from './../../services/contact.service'; 
import { AdminService } from './../../services/admin.service'; 
import { MethodBean } from './../../domains/method-bean';
import { GuardianService } from './../../services/guardian.service';
import { GuardianBean } from './../../domains/guardian-bean';
import { SelectZeroValidatorDirective } from './../../directive/select-zero-validator.directive';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  hideSucceed = true;
  hideError = true;
  errorMessage = "";
  message = "";
  isUpdate = false;
  isFromCancel = false;
  IsWait=false;
  userName = "";
  contactBean: ContactBean =  new ContactBean();
  contactChoices: any[] = [{ 
                            "value":"Yes",
                            "label":"Yes"        
                           },
                           {
                            "value":"No",
                            "label":"No"        
                           }];
  methods: MethodBean[];
  guardians: GuardianBean[];
  targetItem: any = "/method";
  pkStudentId: number;
  @Input() fromParent: any;  

  
  constructor( @Inject(LOCALE_ID) private locale: string,
  private route: ActivatedRoute,
  public dialog: MatDialog,
  private modalService: NgbModal,
  private contactService: ContactService,
  private router: Router, 
  public activeModal: NgbActiveModal,
  private shareService: ShareService,
  private adminService: AdminService,
  private guardianService: GuardianService,
  private commonFunctionService: CommonFunctionService) { }

  ngOnInit(): void {
      this.contactBean = this.fromParent;
      this.pkStudentId = this.contactBean.pkStudentId;
      this.userName = this.shareService.userName;
      if(this.contactBean.firstName){
        this.userName = this.contactBean.firstName + " " + this.contactBean.lastName;
      }
 
      this.getMethods();
      this.getGuardians();
   //   this.hideSucceed = true;
       this.hideError = true;
       this.IsWait = false;
       if(this.contactBean.pkContactId > 0){
         this.isUpdate = true;
       } 
   
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

  getMethods(){
    this.adminService.getAllMethods()
        .subscribe(
          (data) => {
           this.methods = data;
         },
          err =>{ 
            console.log(err);
          }
        );//End of subscribe()
  }

  getGuardians(){
    this.guardianService.getGuardianList()
    .subscribe(
      (data: GuardianBean[]) => {
        console.log(data);
        console.log(JSON.stringify(data));
        this.guardians = data;
      },
      error => {console.log(error); this.IsWait=false;}
    );
  }

  cancel(){
    this.contactBean = new ContactBean();
    this.isUpdate = false;
    this.hideSucceed = true;
    this.hideError = true;
  }

  saveContact() {

    this.IsWait = true;
    this.contactBean.pkStudentId = this.pkStudentId;
    this.contactService.saveContact(this.contactBean)
      .subscribe((data : ContactBean) => {
        console.log(data);
 
        if(data.pkContactId > 0){
        this.message = "A New Contact Is Saved";       
        this.hideSucceed = false;
        this.hideError = true;
        }
        else{
          this.message = "";
          this.errorMessage = data.errorMessage;       
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

  updatContact(){

    this.contactService.updateContact(this.contactBean.pkContactId,this.contactBean)
    .subscribe((data: ContactBean) => {
      console.log(data);
      if(data.pkMethodId <= 0){
         this.hideError = false;
         this.hideSucceed = true;
         this.errorMessage = data.errorMessage;
         this.IsWait = false;
      }
      else{
         this.hideError = true;      
         this.message = "Succeedfully update Contact for " + data.mediaVal;
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
    if(this.contactBean.pkMethodId == 1 || this.contactBean.pkMethodId == 2){
      this.contactBean.mediaVal = this.contactBean.phone;
    }
    else{
      this.contactBean.mediaVal = this.contactBean.email;
    }
    if(this.isUpdate){
      this.updatContact();
   }
   else{
      this.saveContact();
   }
  }
}
