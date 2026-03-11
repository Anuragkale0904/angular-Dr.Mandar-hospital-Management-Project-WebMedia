import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TargetProductComponent } from './target-product.component';




const routes: Routes = [
  {
    path: '',
    component: TargetProductComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TargetProductRoutingModule {}
