import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddHeadquaterComponent } from './add-headquater.component';
import { AddHeadquaterRoutingModule } from './add-headquater-routing.module';


@NgModule({
  declarations: [AddHeadquaterComponent],
  imports: [CommonModule, AddHeadquaterRoutingModule, RouterModule, SharedModule],
})
export class AddHeadquaterModule {}
