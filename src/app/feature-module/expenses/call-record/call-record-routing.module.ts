import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallRecordComponent } from './call-record.component';


const routes: Routes = [
  {path:'',component:CallRecordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallRecordRoutingModule { }
