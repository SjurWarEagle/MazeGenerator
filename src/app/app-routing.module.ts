import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateNewComponent } from './components/generate-new/generate-new.component';
import { MazeDisplayComponent } from './components/maze-display/maze-display.component';

const routes: Routes = [
  { path: '', component: GenerateNewComponent },
  { path: 'show', component: MazeDisplayComponent },
  // directs all other routes to the main page
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
