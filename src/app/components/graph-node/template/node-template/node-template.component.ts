import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopperContent } from 'ngx-popper';
import { IGraphNode } from '../../graph-node.model';

@Component({
    selector: 'app-node-template',
    templateUrl: './node-template.component.html',
    styleUrls: ['./node-template.component.scss'],
})
export class NodeTemplateComponent implements OnInit {
    @Input() node!: IGraphNode;
    @Input() popperContent?: PopperContent;
    @Output() hover = new EventEmitter<never>();
    @Output() dblClick = new EventEmitter<never>();
    constructor(private element: ElementRef) { }

    ngOnInit(): void {
        if (this.node.meta?.icon?.svg?.color) {
            this.element.nativeElement.querySelector('.icon.img');
        }
    }
    nodeHover() {
        console.log('mouseenter');
        this.hover.emit();
    }

    onDblclick() {
        this.dblClick.emit();
    }
}
