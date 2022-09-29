import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Selection, Arc, PieArcDatum } from 'd3';
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
  @Input() data: { label: string, value: number; }[] = [
    {
      label: 'optionsA=2',
      value: 2,
    },
    {
      label: 'optionsB=5',
      value: 5,
    },
    {
      label: 'optionsc=10',
      value: 5,
    }
  ];
  static incrementId = 0;
  public containerId = '';

  private height = 0;
  private width = 0;

  private svg?: Selection<SVGSVGElement, unknown, HTMLElement, any>;

  private arc?: Arc<any, d3.DefaultArcObject>;
  private outerArc?: Arc<any, d3.DefaultArcObject>;
  private pieData?: PieArcDatum<{ label: string, value: number; }>[];

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


    const pie = d3.pie<{ label: string, value: number; }>().value(d => d.value);
    this.pieData = pie(this.data);
    this.drawDonut();



  }

  private drawDonut() {
    this.buildPieChart();

  }


  private buildPieChart() {
    if (this.svg && this.pieData) {


      const group = this.svg.append('g').attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
      const radius = Math.min(this.width, this.height) / 2;



      const colorsScale = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

      const innerRadius = this.innerRadiusRatio ? (radius * 0.6) * (this.innerRadiusRatio / 100) : 0; // percent ratio
      this.arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius * 0.6);
      this.outerArc = d3.arc()
        .innerRadius(radius * 0.7)
        .outerRadius(radius * 0.7);
      const arcs = group.selectAll("g.arc")
        .data(this.pieData)
        .enter()
        .append("g")
        .attr("class", "arc");
      arcs.append('path').attr("fill", (d, i) => {
        return colorsScale(i.toString());
      }).attr("d", this.arc as any);
      this.buildLegendLines(group, radius);
      this.buildLegends(group, radius);
    }


  }

  private buildLegendLines(group: Selection<SVGGElement, unknown, HTMLElement, any>, radius: number) {

    if (this.pieData) {
      group.selectAll('polyline')
        .data(this.pieData)
        .enter()
        .append('polyline')
        .style("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr('points', (d: any) => {
          if (this.arc && this.outerArc) {
            const posA = this.arc.centroid(d); // line insertion in the slice
            const posB = this.outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
            const posC = this.outerArc.centroid(d); // Label position = almost the same as posB
            console.log(d, posA, posB, posC);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.7 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            return [posA, posB, posC] as any;
          }
          return [];
        });
    }

  }

  private buildLegends(group: Selection<SVGGElement, unknown, HTMLElement, any>, radius: number) {
    if (this.pieData) {
      group.selectAll('text')
        .data(this.pieData)
        .enter()
        .append('text')
        .text((d) => {
          return d.data.label;
        })
        .attr('transform', (d: any) => {
          if (this.outerArc) {
            var pos = this.outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = radius * 0.7 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
          }
          return '';

        })
        .style('text-anchor', (d: any) => {
          var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          return (midangle < Math.PI ? 'start' : 'end');
        });
    }

  }


}
