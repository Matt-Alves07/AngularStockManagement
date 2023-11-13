import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
})
export class ToolbarNavigationComponent {
  constructor(
    private cookie: CookieService,
    private router: Router
  ) {}

  handleLogoff(): void {
    this.cookie.delete('token');
    void this.router.navigate(['/home']);
  }
}
