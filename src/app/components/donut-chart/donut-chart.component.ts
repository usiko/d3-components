import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Selection, Arc, PieArcDatum, Pie, selection } from 'd3';
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
    },
    {
      label: 'optionsc=1',
      value: 1,
    }
  ];
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

  private angleInterpolation?: any;
  constructor() { }

  ngOnInit(): void {
    this.containerId = this.generateUniqId();

  }

  ngAfterViewInit(): void {
    this.init();
  }

  private setSize() {
    this.height = this.container?.nativeElement.offsetHeight;
    this.width = this.container?.nativeElement.offsetWidth;
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

    const radius = Math.min(this.width, this.height) / 2;
    const innerRadius = this.innerRadiusRatio ? (radius * 0.6) * (this.innerRadiusRatio / 100) : 0; // percent ratio

    this.arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius * 0.6);
    this.outerArc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.7);

    this.pie = d3.pie<{ label: string, value: number; }>().value(d => d.value).sort((a, b) => {
      if (a.value < b.value) { return -1; }
      if (a.value > b.value) { return 1; }
      return 0;
    });
    this.angleInterpolation = d3.interpolate(this.pie.startAngle(), this.pie.endAngle());

    this.drawDonut();
    setInterval(() => {
      this.data[0].value++;
      this.data.push({
        label: 'test',
        value: 2
      });
      if (this.pie) {
        console.log('update', this.data);
        this.buildPieChart(this.data);
      }

    }, 2000);

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








  }

  private initContainer() {
    if (this.svg) {
      this.dataContainer = this.svg.append('g').attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
    }

  }

  private drawDonut() {
    this.initContainer();
    this.buildPieChart(this.data);

  }


  private buildPieChart(data: { label: string, value: number; }[]) {
    if (this.dataContainer && this.pie) {


      const pieData = this.pie(data);




      const colorsScale = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);



      /*dataSelect.join(enter =>
        enter
        .append('g')
        .attr("class", "arc")
        .append('path'),
        update => update.call(selection => {
        selection.select('path')
          .attr("fill", (d, i) => {
          console.log(d, i);
          return colorsScale(i.toString());
          }).attr("d", this.arc as any);
        })
      );*/
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
        .attr("d", this.arc as any)
        .transition()
        .duration(1000)
        .attr("endAngle", (d: any) => {
          return d.endAngle;
        }) // binding the new end Angle to the arc for later reference to work out what previous end angle was
        .attr("startAngle", (d: any) => {
          return d.startAngle;
        }) // binding the new end Angle to the arc for later reference to work out what previous end angle was
        .attrTween("d", (d: any, index, n) => {

          return this.pieTransition(d, index, n) as any;





        });


      //


      this.buildLegendLines(data, this.dataContainer);
      this.buildLegends(data, this.dataContainer);
    }


  }



  private buildLegendLines(data: { label: string, value: number; }[], group: Selection<SVGGElement, unknown, HTMLElement, any>) {
    const radius = Math.min(this.width, this.height) / 2;
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
        /*.attr('points', (d: any) => {
          if (this.arc && this.outerArc) {
            console.log('polyline', d);
            const posA = this.arc.centroid(d); // line insertion in the slice
            const posB = this.outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
            const posC = this.outerArc.centroid(d); // Label position = almost the same as posB
            console.log(d, posA, posB, posC);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.7 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            return [posA, posB, posC] as any;
          }
          return [];
        })*/
        .attrTween("points", (d: any, index, n) => {

          return this.lineAttrTween(d, index, n) as any;





        });
    }

  }

  private buildLegends(data: { label: string, value: number; }[], group: Selection<SVGGElement, unknown, HTMLElement, any>) {
    const radius = Math.min(this.width, this.height) / 2;
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
        /*.attr('transform', (d: any) => {
          if (this.outerArc) {
            var pos = this.outerArc.centroid(d);
            const midangle = this.getMidAngle(d.startAngle, d.endAngle);
            pos[0] = radius * 0.7 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
          }
          return '';

        })
        .style('text-anchor', (d: any) => {
          const midangle = this.getMidAngle(d.startAngle, d.endAngle);
          return (midangle < Math.PI ? 'start' : 'end');
        })*/
        .attrTween("transform", (d: any, index, n) => {
          return this.legentAttrTween(d, index, n);
        }).styleTween('text-anchor', (d, i, n) => {
          return this.legentStyleTween(d, i, n);
        });
      //group.selectAll('text').exit().remove();

    }

  }

  private pieTransition(d: any, index: number, n: any) {
    /*const selection = d3.select(n[index]);
    const lastEndAngle = selection.attr("endAngle");
    const lastStartAngle = selection.attr("startAngle");
    let lastselection: any;
    if (n[index - 1]) {
      lastselection = d3.select(n[index - 1]);
    }
    const interpolate1 = d3.interpolate((lastEndAngle !== null) ? lastEndAngle : (lastselection?.attr("endAngle") || 0), d.endAngle);
    const interpolate2 = d3.interpolate((lastStartAngle !== null) ? lastStartAngle : (lastselection?.attr("endAngle") || 0), d.startAngle);
    return (t: any) => {
      //console.log(t, d);
      d.endAngle = interpolate1(t);
      d.startAngle = interpolate2(t);
      if (this.arc) {
        return this.arc(d) as any;
      }
      return 0;
       };*/

    const interpolate = this.getInterpolation(d, index, n);

    return (t: any) => {
      if (this.arc) {
        return this.arc(interpolate(t));
      }

      return '';
    };

  }


  /*private legendTransition(d: any, index: number, n: any) {
    const radius = Math.min(this.width, this.height) / 2;
    var pos: number[] = this.outerArc?.centroid(d) || [0, 0];
    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    pos[0] = radius * 0.7 * (midangle < Math.PI ? 1 : -1);
    const selection = d3.select(n[index]);
    const lastPos = selection.attr("pos").split(',');
    const interpolate1 = d3.interpolate(lastPos[0], pos[0] as any);
    const interpolate2 = d3.interpolate(lastPos[1], pos[1] as any);
    return (t: any) => {
      //console.log(t, d);
      return 'translate(' + [interpolate1(t), interpolate2(t)] + ')';
    };
  }*/

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



}
