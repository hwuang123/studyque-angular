import { Component, OnInit, Input } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { AuthService } from './../services/auth.service';
import { TokenStorageService } from './../services/token-storage.service';
import { ShareService } from './../services/share.service';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showLogout: boolean = false;
  showNavBar: boolean = false;
  navbarOpen = false;
  showLeaves: boolean =true;
  username: any;
  list:any;
  selected :any;
  hasAdminRole: boolean= false;
  hasDeveloperRole: boolean= false;
  constructor(private router: Router,
    private authService: AuthService, 
    private tokenStorage: TokenStorageService,
    private shareService: ShareService
    ) { 
      this.list = [
        'Home',
        'Employee'
     ]; 
    } 

  ngOnInit(): void {
   // this.shareService.stopDisplayLogout();
   this.shareService.currentDisplayLogoutStatus.subscribe(showLogout => this.showLogout = showLogout);
   this.shareService.currentLoginStatus.subscribe( loginStatus => this.showNavBar = loginStatus);
   this.shareService.currentUserName.subscribe( username => this.username = username);
   this.shareService.currentHasAdminRole.subscribe(hasAdminRole =>this.hasAdminRole = hasAdminRole);
   this.shareService.currentHasDeveloperRole.subscribe(hasDeveloperRole =>this.hasDeveloperRole = hasDeveloperRole);
  }

  displayLogout($event){
    this.showLogout = $event
  }

  clickLogout(){
    this.shareService.displayLogout = false;
    this.showLogout = this.shareService.displayLogout;
    this.username = "";
    this.shareService.currentUserName = this.username;
    this.tokenStorage.signOut();
    this.router.navigateByUrl('welcome');
  }

  select(item) {
    this.selected = item; 
  };

  isActive(item) {
    return this.selected === item;
  };

  getClass() {
    return "active"
  }
  
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  getAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  toggleShowLeaves(item: string){
    this.showLeaves = false;
   }
}
