import { Routes } from "@angular/router";

//COMPONENTS
import { CategoriesHomeComponent } from "./pages/categories-home/categories-home.component";

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    component: CategoriesHomeComponent,
  },
];
