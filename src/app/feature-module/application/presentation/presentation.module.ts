import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { PresentationComponent } from './presentation.component';
import { PresentationRoutingModule } from './presentation-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';





@NgModule({
  declarations: [PresentationComponent],
  imports: [CommonModule, PresentationRoutingModule, SharedModule,MatPaginatorModule],
})
export class PresentationModule {}
