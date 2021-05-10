import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
//import * as moment from 'moment';
import { ShareService } from './../../services/share.service';
import { AdminService } from './../../services/admin.service';
import { AddClassService } from './../../services/add-class.service';
import { AlertService } from './../../services/alert.service';
import { GuardianService } from './../../services/guardian.service';
import { AssignmentService } from './../../services/assignment.service';
import { ContactService } from './../../services/contact.service';
import { ContactBean } from './../../domains/contact-bean.bean';
import { EditUseraccountComponent } from './../../modal/edit-useraccount/edit-useraccount.component';
import { UserBean } from './../../domains/user-bean.bean';
import { ClassName } from './../../domains/class-name';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { DisplayDetailComponent } from './../../modal/display-detail/display-detail.component';
import { FilterRequest } from 'src/app/shared/filter-request';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit, AfterViewInit  {
  userBean: UserBean =  new UserBean();
  pageSizeList: any = ['10', '20', '50','100'];
  //selectedPageSize = 20;
  selectDetailType: any;
  prvSelectDetailType: any;
  displayOptions: any[];
  filterRequest: FilterRequest = new FilterRequest();
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  //@ViewChild('f') classForm: NgForm;
  hideErrorMessage: boolean = true;
  expandRows: boolean[];
  expandRowIndexs: number[]=[];
  errorMessage: string = "";
  message: string = "";
  gridInstance: any;
  pagenum: number=1;
  pagesize: number=10;
  totalrecords: number=0;
  doFilter: boolean=false;
  sortcolumn: string ='';
  sortdirection: string = 'asc';
  source: any = {
    localdata: {},
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
   //     { name: 'detail', value: 'detail'}
    ],
    id: "pkStudentId",
    totalrecords: this.totalrecords,
    datatype: 'json',
    pagenum: this.pagenum,
    pagesize: this.pagesize,  
 //   sort: this.customsortfunc,
    sortcolumn: this.sortcolumn,
    sortdirection: this.sortdirection,
  /*  pager: (pagenum: any, pagesize: any, oldpagenum: any): void => {
      this.pagenum = pagenum;
      this.pagesize= pagesize;
      this.getPagingData();
      
    }, */
    beforeprocessing: function (data) {
  
  }
};
renderer = (row: number, column: any, value: string): string => {
  return '<span style="margin-left: 4px; margin-top: 9px; float: left;">' + value + '</span>';
}
dataAdapter: any = new jqx.dataAdapter(this.source);

columns: any[] = [
  {
    text: '#', sortable: false, filterable: false, editable: false,
    groupable: false, draggable: false, resizable: false,
    datafield: '', columntype: 'number', width: 50,
    cellsrenderer: function (row, column, value) {
        return "<div style='margin:4px;'>" + (value + 1) + "</div>";
    }
  },
  { text: 'User Name', datafield: 'userName', width: 100, filterable: true, filtertype: 'input', editable: false, cellsrenderer: this.renderer },
  { text: 'First Name', datafield: 'firstName', width: 100,  filterable: true, filtertype: 'input', editable: false, cellsrenderer: this.renderer },
  { text: 'Last Name', datafield: 'lastName', width: 100,  filterable: true, filtertype: 'input', editable: false, cellsrenderer: this.renderer },
  { text: 'Gender', datafield: 'gender', width: 100,  filterable: false, editable: false, cellsrenderer: this.renderer },
  { text: 'Age', datafield: 'age', width: 100,   filterable: false, editable: false,cellsrenderer: this.renderer },
  { text: 'Major', datafield: 'major', width: 200,   filterable: false, editable: false, cellsrenderer: this.renderer },
  { text: 'Expired Ddate', datafield: 'expiredDate', width: 100,   filterable: false, editable: false, cellsformat: 'MM/dd/yyyy' },
  { text: 'Status', datafield: 'status',  filterable: false, width: 100, cellsrenderer: this.renderer },
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
   },
   {
    text: 'Show Detail',
    datafield: 'Detail',
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
      return 'Click to Show';
    }, 

    buttonclick: (row) => {
      this.onDetailClick(row);
     }
   },
   
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
  nestedGridContainer: any;
  initRowDetails = (index: number, parentElement: any, gridElement: any, record: any): void => {
        let id = record.uid.toString();
        if(parentElement.children)
         {
          this.nestedGridContainer = parentElement.children[0];
          this.nestedGrids[index] = this.nestedGridContainer;
         }

        switch(this.selectDetailType) {
          case "Alert": {
            this.getAlertListById(this.nestedGridContainer,id);
            break;
          }
          case "Assignment": {
            this.getAssignmentListById(this.nestedGridContainer,id);
            break;
          }
          case "Classes": {
            this.getClassNameListById(this.nestedGridContainer,id);
            break;
          }
          case "Contact": {
            this.getContactListById(this.nestedGridContainer,id);
            break;
          }
          case "Guardian": {
            this.getGuardianListById(this.nestedGridContainer,id);
            break;
          }
          default: {
            console.log("Invalid choice");
            break;
         }

        }
  
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

addfilter = (): void => {
  let filtergroup = new jqx.filter();
  let filter_or_operator = 1;
  let filtervalue = 'Beate';
  let filtercondition = 'contains';
  let filter1 = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);
  filtervalue = 'Andrew';
  // filtercondition = 'starts_with';
  // let filter2 = filtergroup.createfilter('stringfilter', filtervalue, filtercondition);
  filtergroup.addfilter(filter_or_operator, filter1);
 // filtergroup.addfilter(filter_or_operator, filter2);
  this.myGrid.addfilter('firstName', filtergroup, true);

  this.myGrid.applyfilters();
}

