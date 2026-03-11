import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HospitalCallRecordComponent } from './hospital-call-record.component';



const routes: Routes = [
  {path:'',component:HospitalCallRecordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalCallRecordRoutingModule { }
