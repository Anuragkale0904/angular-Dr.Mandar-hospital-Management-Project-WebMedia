import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddUserComponent } from './add-user.component';
import { AddUserRoutingModule } from './add-user-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [AddUserComponent],
  imports: [CommonModule, AddUserRoutingModule, RouterModule, SharedModule,MatPaginatorModule],
})
export class AddUserModule {}
