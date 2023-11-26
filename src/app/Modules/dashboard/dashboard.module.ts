import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DASHBOARD_ROUTES } from './dashboard.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';

/*PRIME NG*/
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { CookieService } from 'ngx-cookie-service';
import { ChartModule } from 'primeng/chart';
import { Card, CardModule } from 'primeng/card';

@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
  imports: [
    CardModule,
    FormsModule,
    ToastModule,
    ChartModule,
    CommonModule,
    ButtonModule,
    SharedModule,
    SidebarModule,
    ToolbarModule,
    ReactiveFormsModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
  ],
  providers: [ CookieService, MessageService],
})
export class DashboardModule { }
