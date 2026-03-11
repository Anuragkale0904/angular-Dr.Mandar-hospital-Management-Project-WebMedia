import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from './expenses.component';

const routes: Routes = [
  {
    path: '',
    component: ExpensesComponent,
    children: [
      {
        path: 'expenses-list',
        loadChildren: () =>
          import('./expenses-list/expenses-list.module').then(
            (m) => m.ExpensesListModule
          ),
      },
      {
        path: 'call-record',
        loadChildren: () =>
          import('./call-record/call-record.module').then(
            (m) => m.CallRecordModule
          ),
      },
      {
        path: 'hospital-call-record',
        loadChildren: () =>
          import('./hospital-call-record/hospital-call-record.module').then(
            (m) => m.HospitalCallRecordModule
          ),
      },
     
     
      
    ],
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpensesRoutingModule {}
