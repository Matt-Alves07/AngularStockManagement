import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

//CUSTOM SERVICES
import { CategoriesService } from 'src/app/services/categories/categories.service';

//PRIME NG
import { MessageService } from 'primeng/api';
import { getCategoriesResponse } from 'src/app/Models/Interfaces/categories/responses/getCategoriesResponse';
import { CreateProductRequest } from 'src/app/Models/Interfaces/products/request/create-product-request';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public categoriesData: Array<getCategoriesResponse> = [];
  public selectedCategory: Array<{name: string; code: string}> = [];
  public addProductForm = this.formBuilder.group({
    name: ['',Validators.required],
    price: ['', Validators.required],
    description: ['',Validators.required],
    category_id: ['',Validators.required],
    amount: [0, Validators.required],
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoriesService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (values) => {
          if (values.length > 0) {
            this.categoriesData = values;
          }
        }
      });

      console.log(this.categoriesData);
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value){
      if (this.addProductForm?.valid) {
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
              })
            }
          });

        this.addProductForm.reset();
      }
      else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Please fill all fields correctly before submitting the form.',
          life: 4000
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
