import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();

  isAuthenticated: boolean = false
  authSubscription: Subscription | undefined

  constructor(private authService: AuthService) {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuthenticated = authStatus
    })
   }

  ngOnInit() {
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.authService.logout()
    this.onClose()
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe()
  }
}
