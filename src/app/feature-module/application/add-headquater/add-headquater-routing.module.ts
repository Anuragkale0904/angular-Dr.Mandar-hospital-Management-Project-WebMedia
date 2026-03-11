import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddHeadquaterComponent } from './add-headquater.component';



const routes: Routes = [
  {
    path: '',
    component: AddHeadquaterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddHeadquaterRoutingModule {}
