import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TargetHqComponent } from './target-hq.component';




const routes: Routes = [
  {
    path: '',
    component: TargetHqComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TargetHqRoutingModule {}
