import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminComponent } from './super-admin.component';


const routes: Routes = [
  {
    path: '',
    component: SuperAdminComponent,
    children: [
      {
        path: 'medicine-master',
        loadChildren: () =>
          import('./medicine-master/medicine-master.module').then((m) => m.MedicineMasterModule),
      },
     
      
      {
        path: 'promotor-sales',
        loadChildren: () =>
          import('./promotor-sales/promotor-sales.module').then(
            (m) => m.PromotorSalesModule,
          ),
        },
      
      {
        path: 'link-stockist-medical',
        loadChildren: () =>
          import('./link-stockist-medical/link-stockist-medical.module').then((m) => m.LinkStockistMedicalModule),
      },
      {
        path: 'plans-list',
        loadChildren: () =>
          import('./plans-list/plans-list.module').then(
            (m) => m.PlansListModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminRoutingModule {}
