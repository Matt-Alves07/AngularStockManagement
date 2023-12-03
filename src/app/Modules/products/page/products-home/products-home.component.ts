import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

//SERVICES
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

//INTERFACES
import { EventAction } from 'src/app/Models/Interfaces/products/event/event-action';
import { GetAllProductsResponse } from 'src/app/Models/Interfaces/products/response/GetAllProductsResponse';

//PRIME NG
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: ['./products-home.component.scss']
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;

  public productsList: Array<GetAllProductsResponse> = [];

  constructor (
    private router: Router,
    private dialogService: DialogService,
    private messageService: MessageService,
    private productsService: ProductsService,
    private confirmationService: ConfirmationService,
    private productDtService: ProductsDataTransferService,
  ) {}

  ngOnInit(): void {
    this.GetServiceProductsData();
  }

  GetServiceProductsData() {
    const productsLoaded = this.productDtService.getProductsData();

    if (productsLoaded.length > 0)
      this.productsList = productsLoaded;
    else
      this.getAPIProductsDatas();
  }

  getAPIProductsDatas() {
    this.productsService
      .getAllProducts()
        .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0)
            this.productsList = response;
        },
        error: (err) => {
          console.error(err);
          this.router.navigate(['/dashboard']);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error retrieving products data',
            life: 5000
          });
        }
      });
  }

  handleProductAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(
        ProductFormComponent,
        {
          header: event?.action,
          width: '70',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: true,
          data: {
            event: event,
            productsList: this.productsList
          }
        }
      );

      this.ref.onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.getAPIProductsDatas(),
        });
    }
  }

  handleProductDeleteAction(event: { productId: string, productName: string}) : void {
    this.confirmationService.confirm({
      message: `Do you really want to delete the product: ${event.productName}?`,
      header: 'Confirm delete product',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => this.deleteProduct(event?.productId),
    });
  }

  deleteProduct(id: string): void {
    if (id) {
      this.productsService
        .deleteProduct(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product deleted successfully.',
                life: 5000,
              });

              this.getAPIProductsDatas();
            }, error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting the product.',
                life: 5000
              });
            }
          });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
