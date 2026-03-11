import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkStockistMedicalComponent } from './link-stockist-medical.component';


const routes: Routes = [{ path: '', component: LinkStockistMedicalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkStockistMedicalRoutingModule { }
