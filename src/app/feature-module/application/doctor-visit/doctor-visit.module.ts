import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DoctorVisitComponent } from './doctor-visit.component';
import { DoctorVisitRoutingModule } from './doctor-visit-routing.module';


@NgModule({
  declarations: [DoctorVisitComponent],
  imports: [CommonModule, DoctorVisitRoutingModule, RouterModule, SharedModule],
})
export class DoctorVisitModule {}
