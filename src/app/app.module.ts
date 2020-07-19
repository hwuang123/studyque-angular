import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridComponent } from './after-login/ag-grid/ag-grid.component';
import { ButtonRendererComponent } from './shared/button-renderer/button-renderer.component';
import { CheckboxCellRendererComponent } from './shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { GridHeaderSelectComponent } from './shared/grid-header-select/grid-header-select.component';
import { PlaceOrderComponent } from './before-login/place-order/place-order.component';
import { AddClassesComponent } from './after-login/add-classes/add-classes.component';

@NgModule({
  declarations: [
    AppComponent,
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
    ButtonRendererComponent,
    CheckboxCellRendererComponent,
    GridHeaderSelectComponent,
    PlaceOrderComponent,
    AddClassesComponent

  ],
  imports: [
    NgbModule,
    BrowserModule,
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
    AppRoutingModule 

  ],
  entryComponents: [
    ConfirmationDialogComponent,
    GridHeaderSelectComponent
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingScreenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
  exports: [
    MatButtonModule, MatDialogModule,DragDropModule
  ] 
})
export class AppModule { }
