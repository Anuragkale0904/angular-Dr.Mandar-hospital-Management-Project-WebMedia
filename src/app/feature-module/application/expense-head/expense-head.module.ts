import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExpenseHeadComponent } from './expense-head.component';
import { ExpenseHeadRoutingModule } from './expense-head-routing.module';




@NgModule({
  declarations: [ExpenseHeadComponent],
  imports: [CommonModule, ExpenseHeadRoutingModule, SharedModule],
})
export class ExpenseHeadModule {}
