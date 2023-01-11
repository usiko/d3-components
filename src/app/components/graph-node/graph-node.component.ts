import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { IGraphLink, IGraphNode } from './graph-node.model';

@Component({
  selector: 'app-graph-node',
  templateUrl: './graph-node.component.html',
  styleUrls: ['./graph-node.component.scss']
})
export class GraphNodeComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() nodes: IGraphNode[] =[];
  @Input() links: IGraphLink[] = [];
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();

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
      this.fitGraph();
      this.centerGraph();
      this.updateGraph();
    }
  }

  onNodeOpen(node:IGraphNode)
  {
    this.nodeOpen.emit(node);
  }
}
