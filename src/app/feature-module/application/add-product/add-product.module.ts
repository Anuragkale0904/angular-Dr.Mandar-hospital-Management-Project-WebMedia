import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddProductComponent } from './add-product.component';
import { AddProductRoutingModule } from './add-product-routing.module';



@NgModule({
  declarations: [AddProductComponent],
  imports: [CommonModule, AddProductRoutingModule, RouterModule, SharedModule],
})
export class AddProductModule {}
