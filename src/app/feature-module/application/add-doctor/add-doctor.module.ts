import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDoctorComponent} from './add-doctor.component';
import { AddDoctorRoutingModule} from './add-doctor-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddDoctorComponent],
  imports: [CommonModule, AddDoctorRoutingModule, SharedModule],
})
export class AddDoctorModule {}
