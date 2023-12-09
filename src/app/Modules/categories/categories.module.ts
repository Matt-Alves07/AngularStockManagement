import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//CATEGORIES COMPONENTS AND ROUTING
import { CATEGORIES_ROUTES } from './categories.routing';
import { CategoriesHomeComponent } from './pages/categories-home/categories-home.component';

//PRIME NG MODULES
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService } from 'primeng/api';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [ CategoriesHomeComponent ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(CATEGORIES_ROUTES),

    //PRIME NG
    CardModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    InputMaskModule,
    InputTextModule,
    DropdownModule,
    InputSwitchModule,
    InputNumberModule,
    InputTextareaModule,
    DynamicDialogModule,
    ConfirmDialogModule,
  ],
  providers: [ DialogService, ConfirmationService ]
})
export class CategoriesModule { }
