import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeListRoutingModule } from './employee-list-routing.module';



@NgModule({
  declarations: [EmployeeListComponent],
  imports: [CommonModule, EmployeeListRoutingModule, SharedModule],
})
export class EmployeeListModule {}
