import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalenderHolidayComponent } from './calender-holiday.component';




const routes: Routes = [
  {
    path: '',
    component: CalenderHolidayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalenderHolidayRoutingModule {}
