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
        if (this.graph) {

            this.graph.onZoom = ((event, direction: string) => {
                if (this.graph) {
                    if (event.ctrlKey) {
                        if (this.graph.enableTrackpadSupport && !event.ctrlKey) {
                            this.graph.pan(event.deltaX * -1, event.deltaY * -1);
                            return;
                        }
                        const zoomFactor = 1 + (direction === 'in' ? this.graph.zoomSpeed : -this.graph.zoomSpeed); // Check that zooming wouldn't put us out of bounds
                        const newZoomLevel = this.graph.zoomLevel * zoomFactor;
                        if (newZoomLevel <= this.graph.minZoomLevel || newZoomLevel >= this.graph.maxZoomLevel) {
                            return;
                        } // Check if zooming is enabled or not
                        if (!this.graph.enableZoom) {
                            return;
                        }
                        if (this.graph.panOnZoom === true && event) {
                            // Absolute mouse X/Y on the screen
                            const mouseX = event.clientX;
                            const mouseY = event.clientY; // Transform the mouse X/Y into a SVG X/Y
                            const svg = this.graph['el'].nativeElement.querySelector('svg');
                            const svgGroup = svg.querySelector('g.chart');
                            const point = svg.createSVGPoint();
                            point.x = mouseX;
                            point.y = mouseY;
                            const svgPoint = point.matrixTransform(svgGroup.getScreenCTM().inverse()); // Panzoom
                            this.graph.pan(svgPoint.x, svgPoint.y, true);
                            this.graph.zoom(zoomFactor);
                            this.graph.pan(-svgPoint.x, -svgPoint.y, true);
                        } else {
                            this.graph.zoom(zoomFactor);
                        }
                    }
                }
            });

        }
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
