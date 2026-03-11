import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserRoleComponent } from './user-role.component';
import { UserRoleRoutingModule } from './user-role-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [UserRoleComponent],
  imports: [CommonModule, UserRoleRoutingModule, SharedModule,MatPaginatorModule],
})
export class UserRoleModule {}
