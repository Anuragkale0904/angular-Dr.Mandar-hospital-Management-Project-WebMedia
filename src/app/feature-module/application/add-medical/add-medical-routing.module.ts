import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMedicalComponent } from './add-medical.component';

const routes: Routes = [
  {
    path: '',
    component: AddMedicalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMedicalRoutingModule {}
