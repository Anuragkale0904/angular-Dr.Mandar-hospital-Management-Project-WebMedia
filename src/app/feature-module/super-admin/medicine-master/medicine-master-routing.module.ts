import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicineMasterComponent } from './medicine-master.component';


const routes: Routes = [{ path: '', component: MedicineMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicineMasterRoutingModule { }
