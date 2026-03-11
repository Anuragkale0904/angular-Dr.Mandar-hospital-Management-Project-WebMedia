import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStockistComponent } from './add-stockist.component';


const routes: Routes = [
  {
    path: '',
    component: AddStockistComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddStockistRoutingModule {}
