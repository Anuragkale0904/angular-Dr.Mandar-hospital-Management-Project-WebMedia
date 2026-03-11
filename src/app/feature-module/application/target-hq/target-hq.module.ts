import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { TargetHqComponent } from './target-hq.component';
import { TargetHqRoutingModule } from './target-hq-routing.module';

@NgModule({
  declarations: [TargetHqComponent],
  imports: [CommonModule, TargetHqRoutingModule, SharedModule],
})
export class TargetHqModule {}
