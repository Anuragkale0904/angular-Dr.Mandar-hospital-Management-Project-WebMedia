import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { DefaultOTPComponent } from './default-otp.component';
import { DefaultOTPRoutingModule } from './default-otp-routing.module';


@NgModule({
  declarations: [DefaultOTPComponent],
  imports: [CommonModule, DefaultOTPRoutingModule, SharedModule],
})
export class DefaultOTPModule {}
