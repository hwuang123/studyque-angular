import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'datetimeFilter'
})
export class DatetimeFilterPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(value: any, format?: string): any {
    if (!value) {
      return '';
    }
    format = format || 'short';
    let v1 = value;
    let v2 = this.datePipe.transform(v1, format);
    console.log(v2);
    return value && typeof(value) === 'object' ? this.datePipe.transform(value, format) : '';


  }

}
