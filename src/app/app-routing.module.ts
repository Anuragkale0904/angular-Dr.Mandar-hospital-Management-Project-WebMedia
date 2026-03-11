import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './feature-module/authentication/login/login.component';
import { PrintBillComponent } from './print-bill/print-bill.component';


// const routes: Routes = [
//   {
//     path: '',
//     loadChildren: () =>
//       import('./feature-module/feature-module.module').then(
//         (m) => m.FeatureModuleModule
//       ),
//   },
//   {
//     path: '',
//     pathMatch: 'full',
//     redirectTo: 'login',  // Make sure 'login' exists inside the feature module
//   },
//   {
//     path: '**',
//     redirectTo: 'login',
//   },
//   {
//   path: 'login',
//   component: LoginComponent
// }

// ];

const routes: Routes = [

  // Login Route
  {
    path: 'login',
    component: LoginComponent
  },

   //PRINT BILL 
  {
    path: 'print-bill/:id',
    component: PrintBillComponent
  },

  // Feature Module (After login)
  {
    path: '',
    loadChildren: () =>
      import('./feature-module/feature-module.module').then(
        (m) => m.FeatureModuleModule
      ),
  },

  // Default redirect
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },

  // Wildcard MUST BE LAST
  {
    path: '**',
    redirectTo: 'login',
  }

 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
