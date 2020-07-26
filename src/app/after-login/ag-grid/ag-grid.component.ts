import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions, IDatasource, IGetRowsParams, GridApi } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { map } from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject, combineLatest, merge, of } from "rxjs";
import { EmployeeService } from "../employee.service";
import { Employee } from "../employee";
import { ShareService } from './../../services/share.service';
import { ModelUpdateComponent } from './../model-update/model-update.component';
import { ButtonRendererComponent } from './../../shared/button-renderer/button-renderer.component';
import { ConfirmationDialogComponent } from './../../shared/confirmation-dialog/confirmation-dialog.component';
import { CheckboxCellRendererComponent } from './../../shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { GridHeaderSelectComponent } from './../../shared/grid-header-select/grid-header-select.component';
import { FilterRequest } from './../../shared/filter-request';

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.css']
})
export class AgGridComponent implements OnInit {
  title = 'Angular ag-Grid';
  filterRequest : FilterRequest;
  sortItem = '';
  sortDirection = '';
  filterColumn = '';
  filterValue = '';
  filterType='';
  IsWait = false;
  lastRow: number = -1;
  selectPagingTypes = [{ "text": "infinite","value":false},{ "text": "pagination","value":true}];
  pageSizeList: any = ['10', '20', '50','100'];
  sortByList = [{"text": "Select a Sort Item", "value": ''},
                {"text": "First Name", "value": "firstName"},
                {"text": "Last Name", "value": "lastName"},
                {"text": "Email", "value": "email"}];
  ascDscList = [{"text": "Ascendant", "value": "asc"},
                {"text": "Descendant", "value": "dsc"}];              
  selectedPageSize = 20;
  isPaginnation: boolean = true;
  gridApi: GridApi;
  private rowSelection;

  gridOptions: GridOptions = {
   // pagination: this.isPaginnation,
    angularCompileHeaders: true,
   // angularCompileFilters:true,
    //rowModelType: 'infinite',
    rowModelType: 'infinite',
    cacheBlockSize: this.selectedPageSize,
    paginationPageSize: this.selectedPageSize,
    defaultColDef: {
    flex: 1,
    resizable: true,
    filter: true,
    minWidth: 100,
    /*  headerComponentFramework : <{new():GridHeaderSelectComponent}>GridHeaderSelectComponent,
    headerComponentParams : {
        menuIcon: 'fa-bars'
    } */
    }
  };

  dataSource: IDatasource = {
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

  frameworkComponents: any;
  hideSucceed = true;
  hideError = true;
  message = "";
  errorMessage = "";
  rowHeight$ = new BehaviorSubject(30);
  public modules: any[] = [ClientSideRowModelModule];
  columnDefs = [
        // we put checkbox on the name if we are not doing grouping
     { headerName: ' ',
       field: 'id', 
      // headerCheckboxSelection: true,
       checkboxSelection: true,
       suppressMenu: true,
       suppressSorting: true,
      // headerComponentFramework: 'GridHeaderSelectComponent',
       headerCheckboxSelection: function(params) {
        var displayedColumns = params.columnApi.getAllDisplayedColumns();
        var thisIsFirstColumn = displayedColumns[0] === params.column;
        return thisIsFirstColumn;
       },
    //   headerComponentFramework: 'GridHeaderSelectComponent',
     //  headerCellRenderer: this.selectAllRenderer,
      // cellRenderer: 'checkboxCellRenderer',
       width: 30
      },
     //   { headerName: 'Index', field: 'id', cellRenderer: 'checkboxCellRenderer', width: 30, headerCheckboxSelection: true },
        { headerName: 'First Name', 
          field: 'firstName', 
          sortable:true,
          filter: 'agTextColumnFilter',
          filterParams: {
            filterOptions: ['contains', 'notContains'],
            comparator: function(filter: string, gridValue: any, filterText: string) {
              console.warn('invalid filter type ' + filter + " gridValue="+gridValue);
            }
          }   
        },
        { headerName: 'Last Name', field: 'lastName', sortable:true, filter:true  },
        { headerName: 'Email', field: 'emailId', sortable:true, filter:true  } ,
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
    rowData = [
        /* { name: 'John', title: 'Software Engineer', number: 123456, date: 'March 02, 2016' },
        { name: 'Jane', title: 'Senior Software Engineer', number: 123451, date: 'April 01, 2014' },
        { name: 'Richard', title: 'Software Engineer', number: 123452, date: 'January 02, 2015' },
        { name: 'Janie', title: 'Software Engineer', number: 123453, date: 'March 23, 2016' },
        { name: 'Johnny', title: 'Senior Software Engineer', number: 123454, date: 'September 01, 2017' } */
    ];


  constructor(
              private employeeService: EmployeeService,
              public dialog: MatDialog,
              private modalService: NgbModal,
              private shareService: ShareService    
    ) {
        this.filterRequest = new FilterRequest();
        this.rowSelection = 'multiple';
        this.frameworkComponents = {
        buttonRenderer: ButtonRendererComponent,
        checkboxCellRenderer: CheckboxCellRendererComponent
      }               
  }

  ngOnInit(): void {
     this.employeeService.getEmployeesCount()
    .subscribe(
      data => {
        console.log(data);
        this.lastRow = Number(data);
        this.IsWait=false;
      },
      error => {console.log(error); this.IsWait=false;}
    );
  }

  mySortChangeEvent(params: any){
    this.gridApi = params.api;
    var sortState = this.gridApi.getSortModel();
    if (sortState.length == 0) {
      console.log("No sort active");
      this.filterRequest.sortItem = '';
      this.filterRequest.sortDirection = '';
    } else {
      console.log("State of sorting is:");
      for (var i = 0; i < sortState.length; i++) {
        var item = sortState[i];
        this.filterColumn = item.colId;
        this.filterRequest.sortItem = item.colId;
        this.filterRequest.sortDirection = item.sort;
        console.log(i + " = {colId: " + item.colId + ", sort: " + item.sort + "}");
      }
    }
  }

  myFilterChangedEvent(params: any){
    this.gridApi = params.api;
    //var countryFilterComponent = this.gridApi.getFilterInstance(this.filterColumn);

    var filterInstance = this.gridApi.getFilterInstance(this.filterColumn);
   
// Set the model for the filter
    filterInstance.setModel({
                type: 'endsWith',
                filter: 'g'
    });

// Tell grid to run filter operation again
       this.gridApi.onFilterChanged();

    /* countryFilterComponent.selectNothing();
    countryFilterComponent.selectValue('Ireland');
    countryFilterComponent.selectValue('Great Britain');
    countryFilterComponent.applyModel();
    this.gridApi.onFilterChanged(); */
  }

  onSortByChanged(){
  this.sortItem = (document.getElementById("sort-by") as HTMLTextAreaElement).value;
  
  this.gridApi.onSortChanged();

  }

  reloadData() {
    // this.employees = this.employeeService.getEmployeesList();
   this.IsWait=true;
   this.shareService.targetItem = "/grid";
   this.employeeService.getEmployeesList()
        .subscribe(
          data => {
            console.log(data);
            this.rowData = data;
            this.IsWait=false;
            // let tempArr:Employee[] = Object.values(data) as Employee[];
            // let Obsobj = of(tempArr);
            // this.employees = Obsobj;
          },
          error => {console.log(error); this.IsWait=false;}
        );
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
         // this.employees = this.child.employees;
            this.reloadData();
            console.log(result);
        },
        reason => {}
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
        this.deleteEmployeeByService(e.rowData.id);
      }
    });
   }

   onFilterChanged(params) {
    const filterModel = params.api.getFilterModel();
    if (filterModel) {
      
     //   filter: JSON.stringify(filterModel)
        
    }
  }

  getFiltEmployeeCount(){
  this.employeeService.getFilterEmployeesCount(this.filterRequest).subscribe(
    data => {
      console.log(data);
      this.lastRow = Number(data);
      this.IsWait=false;
    },
    error => {console.log(error); this.IsWait=false;}
   );
  }
