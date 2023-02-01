//NgxGraphModuleimport { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxPopperModule } from 'ngx-popper';
import { GraphNodeComponent } from './graph-node.component';
import { NodeTemplateComponent } from './template/node-template/node-template.component';



@NgModule({
    declarations: [
        GraphNodeComponent,
        NodeTemplateComponent,
    ],
    imports: [
        BrowserModule,
        NgxGraphModule,
        NgxPopperModule.forRoot({}),
        CommonModule
    ],
    exports: [
        GraphNodeComponent
    ],
    providers: []
})
export class GraphNodeModule { }
