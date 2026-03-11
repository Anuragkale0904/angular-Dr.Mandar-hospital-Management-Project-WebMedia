import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UserLogsRoutingModule } from './user-logs-routing.module';
import { UserLogsComponent } from './user-logs.component';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [UserLogsComponent],
  imports: [CommonModule, UserLogsRoutingModule, SharedModule, BsDatepickerModule.forRoot(),MatPaginatorModule],
})
export class UserLogsModule {}
