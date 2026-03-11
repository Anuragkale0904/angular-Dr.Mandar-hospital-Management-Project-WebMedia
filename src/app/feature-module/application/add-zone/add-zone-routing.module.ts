import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddZoneComponent } from './add-zone.component';



const routes: Routes = [
  {
    path: '',
    component: AddZoneComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddZoneRoutingModule {}
