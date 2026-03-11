import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { YearComponent } from './year.component';
import { YearRoutingModule } from './year-routing.module';

@NgModule({
  declarations: [YearComponent],
  imports: [CommonModule, YearRoutingModule, SharedModule],
})
export class YearModule {}
