import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { TargetComponent } from './target.component';
import { TargetRoutingModule } from './target-routing.module';
@NgModule({
  declarations: [TargetComponent],
  imports: [CommonModule, TargetRoutingModule, SharedModule],
})
export class TargetModule {}
