import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { Module } from '@ag-grid-enterprise/all-modules';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions, IDatasource, IGetRowsParams, GridApi } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject, ReplaySubject, combineLatest, merge, of } from "rxjs";
/*import { MasterDetailModule } from '@ag-grid-enterprise/master-detail';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export'; */
import { ModelUpdateComponent } from '../model-update/model-update.component';
import { Assignment } from './../../domains/assignment';
import { AssignmentType } from './../../domains/assignment-type';
import { ClassName } from './../../domains/class-name';
import { ClassdayOfWeek } from './../../domains/classday-of-week';
import { StudentBean } from './../../domains/student-bean';
import { ShareService } from './../../services/share.service';
import { AddClassService } from './../../services/add-class.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ButtonRendererComponent } from 'src/app/shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';




@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.component.html',
  styleUrls: ['./add-classes.component.css']
})
export class AddClassesComponent implements OnInit {
  private gridApi;
  private gridColumnApi;
  frameworkComponents: any;
  public modules: any[] = [
    ClientSideRowModelModule
  /*  MasterDetailModule,
    MenuModule,
    ColumnsToolPanelModule,
    ClipboardModule,
    ExcelExportModule,*/
  ]; 
  columnDefs = [
    {
      headerName: 'Class Name',
      field: 'classname',
      cellRenderer: 'agGroupCellRenderer',
    },
    { headerName: 'Class Type',
      field: 'classtype' },
    { headerName: 'Instructor',
      field: 'instructor' },
    { headerName: 'Class Room',
      field: 'classroom' },
    { headerName: 'Academic Term',
      field: 'semester' },
    { headerName: 'Academic Start Date',
      field: 'semStartDate' },
    { headerName: 'Academic End Date',
      field: 'semEndDate' },  
    {
        headerName: 'Update',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onBtnClickUpdate.bind(this),
          label: 'update'
        },
        width: 90,
        minWidth:80,
        maxWidth: 100
    },  
    {
        headerName: 'Delete',
        cellRenderer: 'buttonRenderer',
        cellRendererParams: {
          onClick: this.onBtnClickDelete.bind(this),
          label: 'delete'
        },
        width: 90,
        minWidth:80,
        maxWidth: 100
    }     
  ];
  defaultColDef = {
    flex: 1,
    sortable: true,
    filter: true,
  };
  private detailCellRendererParams;
  private defaultExportParams;
  private excelStyles;
  private rowData = [];
 /*  private rowData = [
    {
    classname:"Math",
    classtype:"high school",
    semester:"Semaster",
    instructor:"John Lee"  
    },
    {
    classname:"English",
    classtype:"high school",
    semester:"Semester",
    instructor:"Smith Dennis"
    }
  ]; */
  /* private rowData = [
    {"pkClsnmId":0,
   // "studentBean":{"title":null,"gender":"M","age":"19","firstName":"Steve","middleName":null,"lastName":"Hwuang","major":"CS","email":null,"confirmEmail":null,"homePhone":null,"cellPhone":null,"address":null,"city":null,"state":null,"zip":null},
    "classname":"Math",
    "classtype":"high school",
    "semester":"Semaster",
    "instructor":"John Lee",
    "classroom":"201",
    "semStartDate":null,
    "semEndDate":null,
    "description":"Math class",
    "errorMessage":null,
    "message":null,
   // "classdayOfweek":[]
    },
    {"pkClsnmId":0,
   // "studentBean":{"title":null,"gender":"M","age":"19","firstName":"Steve","middleName":null,"lastName":"Hwuang","major":"CS","email":null,"confirmEmail":null,"homePhone":null,"cellPhone":null,"address":null,"city":null,"state":null,"zip":null},
    "classname":"English",
    "classtype":"high school",
    "semester":"Semester",
    "instructor":"Smith Dennis",
    "classroom":"119",
    "semStartDate":null,
    "semEndDate":null,
    "description":"English one class",
    "errorMessage":null,
    "message":null,
  //  "classdayOfweek":[]
  }
  ]; */

  assignment: Assignment;
  assignmentType: AssignmentType;
  className: ClassName;
  classdayOfWeek: ClassdayOfWeek;
  academicTerms = [];
  hideSucceed = true;
  hideError = true;
  errorMessage = '';
  message= '';
  hideMessage = true;
  hideErrorMessage = true; 
  IsWait = false;
   
 /*  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
    this.apiService(params).subscribe(data => {
      params.successCallback(
        data,
        this.lastRow
      );
      this.IsWait = false;
    })
  }
}
 */

  constructor(private router: Router,
    private shareService: ShareService,
    public dialog: MatDialog,
    private modalService: NgbModal,
    private addClassService: AddClassService) { 

    
     

      this.detailCellRendererParams = {
        detailGridOptions: {
          columnDefs: [
            { headerName: 'Day of Week',
              field: 'weekday' },
            { headerName: 'Class Start Time',
              field: 'starttime',
              minWidth: 150, },
            { headerName: 'Class End Time',
              field: 'endtime',
              minWidth: 150, },
            /* {
              field: 'duration',
              valueFormatter: "x.toLocaleString() + 's'",
            }, */
           
          ],
          defaultColDef: {
            flex: 1,
            filter: true,
          },
        },
        getDetailRowData: function(params) {
          params.successCallback(params.data.classdayOfweek);
        },
      };

      this.frameworkComponents = {
        buttonRenderer: ButtonRendererComponent,
        checkboxCellRenderer: CheckboxCellRendererComponent
      }               
    }

  ngOnInit(): void {
    this.assignment = new Assignment();
    this.assignmentType = new AssignmentType();
    this.assignmentType.studernt = new StudentBean();
    this.className = new ClassName();
    this.className.classdayOfweek = new Array<ClassdayOfWeek>();
    this.className.classdayOfweek = null;
    this.className.student = new StudentBean();
    this.classdayOfWeek = new ClassdayOfWeek();
   // this.classdayOfWeek.classname = this.className;
    this.academicTerms = this.shareService.academicTerms;

  }

  saveClassName(){
    this.addClassService.saveClassName(this.className)
    .subscribe((data: ClassName) => {
      console.log(data);
      if(data.errorMessage){
         this.hideErrorMessage = false;
         this.hideMessage = true;
         this.className.errorMessage = data.errorMessage;
         this.errorMessage = data.errorMessage;
      }
      else{
         this.hideErrorMessage = true;      
         this.className.message = data.message;
         this.message = data.message;
         this.hideMessage = false;
      }
      
    },
     err =>{ 
       console.log(err);
       this.hideErrorMessage = false;
       this.hideMessage = false;
       this.errorMessage = err.error.errorMessage;        
    }
     
     ); 
  }

  onSubmit(): void{
  
    this.saveClassName();
 }

 onBtnClickUpdate(e) {
  const modalRef = this.modalService.open(ModelUpdateComponent, {
    // scrollable: true,
    //windowClass: 'md-Class',
    // keyboard: false,
    // backdrop: 'static'
     // size: 'xl',
     // windowClass: 'modal-xxl', 
     // size: 'lg'
   });
  modalRef.componentInstance.fromParent = e.rowData.id;
  modalRef.result.then(
      result => {
          this.reloadData();
          console.log(result);
      },
      reason => {}
  );
}

