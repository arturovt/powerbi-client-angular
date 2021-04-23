// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { PowerBIEmbedModule } from 'powerbi-embed';

import { AppComponent } from './app.component';
import { DashboardEmbedComponent } from './components/dashboard-embed/dashboard-embed.component';
import { ReportEmbedComponent } from './components/report-embed/report-embed.component';
import { TileEmbedComponent } from './components/tile-embed/tile-embed.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardEmbedComponent,
    ReportEmbedComponent,
    TileEmbedComponent,
  ],
  imports: [BrowserModule, HttpClientModule, PowerBIEmbedModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
