import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { TermBean } from './../../domains/term-bean';

@Component({
  selector: 'app-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.css']
})
export class MethodComponent implements OnInit, AfterViewInit {
  @ViewChild('myGrid') myGrid: jqxGridComponent;
  termBean: TermBean =  new TermBean();

  source: any = {
    localdata: null,
    datafields: [
      { name: 'name', type: 'string' },
      { name: 'type', type: 'string' },
      { name: 'calories', type: 'int' },
      { name: 'totalfat', type: 'string' },
      { name: 'protein', type: 'string' }
    ],
    datatype: 'json',
    sort: (column, direction) => {
      this.sortData(column, direction);
    }
  };

  constructor() { 
    this.termBean.term = 1;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
 
  }

 

  sortData(column, direction) {
      this.myGrid.showloadelement();
   
  /*     this.dataService.sortData({ column, direction })
        .subscribe((data) => {
          this.source.localdata = data;
          this.myGrid.updatebounddata('sort');
          this.myGrid.hideloadelement();
        }); */
    }


}
