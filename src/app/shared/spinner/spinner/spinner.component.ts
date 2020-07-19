import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { LoadingScreenService } from './../../../services/loading-screen/loading-screen.service';
import { Subscription } from "rxjs";
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit, OnDestroy {
  @Input() message = '';
  loading: boolean = false;
  // loading: boolean = true;
  loadingSubscription: Subscription;
  constructor(private loadingScreenService: LoadingScreenService) { }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadingSubscription = this.loadingScreenService.loadingStatus.pipe(
      debounceTime(200)
    ).subscribe((value) => {
      this.loading = value;
    });
    // this.loadingSubscription = this.loadingScreenService.loadingStatus.subscribe((value) => {
    //   this.loading = value;
    // });
  }

}