deleteClassNameByService(id: number){
  this.IsWait=true;
  this.addClassService.deleteClassName(id)
    .subscribe(
      data => {
        console.log(data);

        this.message = "Succefully deleted clssname with ID " + id;
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

onBtnClickDelete(e) {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '490px',
    height: "160px",
    panelClass: 'mat-dialog-container',
    data: "Do you confirm the deletion of the employee with ID " + e.rowData.id +" ?"
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result) {
      console.log('Yes clicked');
      // DO SOMETHING
      this.deleteClassNameByService(e.rowData.id);
    }
  });
 }

 onGridReady(params: any) {
  this.IsWait = true;
  this.gridApi = params.api;
  this.gridApi.sizeColumnsToFit();
  this.gridApi.resetRowHeights();
  this.gridApi = params.api;
  this.gridColumnApi = params.columnApi;

 this.reloadData();
}

reloadData() {
  // this.employees = this.employeeService.getEmployeesList();
 this.IsWait=true;
 this.shareService.targetItem = "/grid";
 this.addClassService.getClassNameList()
      .subscribe(
        data => {
          console.log(data);
          console.log(JSON.stringify(data));
          this.rowData = data;
          this.IsWait=false;
      
        },
        error => {console.log(error); this.IsWait=false;}
      );
}

onFirstDataRendered(params) {
  setTimeout(function() {
    params.api.getDisplayedRowAtIndex(1).setExpanded(true);
  }, 0);
}


}
