import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    IqsShellModule,
    IqsShellContainerComponent,
    DEFAULT_SESSION_CONFIG
} from 'iqs-libs-clientshell2-angular';
import { mockProvidersAndServices } from 'iqs-libs-clientshell2-angular/mock';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { environment } from '../environments/environment';

@NgModule({
    imports: [
        // Angular and vendors
        BrowserModule,
        BrowserAnimationsModule,
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
        // iqs-clients2
        IqsShellModule.forRoot({
            session: {
                unautorizedUrl: environment.production ? '/monitoring/index.html' : DEFAULT_SESSION_CONFIG.unautorizedUrl,
                serverUrl: environment.serverUrl
            }
        }),
        // application modules
        AppRoutingModule,
        HomeModule
    ],
    providers: environment.mock ? mockProvidersAndServices : [],
    bootstrap: [IqsShellContainerComponent]
})
export class AppModule { }
