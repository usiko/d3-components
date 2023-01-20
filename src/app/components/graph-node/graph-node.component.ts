import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { GraphComponent, NgxGraphModule } from '@swimlane/ngx-graph';
import { interval, Subject, Subscription } from 'rxjs';
import { IGraphLink, IGraphNode, IGraphConfig } from './graph-node.model';

@Component({
    selector: 'app-graph-node',
    templateUrl: './graph-node.component.html',
    styleUrls: ['./graph-node.component.scss']
})
export class GraphNodeComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild(GraphComponent) graph?: GraphComponent;
    @Input() nodes: IGraphNode[] = [];
    @Input() links: IGraphLink[] = [];
    @Input() config: IGraphConfig = { nodeSize: 20, labelHeight: 25 };
    center$: Subject<boolean> = new Subject();
    zoomToFit$: Subject<boolean> = new Subject();
    update$: Subject<boolean> = new Subject();

    localLinks: IGraphLink[] = []


    @Output() nodeOpen = new EventEmitter<IGraphNode>()


    constructor(private element: ElementRef) { }


    centerGraph() {
        this.center$.next(true);
    }
    fitGraph() {
        this.zoomToFit$.next(true);
    }
    updateGraph() {
        this.update$.next(true);
    }

    ngAfterViewInit(): void {

    }

    ngOnInit(): void {


    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['nodes'] || changes['links']) {
            if (this.graph) {
                this.graph.nodes = this.nodes;
                this.graph.links = this.links;
                this.graph.update();
                this.graph.center();
                this.graph.zoomToFit();
            }
        }
    }


    onNodeOpen(node: IGraphNode) {
        this.nodeOpen.emit(node);
    }

    private setLinks() {
        if (this.graph) {
            const links = [...this.links];
            const intervalSub: Subscription = interval(10).subscribe(() => {
                if (links.length > 0) {

                    if (this.graph) {
                        const link = links.pop()
                        if (link) {
                            this.graph.links.push(link);
                            /*this.graph.update();
                            this.graph.center();
                            this.graph.zoomToFit();*/

                        }


                    }
                }
                else {
                    intervalSub.unsubscribe();
                    console.log(this.graph);
                    if (this.graph) {
                        this.graph.update();
                        this.graph.center();
                        this.graph.zoomToFit();
                    }
                }
            })



        }
    }
}
