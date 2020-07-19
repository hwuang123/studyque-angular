import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerOverlayService } from './../spinner-overlay.service';
import { SpinnerOverlayComponent } from './spinner-overlay.component';
import { SpinnerModule } from './../../spinner/spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    SpinnerModule
  ],
  declarations: [SpinnerOverlayComponent],
  entryComponents: [SpinnerOverlayComponent],
  providers: [SpinnerOverlayService],
  exports: [SpinnerOverlayComponent]
})
export class SpinnerOverlayModule { }
