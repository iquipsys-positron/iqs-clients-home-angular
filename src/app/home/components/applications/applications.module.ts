import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, MatListModule, MatButtonModule } from '@angular/material';
import { IqsApplicationsModule } from 'iqs-libs-clientshell2-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipTilesLayoutModule } from 'pip-webui2-layouts';

import { ApplicationsComponent } from './applications.component';

@NgModule({
  declarations: [ApplicationsComponent],
  exports: [ApplicationsComponent],
  imports: [
    // Angular and vendors
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    TranslateModule,
    // pip-suite2 & pip-webui2
    PipTilesLayoutModule,
    // iqs-clients2
    IqsApplicationsModule
  ]
})
export class HomeApplicationsModule { }
