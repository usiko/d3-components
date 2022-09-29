import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Selection } from 'd3';
import * as d3 from 'd3';
@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit, AfterViewInit {
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setSize();

  }
  @ViewChild('container') container?: ElementRef;
  @Input() colors: string[] = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"];
  @Input() innerRadiusRatio: number = 0;
  static incrementId = 0;
  public containerId = '';

  private height = 0;
  private width = 0;

  private svg?: Selection<SVGSVGElement, unknown, HTMLElement, any>;

  constructor() { }

  ngOnInit(): void {
    this.containerId = this.generateUniqId();
  }

  ngAfterViewInit(): void {
    if (this.container) {
      const containerId: string = this.generateUniqId();
      this.container.nativeElement.id = containerId;
      this.setSize();
      this.initSvg(containerId);



    }
  }

  private setSize() {
    this.height = this.container?.nativeElement.offsetHeight;
    this.width = this.container?.nativeElement.offsetWidth;
  }

  private generateUniqId(): string {
    DonutChartComponent.incrementId++;
    return 'donutChart' + DonutChartComponent.incrementId;

  }

  /**
 * init the whole svg container
 */
  private initSvg(containerId: string) {
    const select = d3.select('#' + containerId);
    console.log('container select', select);
    this.svg = select.append('svg');


    this.svg.attr('width', this.container?.nativeElement.offsetWidth);
    this.svg.attr('height', this.container?.nativeElement.offsetHeight);




    this.drawDonut();



  }

  private drawDonut() {
    this.buildPieChart();

  }


  private buildPieChart() {
    if (this.svg) {


      const group = this.svg.append('g').attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
      const radius = Math.min(this.width, this.height) / 2;


      const mockData = [2, 4, 9, 12];
      const colorsScale = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);
      const pie = d3.pie();
      const innerRadius = this.innerRadiusRatio ? radius * (this.innerRadiusRatio / 100) : 0; // percent ratio
      const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);
      const arcs = group.selectAll("arc")
        .data(pie(mockData))
        .enter()
        .append("g")
        .attr("class", "arc");
      arcs.append('path').attr("fill", (d, i) => {
        return colorsScale(i.toString());
      }).attr("d", arc as any);

    }
  }

  private buildBorders() {

  }

  private buildLegends() {

  }

}
