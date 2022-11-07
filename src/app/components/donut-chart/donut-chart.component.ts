import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Selection, Arc, PieArcDatum, Pie, selection } from 'd3';
import * as d3 from 'd3';
@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('container') container?: ElementRef;
  @Input() colors: string[] = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"];
  @Input() innerRadiusRatio: number = 0;
  @Input() data: { label: string, value: number; }[] = [];
  static incrementId = 0;
  public containerId = '';

  private height = 0;
  private width = 0;

  private svg?: Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private dataContainer?: Selection<SVGGElement, unknown, HTMLElement, any>;

  private arc?: Arc<any, d3.DefaultArcObject>;
  private outerArc?: Arc<any, d3.DefaultArcObject>;

  private pie?: Pie<any, {
    label: string;
    value: number;
  }>;

  private resizeObserver?: ResizeObserver;
  constructor() { }

  ngOnInit(): void {
    this.containerId = this.generateUniqId();
    this.resizeObserver = new ResizeObserver(entries => {
      //const height = entries[0].contentRect.height;
      //const width = entries[0].contentRect.width;
      this.setSize();

    });

  }

  ngAfterViewInit(): void {
    if (this.resizeObserver) {
      this.resizeObserver.observe(this.container?.nativeElement);
    }
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (this.pie) {
        console.log('update', this.data);
        this.buildPieChart(this.data);
      }
    }

  }

  private setSize() {
    this.height = this.container?.nativeElement.offsetHeight;
    this.width = this.container?.nativeElement.offsetWidth;
    this.setArcs();
    if (this.svg) {
      this.svg.attr('width', this.width);
      this.svg.attr('height', this.height);
    }
    if (this.dataContainer) {
      this.dataContainer.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
    }
    if (this.pie) {
      console.log('update', this.data);
      this.buildPieChart(this.data);
    }
  }

  private generateUniqId(): string {
    DonutChartComponent.incrementId++;
    return 'donutChart' + DonutChartComponent.incrementId;

  }

  init() {
    if (this.container) {
      const containerId: string = this.generateUniqId();
      this.container.nativeElement.id = containerId;
      this.setSize();
      this.initSvg(containerId);
    }



    this.setArcs();
    this.pie = d3.pie<{ label: string, value: number; }>().value(d => d.value).sort((a, b) => {
      if (a.value < b.value) { return -1; }
      if (a.value > b.value) { return 1; }
      return 0;
    });


    this.drawDonut();


  }

  setArcs() {
    const radius = Math.min(this.width, this.height) / 2;
    const innerRadius = this.innerRadiusRatio ? (radius * 0.6) * (this.innerRadiusRatio / 100) : 0; // percent ratio

    this.arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius * 0.6);
    this.outerArc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.7);
  }

  /**
   * init the whole svg container
   */
  private initSvg(containerId: string) {
    const select = d3.select('#' + containerId);
    console.log('container select', select);
    this.svg = select.append('svg');










  }

  private initContainer() {
    if (this.svg) {
      this.dataContainer = this.svg.append('g').classed('container', true).attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
    }

  }

  private drawDonut() {
    this.initContainer();
    this.buildPieChart(this.data);

  }


  private buildPieChart(data: { label: string, value: number; }[]) {
    if (this.dataContainer && this.pie) {


      const pieData = this.pie(data);




      const colorsScale = d3.scaleOrdinal(this.colors);




      this.dataContainer.selectAll("g.arc")
        .data(pieData)
        .enter()
        .append("g")
        .attr("class", "arc")
        .append('path');
      /**/

      this.dataContainer.selectAll("g.arc").select('path')
        .attr("fill", (d, i) => {
          console.log(d, i);
          return colorsScale(i.toString());
        })
        //.attr("d", this.arc as any)
        .transition()
        .duration(1000)
        .attrTween("d", (d: any, index, n) => {
          return this.pieTransition(d, index, n) as any;
        });


      //


      this.buildLegendLines(data, this.dataContainer);
      this.buildLegends(data, this.dataContainer);
      this.dataContainer.selectAll("g.arc").exit().remove();
    }


  }



  private buildLegendLines(data: { label: string, value: number; }[], group: Selection<SVGGElement, unknown, HTMLElement, any>) {
    if (this.pie) {
      const pieData = this.pie(data);
      group.selectAll('polyline')
        .data(pieData)
        .enter()
        .append('polyline')
        .style("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1);


      group.selectAll('polyline')
        .transition()
        .duration(1000)
        .attrTween("points", (d: any, index, n) => {

          return this.lineAttrTween(d, index, n) as any;
        });

      group.exit().remove();
    }

  }

  private buildLegends(data: { label: string, value: number; }[], group: Selection<SVGGElement, unknown, HTMLElement, any>) {
    if (this.pie) {
      const pieData = this.pie(data);
      group.selectAll('text')
        .data(pieData)
        .enter()
        .append('text');

      group.selectAll('text').text((d: any) => {
        return d.data.label;
      })
        .transition()
        .duration(1000)
        .attrTween("transform", (d: any, index, n) => {
          return this.legentAttrTween(d, index, n);
        }).styleTween('text-anchor', (d, i, n) => {
          return this.legentStyleTween(d, i, n);
        });
      group.selectAll('text').exit().remove();

    }

  }

  private pieTransition(d: any, index: number, n: any) {

    const interpolate = this.getInterpolation(d, index, n);

    return (t: any) => {
      if (this.arc) {
        return this.arc(interpolate(t));
      }

      return '';
    };

  }


  private legentAttrTween(d: any, index: number, n: any) {
    console.log('legend', n[index]._currentData);
    const interpolate = this.getInterpolation(d, index, n);

    return (t: any) => {
      if (this.outerArc) {
        const radius = Math.min(this.width, this.height) / 2;
        var d2 = interpolate(t);
        var pos = this.outerArc.centroid(d2);
        pos[0] = radius * 0.7 * (this.getMidAngle(d2.startAngle, d2.endAngle) < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      }
      return "translate(" + [0, 0] + ")";
    };
  }

  private legentStyleTween(d: any, index: number, n: any) {
    const interpolate = this.getInterpolation(d, index, n);


    //this._current = interpolate(0);
    return (t: any) => {
      const d2 = interpolate(t);
      return this.getMidAngle(d2.startAngle, d2.endAngle) < Math.PI ? "start" : "end";
    };
  }

  private lineAttrTween(d: any, index: number, n: any) {

    const interpolate = this.getInterpolation(d, index, n);

    return (t: any) => {
      if (this.outerArc && this.arc) {
        const radius = Math.min(this.width, this.height) / 2;
        var d2 = interpolate(t);
        var pos = this.outerArc.centroid(d2);
        pos[0] = radius * 0.7 * (this.getMidAngle(d2.startAngle, d2.endAngle) < Math.PI ? 1 : -1);
        return [this.arc.centroid(d2), this.outerArc.centroid(d2), pos];
      }
      return [0, 0, 0];
    };

  }

  private getMidAngle(startAngle: number, endAngle: number): number {
    return startAngle + (endAngle - startAngle) / 2;
  }

  private getInterpolation(d: any, i: number, n: any) {
    const element = n[i];
    if (!element._currentData) {
      const lastElement = n[i - 1];
      const startAngle = (lastElement && lastElement._currentData) ? lastElement._currentData.endAngle : d.startAngle; // angle de depart par rapport a l'angle de fin du dernier
      const endAngle = (lastElement && lastElement._currentData) ? lastElement._currentData.endAngle : d.endAngle; // angle de depart par rapport a l'angle de fin du dernier
      const startingData = {
        ...d,
        startAngle: startAngle,
        endAngle: startAngle // size 0 angle de fin  = angle de depart
      };
      const startInterpolate = d3.interpolate(startingData, d);
      const interpolate = d3.interpolate(element._currentData, d);
      element._currentData = interpolate(0);
      return startInterpolate;
    }
    else {
      element._currentData = element._currentData || d;
      const interpolate = d3.interpolate(element._currentData, d);
      element._currentData = interpolate(0);
      return interpolate;
    }

  }


  ngOnDestroy(): void {
    if (this.container && this.resizeObserver) {
      this.resizeObserver?.unobserve(this.container.nativeElement);
    }
  }


}
