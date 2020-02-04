import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule, MatInputModule, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { IqsApplicationsModule } from 'iqs-libs-clientshell2-angular';
import { PipEmptyStateModule, PipSearchInputModule } from 'pip-webui2-controls';
import { PipScrollableModule } from 'pip-webui2-layouts';

import { HomeContainerComponent } from './home-container.component';
import { HomeApplicationsModule } from '../../components/applications/applications.module';

@NgModule({
  declarations: [HomeContainerComponent],
  exports: [HomeContainerComponent],
  imports: [
    // Angular and vendors
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    // pip-suite2 & pip-webui2
    PipEmptyStateModule,
    PipSearchInputModule,
    PipScrollableModule,
    TranslateModule,
    // iqs-clients2
    IqsApplicationsModule,
    // application modules
    HomeApplicationsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeContainerModule { }
