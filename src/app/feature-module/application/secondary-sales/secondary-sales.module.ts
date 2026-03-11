import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { SecondarySalesComponent } from './secondary-sales.component';
import { SecondarySalesRoutingModule } from './secondary-sales-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PrintBillComponent } from 'src/app/print-bill/print-bill.component';

@NgModule({
  declarations: [SecondarySalesComponent],
  imports: [CommonModule, SecondarySalesRoutingModule, SharedModule,MatPaginatorModule,PrintBillComponent]  
})
export class SecondarySalesModule {}
