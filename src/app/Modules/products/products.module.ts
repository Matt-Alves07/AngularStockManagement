import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PRODUCTS_ROUTES } from './products.routing';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsHomeComponent } from './page/products-home/products-home.component';

//PRIMENG
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ProductsTableComponent } from './components/products-table/products-table.component';

@NgModule({
  declarations: [
    ProductsHomeComponent,
    ProductsTableComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(PRODUCTS_ROUTES),

    //PRIMENG
    CardModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    DropdownModule,
    InputMaskModule,
    InputTextModule,
    InputSwitchModule,
    InputNumberModule,
    DynamicDialogModule,
    InputTextareaModule,
    ConfirmDialogModule,
  ],
  providers: [
    DialogService,
    ConfirmationService,
  ]
})
export class ProductsModule { }
