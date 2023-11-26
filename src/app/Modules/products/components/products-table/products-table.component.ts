import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GetAllProductsResponse } from 'src/app/Models/Interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  @Input() products: Array<GetAllProductsResponse> = [];

  public selectedProduct!: GetAllProductsResponse;

  constructor(
    private messageService: MessageService,
  ) {}

  handleAddProductEvent() {
    this.messageService.add({
      life: 5000,
      severity: 'success',
      summary: 'Gotcha bitch'
    });
  }

  handleEditProductEvent(){
    this.messageService.add({
      life: 5000,
      severity: 'warn',
      summary: 'Not available to edit, yet'
    });
  }

  handleDeleteProductEvent(){
    this.messageService.add({
      life: 5000,
      severity: 'error',
      summary: 'Hold your horses, boy'
    });
  }
}
