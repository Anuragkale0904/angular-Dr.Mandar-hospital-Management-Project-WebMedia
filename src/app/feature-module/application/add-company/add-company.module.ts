import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddCompanyComponent } from './add-company.component';
import { AddCompanyRoutingModule } from './add-company-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [AddCompanyComponent],
  imports: [
    CommonModule,
    AddCompanyRoutingModule,
    RouterModule,
    SharedModule,
    HttpClientModule ,
    MatPaginatorModule  // ✅ added
  ],
})
export class AddCompanyModule {}
