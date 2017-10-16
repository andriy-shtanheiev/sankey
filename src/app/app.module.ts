import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SankeyDiagramComponent } from './sankey-diagram.component';
import { SankeyDataService } from './sankey-data.service';
import { D3Service } from 'd3-ng2-service';

@NgModule({
  declarations: [
    AppComponent,
    SankeyDiagramComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [D3Service, SankeyDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
