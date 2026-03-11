import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/shared/shared.module';
import { PromotorSalesRoutingModule } from './promotor-sales-routing.module';
import { PromotorSalesComponent } from './promotor-sales.component';


@NgModule({
  declarations: [
    PromotorSalesComponent
  ],
  imports: [
    CommonModule,
    PromotorSalesRoutingModule,
    SharedModule
  ]
})
export class PromotorSalesModule { }
