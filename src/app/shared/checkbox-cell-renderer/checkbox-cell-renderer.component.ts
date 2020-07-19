import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-checkbox-cell-renderer',
  templateUrl: './checkbox-cell-renderer.component.html',
  styleUrls: ['./checkbox-cell-renderer.component.css']
})
export class CheckboxCellRendererComponent implements ICellRendererAngularComp {

  public params: ICellRendererParams; 

  constructor() { }

  agInit(params: ICellRendererParams): void {
      this.params = params;
  }

  public onChange(event) {
      this.params.data[this.params.colDef.field] = event.currentTarget.checked;
  }

  refresh(params: ICellRendererParams): boolean {
      return true;
  }
}
