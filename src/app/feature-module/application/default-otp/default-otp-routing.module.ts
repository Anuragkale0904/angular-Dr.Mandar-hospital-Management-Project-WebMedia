import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultOTPComponent } from './default-otp.component';



const routes: Routes = [
  {
    path: '',
    component: DefaultOTPComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaultOTPRoutingModule {}
