import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './auth/home/home.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmployeeListComponent } from './after-login/employee-list/employee-list.component';
import { CreateEmployeeComponent } from './after-login/create-employee/create-employee.component';
import { UpdateEmployeeComponent } from './after-login/update-employee/update-employee.component';
import { EmployeeDetailsComponent } from './after-login/employee-details/employee-details.component';
import { AgGridComponent } from './after-login/ag-grid/ag-grid.component';
import { PlaceOrderComponent } from './before-login/place-order/place-order.component';
import { AddClassesComponent } from './after-login/add-classes/add-classes.component';
import { AssignmentTypeComponent } from './after-login/assignment-type/assignment-type.component';
import { AssignmentComponent } from './after-login/assignment/assignment.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'welcome', component: WelcomePageComponent},
  { path: 'home', component: HomeComponent},
  { path: 'employees', component: EmployeeListComponent },
  { path: 'add', component: CreateEmployeeComponent },
  { path: 'update/:id', component: UpdateEmployeeComponent },
  { path: 'details/:id', component: EmployeeDetailsComponent },
  { path: 'grid', component: AgGridComponent},
  { path: 'userprofile', component: PlaceOrderComponent},
  { path: 'addclasses', component: AddClassesComponent},
  { path: 'assignmenttype', component: AssignmentTypeComponent},
  { path: 'assignment', component: AssignmentComponent},
  {path: '',  redirectTo: '/welcome', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
