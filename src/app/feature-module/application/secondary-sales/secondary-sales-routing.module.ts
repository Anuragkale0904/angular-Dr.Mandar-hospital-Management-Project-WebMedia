import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecondarySalesComponent } from './secondary-sales.component';


const routes: Routes = [
  {
    path: '',
    component: SecondarySalesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecondarySalesRoutingModule {}
