import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMrComponent } from './add-mr.component';



const routes: Routes = [
  {
    path: '',
    component: AddMrComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMrRoutingModule {}
