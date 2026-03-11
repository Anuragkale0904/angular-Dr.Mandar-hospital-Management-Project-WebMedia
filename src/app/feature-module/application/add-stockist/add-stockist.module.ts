import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { AddStockistComponent } from './add-stockist.component';
import { AddStockistRoutingModule } from './add-stockist-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [AddStockistComponent],
  imports: [CommonModule, AddStockistRoutingModule, SharedModule,MatPaginatorModule],
})
export class AddStockistModule {}
