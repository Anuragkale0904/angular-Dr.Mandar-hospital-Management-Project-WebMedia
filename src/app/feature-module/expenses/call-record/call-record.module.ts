import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from 'src/app/shared/shared.module';
import { CallRecordComponent } from './call-record.component';
import { CallRecordRoutingModule } from './call-record-routing.module';

@NgModule({
  declarations: [CallRecordComponent],
  imports: [CommonModule, CallRecordRoutingModule, SharedModule],
})
export class CallRecordModule {}
