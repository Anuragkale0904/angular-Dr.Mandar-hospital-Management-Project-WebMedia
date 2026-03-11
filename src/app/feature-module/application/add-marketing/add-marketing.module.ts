import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMarketingComponent} from './add-marketing.component';
import { AddMarketingRoutingModule} from './add-marketing-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddMarketingComponent],
  imports: [CommonModule, AddMarketingRoutingModule, SharedModule],
})
export class AddMarketingModule {}
