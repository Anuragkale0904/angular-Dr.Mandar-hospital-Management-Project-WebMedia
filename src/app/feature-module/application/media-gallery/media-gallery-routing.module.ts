import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaGalleryComponent } from './media-gallery.component';






const routes: Routes = [
  {
    path: '',
    component: MediaGalleryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaGalleryRoutingModule {}
