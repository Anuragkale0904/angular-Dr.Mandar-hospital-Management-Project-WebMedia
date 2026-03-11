import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/shared/shared.module';

import { LinkStockistMedicalRoutingModule } from './link-stockist-medical-routing.module';
import { LinkStockistMedicalComponent } from './link-stockist-medical.component';


@NgModule({
  declarations: [
    LinkStockistMedicalComponent
  ],
  imports: [
    CommonModule,
    LinkStockistMedicalRoutingModule,
    SharedModule
  ]
})
export class LinkStockistMedicalModule { }
