import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
//import * as moment from 'moment';
import { ShareService } from './../../services/share.service';
import { AdminService } from './../../services/admin.service';
import { AddClassService } from './../../services/add-class.service';
import { AlertService } from './../../services/alert.service';
import { EditUseraccountComponent } from './../../modal/edit-useraccount/edit-useraccount.component';
import { UserBean } from './../../domains/user-bean.bean';
import { ClassName } from './../../domains/class-name';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { DisplayDetailComponent } from './../../modal/display-detail/display-detail.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit, AfterViewInit  {
  userBean: UserBean =  new UserBean();
  pageSizeList: any = ['10', '20', '50','100'];
  selectedPageSize = 20;
  selectDetailType: any;
  prvSelectDetailType: any;
  displayOptions: any[];

  @ViewChild('myGrid') myGrid: jqxGridComponent;
  //@ViewChild('f') classForm: NgForm;
  hideErrorMessage: boolean = true;
  expandRows: boolean[];
  expandRowIndexs: number[]=[];
  errorMessage: string = "";
  message: string = "";
  gridInstance: any;
 /*  detailsource =
  {
    datatype: "array",
    datafields: [
      { name: 'value',type: 'string'},
      { name: 'label',type: 'string'}
    ],
    localdata: [
      {
        "value":"Alert",
        "label":"Alert"        
      },
      {
        "value":"Assignment",
        "label":"Assignment"        
      },
      {
        "value":"Classes",
        "label":"Classes"        
      },
      {
        "value":"Contact",
        "label":"Contact"        
      },
      {
        "value":"Guardian",
        "label":"Guardian"        
      }   
    ]
  };
  detailAdapter: any = new jqx.dataAdapter(this.detailsource, { autoBind : true }); */
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
   //     { name: 'detail', value: 'detail'}
    ],
    id: "pkStudentId",
    datatype: 'json'
};
renderer = (row: number, column: any, value: string): string => {
  return '<span style="margin-left: 4px; margin-top: 9px; float: left;">' + value + '</span>';
}
dataAdapter: any = new jqx.dataAdapter(this.source);

columns: any[] = [
  { text: 'User Name', datafield: 'userName', width: 100, editable: false, cellsrenderer: this.renderer },
  { text: 'First Name', datafield: 'firstName', width: 100, editable: false, cellsrenderer: this.renderer },
  { text: 'Last Name', datafield: 'lastName', width: 100, editable: false, cellsrenderer: this.renderer },
  { text: 'Gender', datafield: 'gender', width: 100, editable: false, cellsrenderer: this.renderer },
  { text: 'Age', datafield: 'age', width: 100,  editable: false,cellsrenderer: this.renderer },
  { text: 'Major', datafield: 'major', width: 200,  editable: false, cellsrenderer: this.renderer },
  { text: 'Expired Ddate', datafield: 'expiredDate', width: 100,  editable: false, cellsformat: 'MM/dd/yyyy' },
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
   /*{
    text: 'Show Detail',
    width: 150,
    columntype: "dropdownlist",
    datafield: 'detail', 
    initeditor: function (row, cellvalue, editor, celltext, cellwidth, cellheight) {
      let detailSource = [
        {
          "value":"Alert",
          "label":"Alert"        
        },
        {
          "value":"Assignment",
          "label":"Assignment"        
        },
        {
          "value":"Classes",
          "label":"Classes"        
        },
        {
          "value":"Contact",
          "label":"Contact"        
        },
        {
          "value":"Guardian",
          "label":"Guardian"        
        }   
      ];
      editor.jqxDropDownList({ source: detailSource, displayMember: 'value', valueMember: 'label', placeHolder:'Please Select'  } );

     
    },
    cellsrenderer: () => {
      return 'Click Here...';
    },
    createeditor: function (row, column, editor){
      editor.bind("select", function (event){
        let selectedIndex = event.args.index + 1;

      });
    },
    geteditorvalue: function (row, cellValue, editor) {
       return editor.val();
      },
    cellvaluechanging: function (row, column, columntype, oldvalue, newvalue) {
    
      if (newvalue == "") return oldvalue;     
   //   alert(row);    
   //   $("#jqxgrid").on('cellselect', function (event) {
   //     var column = $("#jqxgrid").jqxGrid('getcolumn', event.args.datafield);
   //     var value = $("#jqxgrid").jqxGrid('getcellvalue', event.args.rowindex, column.datafield);
    //    var displayValue = $("#jqxgrid").jqxGrid('getcellvalue', event.args.rowindex, column.displayfield);

  //      $("#eventLog").html("<div>Selected Cell<br/>Row: " + event.args.rowindex + ", Column: " + column.text + ", Value: " + value + ", Label: " + displayValue + "</div>");
   //   }); 


  }
   } */
   
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
    private addClassService: AddClassService,
    private alertService: AlertService
    ) { }

  ngOnInit(): void {
    this.displayOptions = this.shareService.displayOptios;
  //  this.detailsource.localdata=this.displayOptions;
    this.selectDetailType = "Alert";
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

  }//getAssignmentListById

  getContactListById(nestedGridContainer: any,pkStudentId: number){

  }//getContactListById

  getGuardianListById(nestedGridContainer: any,pkStudentId: number){

  }//getContactListById

  selectDetailHandler(event: any){
  //  this.selectDetailType = event.target.value;
    this.collapseAll(0);
  }
  onPageSizeChanged(){
    
  }
}//End of class
