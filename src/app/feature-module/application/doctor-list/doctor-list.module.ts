import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { DoctorListComponent } from './doctor-list.component';
import { DoctorListRoutingModule } from './doctor-list-routing.module';

@NgModule({
  declarations: [DoctorListComponent],
  imports: [CommonModule, DoctorListRoutingModule, SharedModule],
})
export class DoctorListModule {}
