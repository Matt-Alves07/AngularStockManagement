import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

//CUSTOM SERVICES AND OTHERS
import { ProductsService } from 'src/app/services/products/products.service';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { CreateProductRequest } from 'src/app/Models/Interfaces/products/request/create-product-request';
import { GetAllProductsResponse } from 'src/app/Models/Interfaces/products/response/GetAllProductsResponse';
import { getCategoriesResponse } from 'src/app/Models/Interfaces/categories/responses/getCategoriesResponse';

//PRIME NG
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EventAction } from 'src/app/Models/Interfaces/products/event/event-action';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { ProductEvent } from 'src/app/Models/enums/products/product-event';
import { EditProductRequest } from 'src/app/Models/Interfaces/products/request/edit-product-request';
import { SaleProductRequest } from 'src/app/Models/Interfaces/products/request/sale-product-request';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  // #region Private vars
  private readonly destroy$: Subject<void> = new Subject();
  // #endregion

  // #region Publics vars
  public renderDropdown: boolean = false;
  public selectedProductData!: GetAllProductsResponse;
  public categoriesData: Array<getCategoriesResponse> = [];
  public productsDatas: Array<GetAllProductsResponse> = [];
  public selectedCategory: Array<{name: string; code: string}> = [];
  // #endregion

  // #region Products actions
  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;
  // #endregion

  // #region Product action interface
  public productAction!: {
    event: EventAction;
    productsList: Array<GetAllProductsResponse>;
  };
  // #endregion

  // #region Products forms builders
  public addProductForm = this.formBuilder.group({
    name: ['',Validators.required],
    price: ['', Validators.required],
    description: ['',Validators.required],
    category_id: ['',Validators.required],
    amount: [0, Validators.required],
  });

  public editProductForm = this.formBuilder.group({
    name: ['',Validators.required],
    price: ['',Validators.required],
    amount: [0, Validators.required],
    description: ['',Validators.required],
    category_id: ['',Validators.required],
  });

  public saleProductForm = this.formBuilder.group({
    amount: [0,Validators.required],
    product_id: ['',Validators.required],
  });

  public sellSelectedProduct!: GetAllProductsResponse;
  // #endregion

  constructor(
    private router: Router,
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private productDTService: ProductsDataTransferService,
  ) {}

  ngOnInit(): void {
    this.productAction = this.ref.data;

    this.productAction?.event?.action === this.saleProductAction && this.getProductData();

    this.getCategories();
    this.renderDropdown = true;
  }

  getCategories() {
    this.categoriesService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (values) => {
          if (values.length > 0) {
            this.categoriesData = values;

            if (this.productAction?.event?.action === this.editProductAction && this.productAction?.productsList)
              this.getSelectedProductData(this.productAction?.event?.id as string);
          }
        }
      });
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value){
      if (!this.addProductForm?.valid) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please fill all fields correctly before submitting the form.',
          life: 4000
        });

        return;
      }

      const request: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: this.addProductForm.value.amount as number,
      };

      this.productsService.AddProduct(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product created successfully.',
                life: 5000
              });
            }
          },
          error: (err) => {
            console.error(err);

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error happened while trying to create a new product.',
              life: 3000
            });
          }
        });

      this.addProductForm.reset();
    }
  }

  handleSubmitEditProduct(): void {
    if (this.editProductForm?.value) {
      if ((!this.editProductForm?.valid) || (!this.productAction.event.id)) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please fill all fields correctly before submitting the form.',
          life: 4000
        });

        return;
      }

      const requestedProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        product_id: this.productAction.event.id as string,
        amount: this.editProductForm.value.amount as number,
        description: this.editProductForm.value.description as string,
        category_id: this.editProductForm.value.category_id as string,
      };

      this.productsService
        .EditProduct(requestedProduct)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product edited successfully',
                life: 5000
              });

              this.editProductForm.reset();
            },
            error: (err) => {
              console.error(err);

              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: "Something went wrong while trying to save product's changes.",
                life: 3000,
              });
            }
          });
    }
  }

  handleSubmitProductSale(): void {
    if (this.saleProductForm?.value) {
      console.log(this.saleProductForm);

      if (!this.saleProductForm?.valid) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please fill all fields correctly before submitting the form.',
          life: 4000
        });

        return;
      }

      const requestData: SaleProductRequest = {
        amount: this.saleProductForm.value?.amount as number,
        id: this.saleProductForm.value?.product_id as string,
      }

      this.productsService
        .SaleProduct(requestData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Product sold successfully',
                  life: 5000
                });

                this.saleProductForm.reset();
                this.getProductData();
                this.router.navigate(['/dashboard']);
              }
            }, error: (err) => {
              console.error(err);

              this.saleProductForm.reset();
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: "Something went wrong while trying to sell a product.",
                life: 3000,
              });
            }
          });
    }
  }

  getSelectedProductData(product_id: string): void {
    const products = this.productAction?.productsList;
    if (products.length > 0) {
      const productFiltered = products.filter((element) => element?.id === product_id);
      if (productFiltered) {
        this.selectedProductData = productFiltered[0];

        this.editProductForm.setValue({
          name: this.selectedProductData?.name,
          price: this.selectedProductData?.price,
          amount: this.selectedProductData?.amount,
          description: this.selectedProductData?.description,
          category_id: this.selectedProductData?.category.id,
        });
      }
    }
  }

  getProductData(): void {
    this.productsService.getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDatas && this.productDTService.setProductsData(this.productsDatas);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
