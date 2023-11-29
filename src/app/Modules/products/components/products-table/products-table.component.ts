import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DeleteProductAction } from 'src/app/Models/Interfaces/products/event/delete-product-action';
import { EventAction } from 'src/app/Models/Interfaces/products/event/event-action';
import { GetAllProductsResponse } from 'src/app/Models/Interfaces/products/response/GetAllProductsResponse';
import { ProductEvent } from 'src/app/Models/enums/products/product-event';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent {
  @Input() products: Array<GetAllProductsResponse> = [];

  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>();

  public selectedProduct!: GetAllProductsResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;

  constructor(
    private messageService: MessageService,
  ) {}

  handleProductEvent(action: string, id?: string): void {
    if (action && action !== '') {
      const productEventData = id && id !== '' ? {action, id} : {action};
      this.productEvent.emit(productEventData);
    }
  }

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

  handleDeleteProduct(productId: string, productName: string) : void {
    if (productId !== '' && productName !== '') {
      this.deleteProductEvent.emit({
        productId,
        productName,
      });
    }
  }
}
