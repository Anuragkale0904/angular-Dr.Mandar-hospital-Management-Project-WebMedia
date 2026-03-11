import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MediaGalleryComponent } from './media-gallery.component';
import { MediaGalleryRoutingModule } from './media-gallery-routing.module';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [MediaGalleryComponent],
  imports: [CommonModule, MediaGalleryRoutingModule, SharedModule,MatPaginatorModule],
})
export class MediaGalleryModule {}
