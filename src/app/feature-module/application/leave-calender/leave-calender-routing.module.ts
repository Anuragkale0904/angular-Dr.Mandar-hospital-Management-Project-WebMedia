import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveCalenderComponent } from './leave-calender.component';





const routes: Routes = [
  {
    path: '',
    component: LeaveCalenderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveCalenderRoutingModule {}
