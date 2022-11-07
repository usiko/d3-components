import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { DonutChartModule } from './components/donut-chart/donut-chart.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
      AppRoutingModule,
    DonutChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