ready = (): void => {
    this.myGrid.showrowdetails(1);
    let data = this.myGrid.getrows();
    for (var i = 0; i < data.length; i++) {
            this.expandRows.push(false);
        };
   // this.addfilter();
    let localizationObject = {  
          filterstringcomparisonoperators: ['EQUAL', 'NOT_EQUAL','CONTAINS','DOES_NOT_CONTAIN','STARTS_WITH','ENDS_WITH'],  
         // filterstringcomparisonoperators: ['contains', 'notContains','equals', 'notEqual', 'startsWith','endsWith'],  
          // filter numeric comparison operators.  
          filternumericcomparisonoperators: ['less than', 'greater than'],  
          // filter date comparison operators.  
          filterdatecomparisonoperators: ['less than', 'greater than'],  
          // filter bool comparison operators.  
          filterbooleancomparisonoperators: ['equal', 'not equal']  
      }   
     
    this.myGrid.localizestrings(localizationObject);
};
  // create nested grid.
  constructor(private shareService: ShareService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private adminService: AdminService,
    private addClassService: AddClassService,
    private alertService: AlertService,
    private assignmentService: AssignmentService,
    private guardianService: GuardianService,
    private contactService: ContactService,
    private _router: Router
    ) { }

  ngOnInit(): void {
    this.displayOptions = this.shareService.displayOptios;
  //  this.detailsource.localdata=this.displayOptions;
    this.selectDetailType = "Alert";
  }

  ngAfterViewInit() {
    this.myGrid.theme('energyblue');
    //this.getData();
   this.filterRequest.sortItem = this.sortcolumn;
   this.filterRequest.sortDirection = this.sortdirection;
   this.getPagingData(1,this.pagesize);
  
   this.getTotalRecords();
  }
 
 /*  rendergridrows = (params: any): any[] => {
    this.pagenum = params.startindex / this.pagesize;
    let data =  this.getPagingData();
    return data;
    //return this.dataAdapter.records;
} */
rendergridrows = (params: any): any => {
  return params.data;
}

  getTotalRecords(): number{
    this.adminService.getUseraccounCount()
    .subscribe(
      (data) => {
        this.totalrecords = data;
        this.source.totalrecords = data;
        this.hideErrorMessage= true;
        this.errorMessage = "";
        this.message = "Get User List Successfully !";
      },
      err =>{ 
        console.log(err);
        this.hideErrorMessage = false;
        this.message="";
        this.errorMessage = err.message;
      }
    
    );//End of subscribe
    return this.totalrecords;
  }

  getPagingData(pNumber:number,pSize:number): UserBean[]{
    this.myGrid.showloadelement();
    let result: any[] = [];
    this.adminService.getPagingUserBeanList(pNumber,pSize,this.filterRequest.sortItem,this.filterRequest.sortDirection)
        .subscribe(
          (data) => {
            this.source.localdata = data;
            result = data;
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
        return  this.source.localdata;
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
    if (document.body.offsetWidth < 1120) {
      return '90%';
    }
     return 1120;
  }

  onEditClick(row){
    this.userBean.pkUseraccountId = this.myGrid.getrowdata(row).pkUseraccountId;
    this.userBean.userName = this.myGrid.getrowdata(row).userName;
    this.userBean.status = this.myGrid.getrowdata(row).status;
    this.userBean.pkStudentId = this.myGrid.getrowdata(row).pkStudentId;
    this.userBean.pkStatusId = this.myGrid.getrowdata(row).pkStatusId;
    this.userBean.expiredDate = this.myGrid.getrowdata(row).expiredDate;
    this.popupRoleModal();
  }

  onDetailClick(row){
    this.collapseAll(0);
    this.userBean.pkUseraccountId = this.myGrid.getrowdata(row).pkUseraccountId;
    this.userBean.userName = this.myGrid.getrowdata(row).userName;
    this.userBean.status = this.myGrid.getrowdata(row).status;
    this.userBean.pkStudentId = this.myGrid.getrowdata(row).pkStudentId;
    this.userBean.pkStatusId = this.myGrid.getrowdata(row).pkStatusId;
    this.userBean.expiredDate = this.myGrid.getrowdata(row).expiredDate;
    this.popupDetailModal();
  }

  popupDetailModal(){
    const modalRef = this.modalService.open(DisplayDetailComponent, {
      scrollable: true,
     //windowClass: 'md-Class',
     // keyboard: false,
     // backdrop: 'static'
      // size: 'xl',
       windowClass: 'modal-xxl', 
       size: 'lg'
    });
   modalRef.componentInstance.fromParent = this.userBean;
   modalRef.componentInstance.detailType = this.selectDetailType;
   modalRef.result.then(
       result => {
           this.getData();
           console.log(result);
       },
       reason => {}
   );
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

   cellSelect(event: any): void {
    let column = this.myGrid.getcolumn(event.args.datafield);
    let value = this.myGrid.getcellvalue(event.args.rowindex, column.datafield);
   alert("column="+ column + " value="+value);
   // var displayValue = $("#jqxgrid").jqxGrid('getcellvalue', event.args.rowindex, column.displayfield);
   }

   Rowexpand(event: any): void {
    const args = event.args;
    this.collapseAll(args.rowindex);
    this.expandRowIndexs.push(args.rowindex);

   
   // this.myGrid.showrowdetails(args.rowindex)
    if(this.selectDetailType != this.prvSelectDetailType){
    //$('.rowdetailWrapper').html(''); //to clear the row details
   // this.nestedGridContainer.html('');
      let index = this.myGrid.getrowboundindex(event.args.rowindex);
      let rowdata = this.myGrid.getrowdata(index);
      this.initRowDetails(index, false, this.myGrid, rowdata);//Pass false to get correct parent element from holder
      this.prvSelectDetailType = this.selectDetailType;
    }
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
              columnsresize: true,
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
  } //getClassNameListById

  getAlertListById(nestedGridContainer: any,pkStudentId: number) {

    let secondSource = {
      dataType: "json",
      datafields: [
        { name: 'pkAlertId', type: 'int' },
        { name: 'pkAssignmentId', type: 'int' },
        { name: 'pkGuardianId', type: 'int' },
        { name: 'pkContactId', type: 'int' },
        { name: 'pkMethodId', type: 'int' },
        { name: 'classname', map: 'assignmentBean>classname',type: 'string' },
        { name: 'assignmenttype', map: 'assignmentBean>assignmenttype', type: 'string' },
        { name: 'guardianName', type: 'string' },
        { name: 'mediaVal', type: 'string' },
        { name: 'alerttime', type: 'date' },
        { name: 'alertStartDateTime', type: 'date' },
        { name: 'alertEndDateTime', type: 'date' },
        { name: 'repeatDays', type: 'int' },
        { name: 'alertMessage', type: 'string' }
      ],
      id: "pkAlertId",
      async: false,
      localdata: null
    };
    let secondLevelAdapter = new jqx.dataAdapter(secondSource);

    this.alertService.getAlertListByStudentId(pkStudentId)
     .subscribe(
       data => {
         console.log(JSON.stringify(data));
         secondSource.localdata = data;
         if (nestedGridContainer != null) {
          let settings = {
              width: 960,
              height: 200,
              columnsresize : true,
              source: secondLevelAdapter, 
          //    autowidth: true,
              columns: [
                  { text: 'Class Name', datafield: 'classname', width: 150 },
                  { text: 'Assignment', datafield: 'assignmenttype', width: 150 },
                  { text: 'Guardian', datafield: 'guardianName', width: 200 },
                  { text: 'Notify With', datafield: 'mediaVal', width: 200 },                 
                  { text: 'Notification Time', datafield: 'alerttime', width: 200, cellsformat: 'MM/dd/yyyy h:mm:ss tt' },
                  { text: 'Notification Start Time', datafield: 'alertStartDateTime', width: 200, cellsformat: 'MM/dd/yyyy h:mm:ss tt' },
                  { text: 'Notification End Time', datafield: 'alertEndDateTime', width: 200, cellsformat: 'MM/dd/yyyy h:mm:ss tt' },
                  { text: 'Days of Alert', datafield: 'repeatDays', width: 100 },
                  { text: 'Alert Message', datafield: 'alertMessage', width: 200 }
                  
              ]
          };
          this.gridInstance = jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
         }//if
        },
        error => {console.log(error); }
      );
  } //getAlertListById

  getAssignmentListById(nestedGridContainer: any,pkStudentId: number){

    let secondSource = {
      dataType: "json",
      datafields: [
        { name: 'pkAssignmentId', type: 'int' },
        { name: 'classname', type: 'string' },
        { name: 'assignmenttype', type: 'string' },
        { name: 'dueDate', type: 'date' },
        { name: 'description', type: 'string' },
        { name: 'dueDayofweek', type: 'string' }
    ],
      id: "pkAssignmentId",
      async: false,
      localdata: null
    };
    let secondLevelAdapter = new jqx.dataAdapter(secondSource);

    this.assignmentService.getAssignmentListByStudentId(pkStudentId)
     .subscribe(
       data => {
         console.log(JSON.stringify(data));
         secondSource.localdata = data;
         if (nestedGridContainer != null) {
          let settings = {
              width: 960,
              height: 200,
              columnsresize : true,
              source: secondLevelAdapter, 
          //    autowidth: true,
              columns: [
                { text: 'Class Name', datafield: 'classname', width: 200 },
                { text: 'Assignment Type', datafield: 'assignmenttype', width: 200 },
                { text: 'Due Date', datafield: 'dueDate', width: 150, cellsformat: 'MM/dd/yyyy' },
                { text: 'Description', datafield: 'description', width: 250 },
                { text: 'Due Day of Week', datafield: 'dueDayofweek', width: 200 }
            ]
          };
          this.gridInstance = jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
         }//if
        },
        error => {console.log(error); }
      );
  }//getAssignmentListById

  getContactListById(nestedGridContainer: any,pkStudentId: number){
    let secondSource = {
      dataType: "json",
      datafields:[
        { name: 'pkContactId', type: 'int' },
        { name: 'pkMethodId', type: 'int' },
        { name: 'pkGuardianId', type: 'int' },
        { name: 'pkStudentId', type: 'int' },
        { name: 'firstName', type: 'string' },
        { name: 'lastName', type: 'string' },    
        { name: 'email', type: 'string' },    
        { name: 'phone', type: 'string' },    
        { name: 'relationship', type: 'string' }, 
        { name: 'isStudentContact', type: 'string' },
        { name: 'errorMessage', type: 'string' },
        { name: 'message', type: 'string' }
    ],
      id: "pkContactId",
      async: false,
      localdata: null
    };
    let secondLevelAdapter = new jqx.dataAdapter(secondSource);

    this.contactService.getContactListByStudentId(pkStudentId)
     .subscribe(
       data => {
         console.log(JSON.stringify(data));
         secondSource.localdata = data;
         if (nestedGridContainer != null) {
          let settings = {
              width: 1200,
              height: 200,
              columnsresize: true,
              source: secondLevelAdapter, 
              columns: [
                { text: 'First Name', datafield: 'firstName', width: 150 },
                { text: 'Last Name', datafield: 'lastName', width: 150 },
                { text: 'Email', datafield: 'email', width: 200 },
                { text: 'Cell Phone', datafield: 'phone', width: 200 },
                { text: 'Relationship', datafield: 'relationship', width: 100 },
                { text: 'Is for Student Contact?', datafield: 'isStudentContact', width: 200 }
            ]
          };
          this.gridInstance = jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
         }//if
        },
        error => {console.log(error); }
      );
  }//getContactListById

  getGuardianListById(nestedGridContainer: any,pkStudentId: number){
    let secondSource = {
      dataType: "json",
      datafields: [
        { name: 'guardianId', type: 'int' },
        { name: 'addressId', type: 'int' },
        { name: 'firstName', type: 'string' },
        { name: 'middleName', type: 'string' },   
        { name: 'lastName', type: 'string' },        
        { name: 'gender', type: 'string' }, 
        { name: 'age', type: 'int' }, 
        { name: 'relationship', type: 'string' },  
        { name: 'city', type: 'string' },  
        { name: 'state', type: 'string' },    
        { name: 'zip', type: 'string' }, 
        { name: 'address', type: 'string' },      
        { name: 'addressSameAsStudent', type: 'string' }
    ],
      id: "pkStudentId",
      async: false,
      localdata: null
    };
    let secondLevelAdapter = new jqx.dataAdapter(secondSource);

    this.guardianService.getGuardianListByStudentId(pkStudentId)
     .subscribe(
       data => {
         console.log(JSON.stringify(data));
         secondSource.localdata = data;
         if (nestedGridContainer != null) {
          let settings = {
              width: 1200,
              height: 200,
              columnsresize: true,
              source: secondLevelAdapter, 
              columns: [
                { text: 'First Name', datafield: 'firstName', width: 150 },
                { text: 'Last Name', datafield: 'lastName', width: 150 },
                { text: 'Gender', datafield: 'gender', width: 60 },
                { text: 'Age', datafield: 'age', width: 40 },
                { text: 'Relationship', datafield: 'relationship', width: 100 },
                { text: 'City', datafield: 'city', width: 200 },
                { text: 'State', datafield: 'state', width: 100 },
                { text: 'Zip', datafield: 'zip', width: 60 },
                { text: 'Address', datafield: 'address', width: 200},
                { text: 'Address Same As Student', datafield: 'addressSameAsStudent', width: 300 },
            ]
          };
          this.gridInstance = jqwidgets.createInstance(`#${nestedGridContainer.id}`, 'jqxGrid', settings);
         }//if
        },
        error => {console.log(error); }
      );
  }//getContactListById

  selectDetailHandler(event: any){
  //  this.selectDetailType = event.target.value;
    this.collapseAll(0);
  }
  
  onPageChanged(event: any): void {
    let args = event.args;
    this.pagenum = args.pagenum;
   /*  if(this.pagenum == 0){
      this.pagenum = 1;
    } */
    this.pagesize = args.pagesize;
    if(this.doFilter){
       this.getPagingDataFilter(args.pagenum + 1,args.pagesize);
    }
    else{
       this.getPagingData(args.pagenum + 1, args.pagesize);
    }
}

onPageSizeChanged(event: any): void {
  let args = event.args;
  this.pagenum = 0;
  this.myGrid.gotopage(0);
  this.pagesize = args.pagesize;
  this.getPagingData(args.pagenum+1, args.pagesize);
}

onFilter(event: any): void {
  let filters = event.args.filters;
  this.filterRequest = new FilterRequest();
	this.filterRequest.filterValue = filters[filters.length - 1].filter.getfilters()[0].value;
  this.filterRequest.filterType = filters[filters.length - 1].filter.getfilters()[0].condition;
  this.filterRequest.filterColumn = filters[filters.length - 1].datafield;
  this.filterRequest.sortItem = this.sortcolumn;
  this.filterRequest.sortDirection = this.sortdirection;
  if(this.filterRequest.filterColumn == 'userName'){
    this.myGrid.removefilter('firstName',false);
    this.myGrid.removefilter('lastName',false);
  }
  if(this.filterRequest.filterColumn == 'lastName'){
    this.myGrid.removefilter('firstName',false);
    this.myGrid.removefilter('userName',false);
  }
  if(this.filterRequest.filterColumn == 'firstName'){
    this.myGrid.removefilter('userName',false);
    this.myGrid.removefilter('lastName',false);
  }
  this.getFiltUserBeanCount();
 // this.getFilterUserBeanList();
  this.doFilter = true;
} 

getFiltUserBeanCount(){
  this.adminService.getFilterUserBeanCount(this.filterRequest).subscribe(
    data => {
      console.log(data);
      this.totalrecords = Number(data);
      this.source.totalrecords = this.totalrecords;
      this.getFilterUserBeanList();
     },
    error => {console.log(error); }
   );
}

getFilterUserBeanList(){
  this.myGrid.gotopage(0);
  this.pagenum = 1;
  this.myGrid.showloadelement();
  this.getPagingDataFilter(this.pagenum,this.pagesize);
  // this.adminService.getFilterUserBeanList(this.pagenum, this.pagesize,this.filterRequest)     
  //       .subscribe(
  //         (data) => {
  //           this.source.localdata = data;
  //           this.myGrid.updatebounddata();
  //           this.hideErrorMessage= true;
  //           this.errorMessage = "";
  //           this.message = "Get User List Successfully !";
  //           this.myGrid.hideloadelement();
  //         },
  //         err =>{ 
  //           console.log(err);
  //           this.hideErrorMessage = false;
  //           this.message="";
  //           this.errorMessage = err.message;
  //           this.myGrid.hideloadelement();       
  //         }
  //       );//End of subscribe()
   }

   getPagingDataFilter(pNumber:number,pSize:number): UserBean[]{
    this.myGrid.showloadelement();
    let result: any[] = [];
    this.adminService.getFilterUserBeanList(pNumber, pSize, this.filterRequest)     
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
    return  this.source.localdata;

    // this.adminService.getPagingUseraccountList(pNumber,pSize)
    //     .subscribe(
    //       (data) => {
    //         this.source.localdata = data;
    //         result = data;
    //         this.myGrid.updatebounddata();
    //         this.hideErrorMessage= true;
    //         this.errorMessage = "";
    //         this.message = "Get User List Successfully !";
    //         this.myGrid.hideloadelement();
    //       },
    //       err =>{ 
    //         console.log(err);
    //         this.hideErrorMessage = false;
    //         this.message="";
    //         this.errorMessage = err.message;
    //         this.myGrid.hideloadelement();       
    //       }
    //     );//End of subscribe()
       
  } 


   sortEvent(event: any){
    // event arguments.
    var args = event.args;
    // sorting information.
    var sortInfo = event.args.sortinformation;
    // sort direction.
    this.sortdirection = sortInfo.sortdirection.ascending ? "asc" : "desc";
    this.sortcolumn = sortInfo.sortcolumn;
    if(this.sortcolumn == null){
       this.sortcolumn = "userName";
       this.sortdirection = "asc";
       this.filterRequest.sortDirection = this.sortdirection;
     }
     else{
       this.source.sortdirection = this.sortdirection;
       this.source.sortcolumn = this.sortcolumn;
       this.filterRequest.sortItem = this.sortcolumn;
       this.filterRequest.sortDirection = this.sortdirection;
     }
    this.getFilterUserBeanList();
    // column data field.
   
   }

   onBtnRemoveFilter(){
    this.myGrid.removefilter('firstName',false);
    this.myGrid.removefilter('lastName',false);
    this.myGrid.removefilter('userName',false);
    this.myGrid.gotopage(0);
    this.doFilter = false;
    this.filterRequest.filterValue="";
    this.filterRequest.filterColumn="";
    this.filterRequest.filterType="";
    this.getPagingData(1,this.pagesize);
    this.getTotalRecords();
   
   }

   configureFilters(type, defaultconditions) {
    if (type == 'stringfilter')
       return ['EQUAL', 'NOT_EQUAL','CONTAINS','DOES_NOT_CONTAIN','STARTS_WITH','ENDS_WITH'];
    }

    // bindingcomplete(event: any){
    //   console.log('data bound');
    //   let localizationObject = {
    //   filterstringcomparisonoperators: ['CONTAINS', 'DOES_NOT_CONTAIN','EQUAL', 'NOT_EQUAL']
    //   };

    //   this.myGrid.localizestrings(localizationObject);
    // }
  

}//End of Class
