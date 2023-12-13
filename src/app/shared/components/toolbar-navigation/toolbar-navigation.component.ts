import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductFormComponent } from 'src/app/Modules/products/components/product-form/product-form.component';
import { ProductEvent } from 'src/app/Models/enums/products/product-event';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
})
export class ToolbarNavigationComponent {
  private SALE_PRODUCT_EVENT = ProductEvent.SALE_PRODUCT_EVENT;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private dialog: DialogService,
  ) {}

  handleLogoff(): void {
    this.cookie.delete('token');
    void this.router.navigate(['/home']);
  }

  handleProductSale(): void {
    this.dialog.open(
      ProductFormComponent,
      {
        width: '70%',
        height: '40%',
        baseZIndex: 10000,
        maximizable: true,
        contentStyle: { overflow: 'auto' },
        header: this.SALE_PRODUCT_EVENT,
        data: {
          event: { action: this.SALE_PRODUCT_EVENT }
        }
      }
    )
  }
}
