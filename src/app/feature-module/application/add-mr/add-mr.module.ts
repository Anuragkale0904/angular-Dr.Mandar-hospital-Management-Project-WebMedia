import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddMrRoutingModule } from './add-mr-routing.module';
import { AddMrComponent } from './add-mr.component';


@NgModule({
  declarations: [AddMrComponent],
  imports: [CommonModule, AddMrRoutingModule, SharedModule],
})
export class AddMrModule {}
