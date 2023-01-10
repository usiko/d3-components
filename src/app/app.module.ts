import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { DonutChartModule } from './components/donut-chart/donut-chart.module';
import { GraphNodeModule } from 'src/app/components/graph-node';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
    DonutChartModule,
    GraphNodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
