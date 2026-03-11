import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllowanceComponent } from './allowance.component';
import { AllowanceRoutingModule } from './allowance-routing.module';



@NgModule({
  declarations: [AllowanceComponent],
  imports: [CommonModule, AllowanceRoutingModule, SharedModule],
})
export class AllowanceModule {}
