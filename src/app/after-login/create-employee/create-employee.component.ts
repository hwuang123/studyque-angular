import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  employee: Employee = new Employee();
  submitted = false;

  constructor(private employeeService: EmployeeService,
    private router: Router) { }

  ngOnInit(): void {
  }

  newEmployee(): void {
    this.submitted = false;
    this.employee = new Employee();
  }

  createEmployees(){
    for (let i = 19; i < 115; i++) {
      console.log ("Block statement execution no." + i);
      this.employee = new Employee();
      this.employee.firstName= "First"+i;
      this.employee.lastName="Last"+i;
      this.employee.emailId="fl"+i+"@yahoo.com";
      this.employeeService.createEmployee(this.employee).subscribe(
        data =>{console.log(data)},
        error =>console.log(error)
      ); 
    }
  }

  save() {
    this.employeeService.createEmployee(this.employee)
      .subscribe(data =>{ 
        console.log(data);
        this.employee = new Employee();       
        this.gotoList();
      }, error => console.log(error));
    // this.employee = new Employee();
    // this.gotoList();
  }

  onSubmit() {
    this.submitted = true;
    this.save();    
  }

  gotoList() {
    this.router.navigate(['/employees']);
  }

}
