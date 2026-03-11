import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddManagerComponent } from './add-manager.component';
import { AddManagerRoutingModule } from './add-manager-routing.module';

@NgModule({
  declarations: [AddManagerComponent],
  imports: [CommonModule, AddManagerRoutingModule, SharedModule],
})
export class AddManagerModule {}
