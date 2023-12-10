import { Component, EventEmitter, Input, Output } from '@angular/core';

//ENUM
import { CategoryEvent } from 'src/app/Models/enums/categories/category-event';

//INTERFACES
import { EditCategoryAction } from 'src/app/Models/Interfaces/categories/event/edit-category-action';
import { getCategoriesResponse } from 'src/app/Models/Interfaces/categories/responses/getCategoriesResponse';
import { DeleteCategoryAction } from './../../../../Models/Interfaces/categories/event/delete-category-action';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html'
})
export class CategoriesTableComponent {
  @Input() public categories: Array<getCategoriesResponse> = [];

  @Output() public categoryEvent = new EventEmitter<EditCategoryAction>();
  @Output() public deleteCategoryEvent = new EventEmitter<DeleteCategoryAction>();

  public selectedCategory!: getCategoriesResponse;
  public addCategoryEvent = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryEvent = CategoryEvent.EDIT_CATEGORY_ACTION;

  handleDeleteCategoryEvent(category_id: string, category_name: string): void {
    if (category_id !== '' && category_name !== '')
      this.deleteCategoryEvent.emit({ category_id, category_name});
  }

  handleCategoryEvent(action: string, id?: string, categoryName?: string): void {
    if (action && action !== '')
      this.categoryEvent.emit({ action, id, categoryName });
  }
}
