import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotorSalesComponent } from './promotor-sales.component';


const routes: Routes = [{ path: '', component: PromotorSalesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotorSalesRoutingModule { }
