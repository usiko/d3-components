import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DonutChartComponent } from './donut-chart.component';



@NgModule({
    declarations: [
        DonutChartComponent
    ],
    exports: [
        DonutChartComponent
    ]
})
export class DonutChartModule { }