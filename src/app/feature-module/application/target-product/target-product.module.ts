import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { TargetProductComponent } from './target-product.component';
import { TargetProductRoutingModule } from './target-product-routing.module';

@NgModule({
  declarations: [TargetProductComponent],
  imports: [CommonModule, TargetProductRoutingModule, SharedModule],
})
export class TargetProductModule {}
