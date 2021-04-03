import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
//import * as moment from 'moment';
import { ShareService } from './../../services/share.service';
import { AdminService } from './../../services/admin.service';
import { AddClassService } from './../../services/add-class.service';
import { EditUseraccountComponent } from './../../modal/edit-useraccount/edit-useraccount.component';
import { UserBean } from './../../domains/user-bean.bean';
import { ClassName } from './../../domains/class-name';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit, AfterViewInit  {
  userBean: UserBean =  new UserBean();
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  //@ViewChild('f') classForm: NgForm;
  hideErrorMessage: boolean = true;
  expandRows: boolean[];
  expandRowIndexs: number[]=[];
  errorMessage: string = "";
  message: string = "";
  gridInstance: any;
  source: any = {
    localdata: null,
    datafields: [
        { name: 'pkUseraccountId', type: 'int' },
        { name: 'userName', type: 'string' },
        { name: 'pkStudentId', type: 'int' },
        { name: 'firstName', type: 'string' },
        { name: 'lastName', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'pkStatusId', type: 'int' },        
        { name: 'gender', type: 'string' },
        { name: 'age', type: 'int' },
        { name: 'major', type: 'string' },
        { name: 'schoolId', type: 'int' },
        { name: 'expiredDate', type: 'date'}
    ],
    id: "pkStudentId",
    datatype: 'json'
};
renderer = (row: number, column: any, value: string): string => {
  return '<span style="margin-left: 4px; margin-top: 9px; float: left;">' + value + '</span>';
}
dataAdapter: any = new jqx.dataAdapter(this.source);

columns: any[] = [
  { text: 'User Name', datafield: 'userName', width: 100, cellsrenderer: this.renderer },
  { text: 'First Name', datafield: 'firstName', width: 100, cellsrenderer: this.renderer },
  { text: 'Last Name', datafield: 'lastName', width: 100, cellsrenderer: this.renderer },
  { text: 'Gender', datafield: 'gender', width: 100, cellsrenderer: this.renderer },
  { text: 'Age', datafield: 'age', width: 100, cellsrenderer: this.renderer },
  { text: 'Major', datafield: 'major', width: 200, cellsrenderer: this.renderer },
  { text: 'Expired Ddate', datafield: 'expiredDate', width: 100, cellsformat: 'MM/dd/yyyy' },
  { text: 'Status', datafield: 'status', width: 100, cellsrenderer: this.renderer },
  {
    text: 'Change Status',
    datafield: 'Edit',
    width: 100,
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
   }//Edit
  ];

  classesSource: any =
  {
      datafields: [
          { name: 'pkClsnmId', type: 'int' },
          { name: 'classname', type: 'string' },
          { name: 'classtype', type: 'string' },
          { name: 'instructor', type: 'string' },
          { name: 'semStartDate', type: 'date' },
          { name: 'semEndDate', type: 'date' }
      ],
      id: 'pkStudentId',
      root: 'Classes',
      record: 'Class',
      datatype: 'json',
      async: false,
      localdata: null
  };
  classesDataAdapter = new jqx.dataAdapter(this.classesSource, { autoBind: true });
  nestedGrids: any[] = new Array();

  initRowDetails = (index: number, parentElement: any, gridElement: any, record: any): void => {
        let id = record.uid.toString();
        let nestedGridContainer = parentElement.children[0];
        this.nestedGrids[index] = nestedGridContainer;
        this.getClassNameListById(nestedGridContainer,id);

 /*        let secondSource = {
          dataType: "json",
          datafields: [
            { name: 'pkClsnmId', type: 'int' },
            { name: 'classname', type: 'string' },
            { name: 'classtype', type: 'string' },
            { name: 'instructor', type: 'string' },
            { name: 'semStartDate', type: 'date' },
            { name: 'semEndDate', type: 'date' }
          ],
          id: "pkStudentId",
          async: false,
          localdata: null
      };
     let secondLevelAdapter = new jqx.dataAdapter(secondSource, { autoBind: true,
      loadComplete: null
     });
 

     this.addClassService.getClassnamesByStudentId(id)
     .subscribe(
       data => {
         console.log(JSON.stringify(data));
         secondSource.localdata = data;
         if (nestedGridContainer != null) {
          let settings = {
              width: 820,
              height: 200,
              source: secondLevelAdapter, 
              columns: [
                  { text: 'Class Name', datafield: 'classname', width: 200 },
                  { text: 'Class Type', datafield: 'classtype', width: 150 },
                  { text: 'Instructor', datafield: 'instructor', width: 200 },
                  { text: 'Start Date', datafield: 'semStartDate', width: 150, cellsformat: 'MM/dd/yyyy' },
                  { text: 'End Date', datafield: 'semEndDate', width: 150, cellsformat: 'MM/dd/yyyy' }
              ]
          };
          this.gridInstance = jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
         }//if
        },
        error => {console.log(error); }
      ); */
 }

collapseAll =(rowindex: number): void =>{
  this.expandRowIndexs.forEach(idx =>{
    if(idx != rowindex){
       this.myGrid.hiderowdetails(idx);
    }  
  });
  this.expandRowIndexs = [];
} 

rowdetailstemplate: any = {
    rowdetails: '<div id="nestedGrid" style="margin: 10px;"></div>', rowdetailsheight: 220, rowdetailshidden: true
};

ready = (): void => {
    this.myGrid.showrowdetails(1);
    let data = this.myGrid.getrows();
    for (var i = 0; i < data.length; i++) {
            this.expandRows.push(false);
        };
};
  // create nested grid.
  constructor(private shareService: ShareService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private adminService: AdminService,
    private addClassService: AddClassService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.myGrid.theme('energyblue');
    this.getData();
  }
   
  getData() {
    this.myGrid.showloadelement();
    this.adminService.getUserBeanList()
        .subscribe(
          (data) => {
            this.source.localdata = data;
            this.myGrid.updatebounddata();
            this.hideErrorMessage= true;
            this.errorMessage = "";
            this.message = "Get User List Successfully !";
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
    if (document.body.offsetWidth < 1032) {
      return '90%';
    }
     return 1032;
  }

  onEditClick(row){
    this.userBean.pkUseraccountId = this.myGrid.getrowdata(row).pkUseraccountId;
    this.userBean.userName = this.myGrid.getrowdata(row).userName;
    this.userBean.status = this.myGrid.getrowdata(row).status;
    this.userBean.pkStatusId = this.myGrid.getrowdata(row).pkStatusId;
    this.userBean.expiredDate = this.myGrid.getrowdata(row).expiredDate;
    this.popupRoleModal();
  }

  popupRoleModal(){
    const modalRef = this.modalService.open(EditUseraccountComponent, {
      scrollable: true,
     //windowClass: 'md-Class',
     // keyboard: false,
     // backdrop: 'static'
      // size: 'xl',
       windowClass: 'modal-xxl', 
       size: 'lg'
    });
   modalRef.componentInstance.fromParent = this.userBean;
   modalRef.result.then(
       result => {
           this.getData();
           console.log(result);
       },
       reason => {}
   );
  }

  myGridOnRowSelect(event: any): void {
    const args = event.args;
    let selectedRowIndex = args.rowindex;
    let value = this.myGrid.getrowdata(selectedRowIndex);
   }

   Rowexpand(event: any): void {
    const args = event.args;
    this.collapseAll(args.rowindex);
    this.expandRowIndexs.push(args.rowindex);
   }

  getClassNameListById(nestedGridContainer: any,pkStudentId: number) {

    let secondSource = {
      dataType: "json",
      datafields: [
        { name: 'pkClsnmId', type: 'int' },
        { name: 'classname', type: 'string' },
        { name: 'classtype', type: 'string' },
        { name: 'instructor', type: 'string' },
        { name: 'semStartDate', type: 'date' },
        { name: 'semEndDate', type: 'date' }
      ],
      id: "pkStudentId",
      async: false,
      localdata: null
    };
    let secondLevelAdapter = new jqx.dataAdapter(secondSource);

    this.addClassService.getClassnamesByStudentId(pkStudentId)
     .subscribe(
       data => {
         console.log(JSON.stringify(data));
         secondSource.localdata = data;
         if (nestedGridContainer != null) {
          let settings = {
              width: 820,
              height: 200,
              source: secondLevelAdapter, 
              columns: [
                  { text: 'Class Name', datafield: 'classname', width: 200 },
                  { text: 'Class Type', datafield: 'classtype', width: 150 },
                  { text: 'Instructor', datafield: 'instructor', width: 200 },
                  { text: 'Start Date', datafield: 'semStartDate', width: 150, cellsformat: 'MM/dd/yyyy' },
                  { text: 'End Date', datafield: 'semEndDate', width: 150, cellsformat: 'MM/dd/yyyy' }
              ]
          };
          this.gridInstance = jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
         }//if
        },
        error => {console.log(error); }
      );
  } 
}
