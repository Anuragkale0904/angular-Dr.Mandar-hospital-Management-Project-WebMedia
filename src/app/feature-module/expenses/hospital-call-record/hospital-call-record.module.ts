import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/shared/shared.module';
import { HospitalCallRecordComponent } from './hospital-call-record.component';
import { HospitalCallRecordRoutingModule } from './hospital-call-record-routing.module';


@NgModule({
  declarations: [HospitalCallRecordComponent],
  imports: [CommonModule, HospitalCallRecordRoutingModule, SharedModule],
})
export class HospitalCallRecordModule {}