/**
   * This is where you call your server,
   * you can pass your start page and end page
   */
  apiService(params: IGetRowsParams) {
    let pageIndex = (params.startRow / this.gridOptions.paginationPageSize) + 1;
    let filterModel =   this.gridApi.getFilterModel();
    if(JSON.stringify(filterModel) != "{}"){
      for (const key in filterModel) {
         this.filterColumn = key;
         let model = filterModel[key];
         this.filterType = model["type"];
         this.filterValue = model["filter"];
         if( this.filterColumn != this.filterRequest.filterColumn ||
             this.filterType !=  this.filterRequest.filterType ||
             this.filterValue != this.filterRequest.filterValue){
             this.filterRequest.filterColumn = key;
             this.filterRequest.filterType = model["type"];
             this.filterRequest.filterValue = model["filter"];  
             pageIndex = 1;
             this.getFiltEmployeeCount();
            }
        
       console.log( "column = " + key + " type="+ this.filterType + " value="+this.filterValue);
      } 
      
      return this.employeeService.getFilterEmployeesList(pageIndex, this.gridOptions.paginationPageSize,this.filterRequest);     
    }
    else{         
         this.filterRequest.filterColumn = '';
         this.filterRequest.filterType = '';
         this.filterRequest.filterValue = ''; 
         if(this.filterRequest.sortItem != ''){
          return this.employeeService.getFilterEmployeesList(pageIndex, this.gridOptions.paginationPageSize,this.filterRequest);     
         }
         return this.employeeService.getPagingEmployeesList(pageIndex, this.gridOptions.paginationPageSize); 
    }
      
  }

  onGridReady(params: any) {
    this.IsWait = true;
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.gridApi.resetRowHeights();
    this.gridApi.setDatasource(this.dataSource)
  }

  switchPaginationType(){
    this.isPaginnation = !this.isPaginnation;
    
  }

  getPaginationPageSize(): number {
    // fallback to return first page size, when grid is loaded from provided array
   // where `gridOption.context` - is custom object that I provide to my ag-grid component wrapper with configuration
    return this.gridApi ? this.gridApi.paginationGetPageSize() : this.pageSizeList[0];
}

setPaginationPageSize(size: number): void {
    this.selectedPageSize = size;
    this.gridOptions.cacheBlockSize = size;
    this.gridOptions.paginationPageSize = size;
    this.gridOptions.api.paginationSetPageSize(size);
   // this.updateGridHeight();
    this.gridApi.onSortChanged();
}

onPageSizeChanged() {

  let size = (document.getElementById("page-size") as HTMLTextAreaElement).value;
  this.gridApi.paginationSetPageSize(Number(size));
  this.selectedPageSize = Number(size);
  this.gridOptions.cacheBlockSize = Number(size);
  this.gridOptions.paginationPageSize = Number(size);
  this.gridOptions.api.paginationSetPageSize(Number(size));
 // this.updateGridHeight();
 
  this.gridApi.onSortChanged();
  this.determineHeight();
}


determineHeight() {
  setTimeout(() => {
    console.log(this.gridApi.getDisplayedRowCount());
    if (this.selectedPageSize < 20) {
      this.gridApi.setDomLayout("autoHeight");
    }
    else {
      this.gridApi.setDomLayout("normal");
      document.getElementById('myGrid').style.height = "656px";
    }
  }, 500);
}
}//end of class AgGridComponent
