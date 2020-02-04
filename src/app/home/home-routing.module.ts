import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'iqs-libs-clientshell2-angular';

import { HomeContainerComponent } from './containers/home-container/home-container.component';

export const routes: Routes = [
  { path: '', component: HomeContainerComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
