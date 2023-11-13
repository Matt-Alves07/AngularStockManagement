import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

//PRIME NG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogService } from 'primeng/dynamicdialog';

//COMPONENTS
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';

@NgModule({
  declarations: [
    ToolbarNavigationComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    //PRIMENG
    CardModule,
    ButtonModule,
    ToolbarModule,
  ],
  exports: [
    ToolbarNavigationComponent
  ],
  providers: [
    CurrencyPipe,
    DialogService,
  ]
})
export class SharedModule { }
