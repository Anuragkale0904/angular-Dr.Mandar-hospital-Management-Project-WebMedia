import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMarketingComponent } from './add-marketing.component';

const routes: Routes = [
  {
    path: '',
    component: AddMarketingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMarketingRoutingModule {}
