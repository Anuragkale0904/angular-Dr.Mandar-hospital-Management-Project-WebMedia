import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TdsComponent } from './tds.component';



const routes: Routes = [
  {
    path: '',
    component: TdsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TdsRoutingModule {}
