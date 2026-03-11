import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllowanceComponent } from './allowance.component';




const routes: Routes = [
  {
    path: '',
    component: AllowanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllowanceRoutingModule {}
