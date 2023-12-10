import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.service';
import { HomeComponent } from './Modules/home/home.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./Modules/dashboard/dashboard.module')
        .then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./Modules/products/products.module')
        .then(m => m.ProductsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./Modules/categories/categories.module')
        .then(m => m.CategoriesModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: PreloadAllModules,
      },
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
