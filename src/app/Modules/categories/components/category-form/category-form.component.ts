import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';

//ENUM
import { CategoryEvent } from 'src/app/Models/enums/categories/category-event';

//INTERFACES
import { EditCategoryAction } from 'src/app/Models/Interfaces/categories/event/edit-category-action';

//SERVICES
import { CategoriesService } from 'src/app/services/categories/categories.service';

//PRIME NG
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public categoryAction!: { event: EditCategoryAction };
  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required],
  })

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  handleSubmitAddCategory(): void {
    if (this.categoryForm?.value && !this.categoryForm.valid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation error',
        detail: 'Please fill all fields correctly before submitting the form.',
        life: 4000
      });

      return;
    }

    const requestCreateCategory: { name: string } = {
      name: this.categoryForm.value.name as string,
    };

    console.log(requestCreateCategory);

    this.categoryService
      .AddCategory(requestCreateCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.categoryForm.reset();

              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Category has been created successfully.',
                life: 5000,
              });
            }
          },
          error: (err) => {
            console.error(err);

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong while trying to add a new category.',
              life: 4000,
            });
          }
        });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
