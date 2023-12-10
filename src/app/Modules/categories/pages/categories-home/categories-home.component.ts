import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

//SERVICES
import { CategoriesService } from 'src/app/services/categories/categories.service';

//INTERFACES
import { DeleteCategoryAction } from 'src/app/Models/Interfaces/categories/event/delete-category-action';
import { getCategoriesResponse } from 'src/app/Models/Interfaces/categories/responses/getCategoriesResponse';

//PRIME NG
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EventAction } from 'src/app/Models/Interfaces/products/event/event-action';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: ['./categories-home.component.scss']
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;

  public categoriesData: Array<getCategoriesResponse> = [];

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoriesService
      .getCategories()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.length > 0) {
              this.categoriesData = response;
            }
          },
          error: (err) => {
            console.error(err);

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error retrieving the categories.',
              life: 4000,
            });

            this.router.navigate(['/dashboard']);
          },
        });
  }

  handleDeleteCategoryAction(event: DeleteCategoryAction): void {
    if (event) {
      this.confirmationService.confirm({
        header: 'Delete',
        rejectLabel: 'No',
        acceptLabel: 'Yes',
        icon: 'pi pi-exclamation-triangle',
        accept: () => this.deleteCategory(event?.category_id),
        message: `Do you really want to delete ${event?.category_name}`,
      })
    }
  }

  deleteCategory(category_id: string): void {
    if (category_id) {
      this.categoriesService
        .deleteCategory({category_id})
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.getAllCategories();

              this.messageService.add({
                severity: 'success',
                summary: 'Deleting category',
                detail: 'Category deleted successfully.',
                life: 5000,
              });
            },
            error: (err) => {
              console.error(err);
              this.getAllCategories();

              this.messageService.add({
                severity: 'error',
                summary: 'Deleting category',
                detail: 'Something went wrong while trying to delete the category.',
                life: 4000,
              })
            }
          });

    }
  }

  public handleCategoryAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService
        .open(
          CategoryFormComponent,
          {
            width: '70%',
            baseZIndex: 10000,
            maximizable: true,
            header: event?.action,
            data: { event: event},
            contentStyle: { overflow: 'auto'},
          }
        );

      this.ref.onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => this.getAllCategories(),
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
