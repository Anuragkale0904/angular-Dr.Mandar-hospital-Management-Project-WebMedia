import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorVisitComponent } from './doctor-visit.component';



const routes: Routes = [
  {
    path: '',
    component: DoctorVisitComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorVisitRoutingModule {}
