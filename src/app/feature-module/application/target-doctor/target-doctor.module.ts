import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { TargetDoctorComponent } from './target-doctor.component';
import { TargetDoctorRoutingModule } from './target-doctor-routing.module';

@NgModule({
  declarations: [TargetDoctorComponent],
  imports: [CommonModule, TargetDoctorRoutingModule, SharedModule],
})
export class TargetDoctorModule {}
