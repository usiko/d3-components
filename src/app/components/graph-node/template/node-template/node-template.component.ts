import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGraphNode } from '../../graph-node.model';

@Component({
    selector: 'app-node-template',
    templateUrl: './node-template.component.html',
    styleUrls: ['./node-template.component.scss']
})
export class NodeTemplateComponent implements OnInit {

    @Input() node!: IGraphNode;
    @Output() dblClick = new EventEmitter<never>()
    constructor(private element: ElementRef) { }

    ngOnInit(): void {
        if (this.node.meta?.icon?.svg?.color) {
            this.element.nativeElement.querySelector('.icon.img')
        }
    }

    onDblclick() {
        this.dblClick.emit();
    }

}
