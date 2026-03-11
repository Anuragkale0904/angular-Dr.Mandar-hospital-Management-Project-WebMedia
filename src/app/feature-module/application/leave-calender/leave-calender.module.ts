import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { LeaveCalenderComponent } from './leave-calender.component';
import { LeaveCalenderRoutingModule } from './leave-calender-routing.module';




@NgModule({
  declarations: [LeaveCalenderComponent],
  imports: [CommonModule, LeaveCalenderRoutingModule, SharedModule],
})
export class LeaveCalenderModule {}
