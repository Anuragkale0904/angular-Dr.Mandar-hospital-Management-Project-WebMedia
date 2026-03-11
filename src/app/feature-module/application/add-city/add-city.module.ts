import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
// import { TabViewModule } from 'primeng/tabview';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AddCityComponent } from './add-city.component';
import { AddCityRoutingModule } from './add-city-routing.module';

@NgModule({
  declarations: [AddCityComponent],
  imports: [CommonModule, AddCityRoutingModule, SharedModule,FullCalendarModule ],
})
export class AddCityModule {}
