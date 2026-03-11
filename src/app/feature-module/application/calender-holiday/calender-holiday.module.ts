import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { CalenderHolidayComponent } from './calender-holiday.component';
import { CalenderHolidayRoutingModule } from './calender-holiday-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [CalenderHolidayComponent],
  imports: [CommonModule, CalenderHolidayRoutingModule, SharedModule,MatPaginatorModule],
})
export class CalenderHolidayModule {}
