import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMedicalComponent } from './add-medical.component';
import { AddMedicalRoutingModule } from './add-medical-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [AddMedicalComponent],
  imports: [CommonModule, AddMedicalRoutingModule, SharedModule,MatPaginatorModule],
})
export class AddMedicalModule {}
