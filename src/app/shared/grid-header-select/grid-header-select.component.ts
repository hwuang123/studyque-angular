import { Component, OnInit } from '@angular/core';
import { IHeaderAngularComp } from "ag-grid-angular";
import { IHeaderParams } from "ag-grid/main";

@Component({
  selector: 'app-grid-header-select',
  templateUrl: './grid-header-select.component.html',
  styleUrls: ['./grid-header-select.component.css']
})
export class GridHeaderSelectComponent implements IHeaderAngularComp {
  agInit(params: import("ag-grid-community").IHeaderParams): void {
    throw new Error("Method not implemented.");
  }
  afterGuiAttached?(params?: import("ag-grid-community").IAfterGuiAttachedParams): void {
    throw new Error("Method not implemented.");
  }
  private params: any;
  private selectAll: boolean = false;

  //------------------------------------------------------------------------------
  ngOnInit(headerParams: IHeaderParams): void {
    console.log(`Init HeaderComponent`);

    this.params = headerParams;

    var rowCount = this.params.api.getDisplayedRowCount();
    var lastGridIndex = rowCount - 1;
    var currentPage = this.params.api.paginationGetCurrentPage();
    var pageSize = this.params.api.paginationGetPageSize();
    var startPageIndex = currentPage * pageSize;
    var endPageIndex = (currentPage + 1) * pageSize - 1;

    if (endPageIndex > lastGridIndex) {
      endPageIndex = lastGridIndex;
    }

    //Count selected rows
    var cptSelected = 0;
    for (var i = startPageIndex; i <= endPageIndex; i++) {
      var rowNode = this.params.api.getDisplayedRowAtIndex(i);
      cptSelected += rowNode.selected ? 1 : 0;
    }

    //Check the checkbox if all the rows are selected
    var cptRows = endPageIndex + 1 - startPageIndex;
    this.selectAll = cptSelected && cptRows <= cptSelected;
  }

  ngOnDestroy() {
    console.log(`Destroying HeaderComponent`);
  }
  //------------------------------------------------------------------------------
  private onCheckboxClick(): void {
    console.log("onCheckboxClick()");

    var rowCount = this.params.api.getDisplayedRowCount();
    var lastGridIndex = rowCount - 1;
    var currentPage = this.params.api.paginationGetCurrentPage();
    var pageSize = this.params.api.paginationGetPageSize();
    var startPageIndex = currentPage * pageSize;
    var endPageIndex = (currentPage + 1) * pageSize - 1;

    if (endPageIndex > lastGridIndex) {
      endPageIndex = lastGridIndex;
    }

    this.selectAll = !this.selectAll;

    for (var i = startPageIndex; i <= endPageIndex; i++) {
      var rowNode = this.params.api.getDisplayedRowAtIndex(i);
      rowNode.setSelected(this.selectAll);
    }
  }
  //------------------------------------------------------------------------------
}
