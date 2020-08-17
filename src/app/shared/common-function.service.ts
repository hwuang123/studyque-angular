import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {

  constructor() { }

  validateDateRange( startDate: Date, endDate: Date){

    if(startDate == null || endDate ==null){
      return { error: true,
               errorMessage: 'Start date and end date are required.'
      }     
    }

    if(startDate != null && endDate !=null) {
      if(startDate > endDate){
        return { error: true,
          errorMessage: 'End date should be grater then start date.'
        }     
      }
    }
    return { error: false, errorMessage: ""};
  }

  validateTimeRange( startTime: any, endTime: any){

    if(startTime == null || endTime ==null){
      return { error: true,
               errorMessage: 'Start date and end date are required.'
             }     
    }

    if(startTime != null && endTime !=null) {
      let strdate = '01/01/1970 ' + startTime +':00';
      let enddate = '01/01/1970 ' + endTime +':00';
      if(Date.parse(strdate) > Date.parse(enddate)){
        return { error: true,
                 errorMessage: 'End time should be grater then start time.'
        }     
      }
    }
    return { error: false, errorMessage: ""};
  }

}
