import { Component, OnInit } from '@angular/core';
import { ShareService } from './../services/share.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  constructor(private shareService: ShareService) { }

  ngOnInit(): void {
  }

  showLogout(){
    this.shareService.displayLogout = true;
  }
}
