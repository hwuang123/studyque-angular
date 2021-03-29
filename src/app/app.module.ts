import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DateValueAccessorModule } from 'angular-date-value-accessor';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgGridModule } from 'ag-grid-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library as fontLibrary } from '@fortawesome/fontawesome-svg-core';
import { faCalendar,  faClock } from '@fortawesome/free-regular-svg-icons';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { jqxBarGaugeModule }    from 'jqwidgets-ng/jqxbargauge';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { jqxListBoxModule } from 'jqwidgets-ng/jqxlistbox';
import { jqxTextAreaModule } from 'jqwidgets-ng/jqxtextarea';
import { jqxDragDropModule } from 'jqwidgets-ng/jqxdragdrop';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { HomeComponent } from './auth/home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SpinnerModule } from './shared/spinner/spinner/spinner.module';
import { SpinnerOverlayModule } from './shared/spinner-overlay/spinner-overlay/spinner-overlay.module';
import { CreateEmployeeComponent } from './after-login/create-employee/create-employee.component';
import { EmployeeDetailsComponent } from './after-login/employee-details/employee-details.component';
import { EmployeeListComponent } from './after-login/employee-list/employee-list.component';
import { UpdateEmployeeComponent } from './after-login/update-employee/update-employee.component';
import { ModelUpdateComponent } from './after-login/model-update/model-update.component';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { LoadingScreenInterceptor } from './interceptors/loading-screen.interceptor';
import { AgGridComponent } from './after-login/ag-grid/ag-grid.component';
import { ButtonRendererComponent } from './shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from './shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { GridHeaderSelectComponent } from './shared/grid-header-select/grid-header-select.component';
import { PlaceOrderComponent } from './before-login/place-order/place-order.component';
import { AddClassesComponent } from './after-login/add-classes/add-classes.component';
import { AddClassScheduleComponent } from './modal/add-class-schedule/add-class-schedule.component';
import { AssignmentTypeComponent } from './after-login/assignment-type/assignment-type.component';
import { AssignmentComponent } from './after-login/assignment/assignment.component';
import { DisplayAssignmentsComponent } from './after-login/display-assignments/display-assignments.component';
import { GuardianComponent } from './after-login/guardian/guardian.component';
import { AlertComponent } from './after-login/alert/alert.component';
import { DateTimePickerComponent } from './model/date-time-picker/date-time-picker.component';
import { SelectZeroValidatorDirective } from './directive/select-zero-validator.directive';
import { DatetimeFilterPipe } from './shared/datetime-filter.pipe';
import { ProfileComponent } from './after-login/profile/profile.component';
import { UpdatePasswordComponent } from './after-login/update-password/update-password.component';
import { EqualValidatorDirective } from './directive/equal-validator.directive';
import { MethodComponent } from './admin/method/method.component';
import { TermComponent } from './admin/term/term.component';
import { AddTermComponent } from './modal/add-term/add-term.component';
import { AddMethodComponent } from './modal/add-method/add-method.component';
import { PrivilegeComponent } from './admin/privilege/privilege.component';
import { RoleComponent } from './admin/role/role.component';
import { RolePrivilegeComponent } from './admin/role-privilege/role-privilege.component';
import { UserRoleComponent } from './admin/user-role/user-role.component';
import { AddPrivilegeComponent } from './modal/add-privilege/add-privilege.component';
import { AddRoleComponent } from './modal/add-role/add-role.component';
import { StatusComponent } from './admin/status/status.component';
import { AddStatusComponent } from './modal/add-status/add-status.component';
import { ManageUserComponent } from './admin/manage-user/manage-user.component';
import { EditUseraccountComponent } from './modal/edit-useraccount/edit-useraccount.component';


fontLibrary.add(
  faCalendar,
  faClock
);

@NgModule({
  declarations: [
    AppComponent,
    ButtonRendererComponent,
    LoginComponent,
    WelcomePageComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    CreateEmployeeComponent,
    EmployeeDetailsComponent,
    EmployeeListComponent,
    UpdateEmployeeComponent,
    ModelUpdateComponent,
    ConfirmationDialogComponent,
    AgGridComponent,
    CheckboxCellRendererComponent,
    GridHeaderSelectComponent,
    PlaceOrderComponent,
    AddClassesComponent,
    AddClassScheduleComponent,
    AssignmentTypeComponent,
    AssignmentComponent,
    DisplayAssignmentsComponent,
    GuardianComponent,
    AlertComponent,
    DateTimePickerComponent,
    SelectZeroValidatorDirective,
    DatetimeFilterPipe,
    ProfileComponent,
    UpdatePasswordComponent,
    EqualValidatorDirective,
    MethodComponent,
    TermComponent,
    jqxGridComponent,
    AddTermComponent,
    AddMethodComponent,
    PrivilegeComponent,
    RoleComponent,
    RolePrivilegeComponent,
    UserRoleComponent,
    AddPrivilegeComponent,
    AddRoleComponent,
    StatusComponent,
    AddStatusComponent,
    ManageUserComponent,
    EditUseraccountComponent

  ],
  imports: [
    NgbModule,
    NgxMaterialTimepickerModule,
    DateValueAccessorModule,
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SpinnerModule,
    SpinnerOverlayModule,
    MatIconModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule, 
    MatCardModule,
    MatDialogModule,
    AgGridModule.withComponents([ButtonRendererComponent,CheckboxCellRendererComponent,GridHeaderSelectComponent]),
    AppRoutingModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    jqxBarGaugeModule,
    jqxListBoxModule, 
    jqxTextAreaModule, 
    jqxDragDropModule 
  ],
  entryComponents: [
    ConfirmationDialogComponent,
    GridHeaderSelectComponent
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingScreenInterceptor,
    multi: true
  },
  DatePipe],
  bootstrap: [AppComponent],
  exports: [
    MatButtonModule, MatDialogModule,DragDropModule
  ] 
})
export class AppModule {
  }
