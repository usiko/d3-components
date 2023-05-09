import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { Selection, Arc, PieArcDatum, Pie, selection } from 'd3';
import * as d3 from 'd3';
import { IPieData } from './model';
@Component({
	selector: 'app-donut-chart',
	templateUrl: './donut-chart.component.html',
	styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
	@ViewChild('container') container?: ElementRef;
	@Output() selectItem = new EventEmitter<string>();
	@Output() hoverItem = new EventEmitter<string>();

	@Input() colors: string[] = ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56'];
	@Input() innerRadiusRatio: number = 0;
	@Input() data: IPieData[] = [];
	@Input() legend = true;
	@Input() selectedId: string = '';
	@Input() hoveredId: string = '';
	static incrementId = 0;
	public containerId = '';

	private height = 0;
	private width = 0;

	private svg?: Selection<SVGSVGElement, unknown, HTMLElement, any>;
	private dataContainer?: Selection<SVGGElement, unknown, HTMLElement, any>;

	private arc?: Arc<any, d3.DefaultArcObject>;
	private outerArc?: Arc<any, d3.DefaultArcObject>;

	private pie?: Pie<any, IPieData>;

    private resizeObserver?: ResizeObserver;
    private ready: boolean = false;
	constructor() {}

	ngOnInit(): void {
		this.containerId = this.generateUniqId();
		this.resizeObserver = new ResizeObserver((entries) => {
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
                this.ready = false;
				console.log('update', this.data);
				this.data = this.data.sort((a, b) => {
					if (a.value < b.value) {
						return -1;
					}
					if (a.value > b.value) {
						return 1;
					}
					return 0;
				});
				this.buildPieChart(this.data);
			}
		}
		if (changes['hoveredId']) {
			console.log('update', this.hoveredId);
			this.hoverAnimate();
		}
		if (changes['selecteId']) {
			this.hoverAnimate();
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
			this.dataContainer.attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
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
		this.pie = d3
			.pie<IPieData>()
			.value((d) => d.value)
			.sort((a, b) => {
				if (a.value < b.value) {
					return -1;
				}
				if (a.value > b.value) {
					return 1;
				}
				return 0;
			});

		this.drawDonut();
	}

	setArcs() {
		const radius = Math.min(this.width, this.height) / 2;
		const innerRadius = this.innerRadiusRatio ? radius * 0.6 * (this.innerRadiusRatio / 100) : 0; // percent ratio

		this.arc = d3
			.arc()
			.innerRadius(innerRadius)
			.outerRadius(radius * 0.6);
		this.outerArc = d3
			.arc()
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
			this.dataContainer = this.svg
				.append('g')
				.classed('container', true)
				.attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
		}
	}

	private drawDonut() {
		this.initContainer();
		this.buildPieChart(this.data);
	}

	private buildPieChart(data: IPieData[]) {
		if (this.dataContainer && this.pie) {
			const pieData = this.pie(data);

			const colorsScale = d3.scaleOrdinal(this.colors);

			this.dataContainer
				.selectAll('g.arc')
				.data(pieData)
				.enter()
				.append('g')
				.attr('class', (d) => {
					return 'arc id-' + d.data.id;
				})

				.append('path')
				.each((d, i, n) => {
					const selection = d3.select(n[i]);
					selection.on('mouseenter', (event, data) => {
						if (d.data.clickable) {
							this.onMouseenterItem(d.data.id);
						}
					});
					selection.on('mouseleave', (event, data) => {
						//console.log(i);
						if (d.data.clickable && (!this.selectedId || d.data.id !== this.selectedId)) {
							this.onMouseleaveItem(d.data.id);
						}
					});
					selection.on('click', (event, d: any) => {
						this.onSelectItem(d.data.id);
					});
					selection.attr('style', (d: any) => {
						if (d.data.clickable) {
							return 'cursor:pointer';
						}
						return '';
					});
				});

			this.dataContainer
                .selectAll('g.arc')
                
                .select('path')
                .attr('stroke-width', '0px')
                .attr('stroke', (d:any) => {
                    return d.data.activeStroke?.color;
                })
				.attr('fill', (d: any, i) => {
					console.log(d, i);
					if (d.data.color) {
						return d.data.color;
					}
					return colorsScale(i.toString());
				})
				//.attr("d", this.arc as any)
				.transition()
				.duration(1000)
				.attrTween('d', (d: any, index, n) => {
					return this.pieTransition(d, index, n) as any;
                }).
                on('end', () => {
                    this.ready = true;
                })

			//

			if (this.legend) {
				this.buildLegendLines(data, this.dataContainer);
				this.buildLegends(data, this.dataContainer);
			}

			this.dataContainer.selectAll('g.arc').exit().remove();
		}
	}

	private buildLegendLines(data: IPieData[], group: Selection<SVGGElement, unknown, HTMLElement, any>) {
		if (this.pie) {
			const pieData = this.pie(data);
			const g = group
				.selectAll('polyline')
				.data(pieData)
				.enter()
				.append('g')
				.attr('class', (d) => {
					return 'legend-line id-' + d.data.id;
				})
				.attr('style', (d) => {
					if (d.data.clickable) {
						return 'cursor:pointer';
					}
					return '';
				});
			g.append('polyline').style('fill', 'none').attr('stroke', 'black').attr('stroke-width', 1);

			g.on('mouseenter', (event, d) => {
				if (d.data.clickable) {
					this.onMouseenterItem(d.data.id);
				}
			});
			g.on('mouseleave', (event, d) => {
				//console.log(i);
				if (d.data.clickable && (!this.selectedId || d.data.id !== this.selectedId)) {
					this.onMouseleaveItem(d.data.id);
				}
			});
			g.on('click', (d) => {
				this.onSelectItem(d.data.id);
			});

			group
				.selectAll('polyline')
				.transition()
				.duration(1000)
				.attrTween('points', (d: any, index, n) => {
					return this.lineAttrTween(d, index, n) as any;
				});

			group.exit().remove();
		}
	}

	private buildLegends(data: IPieData[], group: Selection<SVGGElement, unknown, HTMLElement, any>) {
		if (this.pie) {
			const pieData = this.pie(data);
            group.selectAll('g.legend').remove();
			const enter = group
				.selectAll('text')
				.data(pieData)
				.enter()
				.append('g')
				.attr('class', (d) => {
					return 'legend id-' + d.data.id;
				});
			enter.on('mouseenter', (event, d) => {
				if (d.data.clickable) {
					this.onMouseenterItem(d.data.id);
				}
			});
			enter.on('mouseleave', (event, d) => {
				//console.log(i);
				if (d.data.clickable && (!this.selectedId || d.data.id !== this.selectedId)) {
					this.onMouseleaveItem(d.data.id);
				}
			});
			enter.on('click', (d) => {
				this.onSelectItem(d.data.id);
			});
			enter.attr('style', (d) => {
				if (d.data.clickable) {
					return 'cursor:pointer';
				}
				return '';
			});
			enter.append('text');
			enter.append('image');

			group
				.selectAll('text')
				.text((d: any) => {
					return d.data.label.name;
				})
				.transition()
				.duration(1000)
				.attrTween('transform', (d: any, index, n) => {
					return this.legentAttrTween(d, index, n);
				})
				.styleTween('text-anchor', (d, i, n) => {
					return this.legentStyleTween(d, i, n);
				});
			group.selectAll('text').exit().remove();

			group
				.selectAll('image')
				.attr('xlink:href', (d: any) => {
					if (d.data.label.picture) {
						return d.data.label.picture;
					}
					return '';
                })
                .attr('height','40px')
                .attr('width','40px')

				.transition()
				.duration(1000)
				.attrTween('transform', (d: any, index: any, n: any) => {
					return this.legentAttrPic(d, index, n);
				}); /*.styleTween('text-anchor', (d, i, n) => {
          return this.legentStyleTween(d, i, n);
        });*/
			group.selectAll('image').exit().remove();
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
		console.log('legend', n[index]._currentData, d);
		const interpolate = this.getInterpolation(d, index, n);

		return (t: any) => {
			if (this.outerArc) {
				const radius = Math.min(this.width, this.height) / 2;
				var d2 = interpolate(t);
				var pos = this.outerArc.centroid(d2);
				let margin = 15;
				if (d.data.label.picture) {
					margin = margin * 2 + 40;
				}
				pos[0] = (radius * 0.7 + margin) * (this.getMidAngle(d2.startAngle, d2.endAngle) < Math.PI ? 1 : -1);
				pos[1] = pos[1] + 5; //center verticaly
				return 'translate(' + pos + ')';
			}
			return 'translate(' + [0, 0] + ')';
		};
	}
	private legentAttrPic(d: any, index: number, n: any) {
		console.log('legend', n[index]._currentData);
		const interpolate = this.getInterpolation(d, index, n);

		return (t: any) => {
			if (this.outerArc) {
				const radius = Math.min(this.width, this.height) / 2;
				var d2 = interpolate(t);
				var pos = this.outerArc.centroid(d2);
				const margin = 15;
				//pos[0] = ((radius * 0.7)+margin )* (this.getMidAngle(d2.startAngle, d2.endAngle) < Math.PI ? 1 : -1);
				const side = this.getMidAngle(d2.startAngle, d2.endAngle) < Math.PI ? 1 : -1;
				if (side === 1) {
					pos[0] = (radius * 0.7 + margin) * side;
				} else {
					pos[0] = (radius * 0.7 + margin + 40) * side;
				}
				// pos[0] = ((radius * 0.7)+margin )* (this.getMidAngle(d2.startAngle, d2.endAngle) < Math.PI ? 1 : -1);
				pos[1] = pos[1] - 20; //center verticaly
				return 'translate(' + pos + ')';
			}
			return 'translate(' + [0, 0] + ')';
		};
	}

	private legentStyleTween(d: any, index: number, n: any) {
		const interpolate = this.getInterpolation(d, index, n);

		//this._current = interpolate(0);
		return (t: any) => {
			const d2 = interpolate(t);
			return this.getMidAngle(d2.startAngle, d2.endAngle) < Math.PI ? 'start' : 'end';
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
			const startAngle = lastElement && lastElement._currentData ? lastElement._currentData.endAngle : d.startAngle; // angle de depart par rapport a l'angle de fin du dernier
			const endAngle = lastElement && lastElement._currentData ? lastElement._currentData.endAngle : d.endAngle; // angle de depart par rapport a l'angle de fin du dernier
			const startingData = {
				...d,
				startAngle: startAngle,
				endAngle: startAngle, // size 0 angle de fin  = angle de depart
			};
			const startInterpolate = d3.interpolate(startingData, d);
			const interpolate = d3.interpolate(element._currentData, d);
			element._currentData = interpolate(0);
			return startInterpolate;
		} else {
			element._currentData = element._currentData || d;
			const interpolate = d3.interpolate(element._currentData, d);
			element._currentData = interpolate(0);
			return interpolate;
		}
	}

    private onMouseenterItem(id: string) {
        if (this.ready) {
            this.hoverItem.emit(id);
        }

		/**/
	}

	private onMouseleaveItem(id: string) {
		console.log('leave', id, this.hoveredId);
        if (this.ready)
        {
            if (!this.hoveredId || (this.hoveredId && id !== this.hoveredId)) {
			this.hoverItem.emit(id);
		} else {
			this.hoverItem.emit(undefined);
		}
            }
	}

	private hoverAnimate() {
		d3.selectAll('.arc').transition().duration(350).attr('transform', 'scale(1)');
		d3.selectAll('.arc path').transition().duration(350).attr('stroke-width', '0px');
		d3.selectAll('.legend-line').transition().duration(350).attr('transform', 'scale(1)');
		d3.selectAll('.legend').transition().duration(350).attr('transform', 'scale(1)');

		if (this.hoveredId) {
			let idSelector;
			if (this.selectedId) {
				idSelector = '.id-' + this.hoveredId + ':not(.arc.id-' + this.selectedId + ')';
			} else {
				idSelector = '.id-' + this.hoveredId;
			}
            d3.select('.arc' + idSelector)
                .transition()
                .duration(350)
                .attr('transform', 'scale(1.05)');
            
            	d3.select('.arc' + idSelector+' path')
                .transition()
				.duration(350)
                .attr('stroke-width', (d:any) => {
                    return (d.data.activeStroke?.width||0)+'px'
                })

			d3.selectAll('.legend-line').transition().duration(350).attr('transform', 'scale(0.95)');
			d3.selectAll('.legend').transition().duration(350).attr('transform', 'scale(0.95)');

			d3.select('.legend-line' + idSelector)
				.transition()
				.duration(350)
				.attr('transform', 'scale(1.1)');
			d3.select('.legend' + idSelector)
				.transition()
				.duration(350)
				.attr('transform', 'scale(1.1)');
		}
		if (this.selectedId) {
            d3.select('.arc.id-' + this.selectedId)
                .transition()
                .duration(350)
                .attr('transform', 'scale(1.05)');
            
                d3.select('.arc.id-' + this.selectedId+ ' path')
                .transition()
				.duration(350)
				.attr('stroke-width', (d:any) => {
                    return (d.data.activeStroke?.width||0)+'px'
                })

			d3.selectAll('.legend-line').transition().duration(350).attr('transform', 'scale(0.95)');
			d3.selectAll('.legend').transition().duration(350).attr('transform', 'scale(0.95)');

			d3.select('.legend-line.id-' + this.selectedId)
				.transition()
				.duration(350)
				.attr('transform', 'scale(1.1)');
			d3.select('.legend.id-' + this.selectedId)
				.transition()
				.duration(350)
				.attr('transform', 'scale(1.1)');
		}
	}

	private onSelectItem(id: string) {
		if (this.selectedId === id) {
			this.selectItem.emit(undefined);
			this.onMouseleaveItem(id);
		} else {
			this.selectItem.emit(id);
		}
	}

	ngOnDestroy(): void {
		if (this.container && this.resizeObserver) {
			this.resizeObserver?.unobserve(this.container.nativeElement);
		}
	}
}
