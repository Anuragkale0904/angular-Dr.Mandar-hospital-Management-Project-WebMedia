import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { MedicineMasterRoutingModule } from './medicine-master-routing.module';
import { MedicineMasterComponent } from './medicine-master.component';

// 🔥 Angular Material Imports
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';




@NgModule({
  declarations: [
    MedicineMasterComponent
  ],
  imports: [
    CommonModule,
    MedicineMasterRoutingModule,
    SharedModule,  MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatOptionModule,MatSelectModule,MatPaginatorModule   

  ]
})
export class MedicineMasterModule {

}
