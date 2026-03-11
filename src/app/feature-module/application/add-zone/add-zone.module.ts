import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { AddZoneComponent } from './add-zone.component';
import { AddZoneRoutingModule } from './add-zone-routing.module';


@NgModule({
  declarations: [AddZoneComponent],
  imports: [CommonModule, AddZoneRoutingModule, SharedModule],
})
export class AddZoneModule {}
