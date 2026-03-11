import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TargetDoctorComponent } from './target-doctor.component';




const routes: Routes = [
  {
    path: '',
    component: TargetDoctorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TargetDoctorRoutingModule {}
