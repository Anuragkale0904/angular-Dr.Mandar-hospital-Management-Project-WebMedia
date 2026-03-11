import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { FirmsVisitComponent } from './firms-visit.component';
import { FirmsVisitRoutingModule } from './firms-visit-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [FirmsVisitComponent],
  imports: [CommonModule, FirmsVisitRoutingModule, SharedModule,MatPaginatorModule],
})
export class FirmsVisitModule {}
