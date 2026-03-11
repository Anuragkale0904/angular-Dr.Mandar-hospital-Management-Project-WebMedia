import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { TdsComponent } from './tds.component';
import { TdsRoutingModule } from './tds-routing.module';


@NgModule({
  declarations: [TdsComponent],
  imports: [CommonModule, TdsRoutingModule, SharedModule],
})
export class TdsModule {}
