import { Component, OnInit } from '@angular/core';
import { IGraphClusterNode, IGraphLink, IGraphNode } from 'src/app/components/graph-node';
import { IPieData } from './components/donut-chart/model';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	title = 'd3';
	pieData: IPieData[] = [];
	selectedItemDonut: string = '';
	hoveredItemDonut: string = '';

	nodes: IGraphNode[] = [];
	clusters: IGraphClusterNode[] = [];
	links: IGraphLink[] = [];
	ngOnInit() {
		this.pieData = [
			/*{ label: 'option2', value: 10 },
      { label: 'option3', value: 15 }*/
		];
		setTimeout(() => {
			this.pieData = [
				{ id: 'ts', label: { name: 'Typescript', picture: 'test' }, value: 12, clickable: true, activeStroke:{color:'rgba(255,0,0)', width:4} },
				{ id: 'ng', label: { name: 'Angular', picture: 'test' }, value: 10, clickable: true },
				{ id: 'io', label: { name: 'Ionic', picture: 'test' }, value: 8, clickable: true },

				{ id: 'ngrx', label: { name: 'NGRX', picture: 'test' }, value: 5, clickable: true },
				{ id: 'jq', label: { name: 'JQuery', picture: 'test' }, value: 4, clickable: true },
				{ id: 'd3', label: { name: 'D3js', picture: 'test' }, value: 5, clickable: true },

				{ id: 'sass', label: { name: 'Sass', picture: 'test' }, value: 25, clickable: true },
				{ id: 'html', label: { name: 'Html', picture: 'test' }, value: 15, clickable: true },
			];
		}, 1000);
		setTimeout(() => {
			this.nodes = [
				{
					id: '1',
					label: 'Node A',

					data: {
						value: 1,
					},
					meta: {
						color: 'red',
						icon: {
							name: 'A',
							frontSize: '2em',
							color: 'green',
						},
						label: {
							color: 'purple',
							fontFamily: 'arial',
						},
					},
				},
				{
					id: '2',
					label: 'Node B',
					data: {
						value: 1,
					},
					meta: {
						color: 'blue',
						icon: {
							name: 'A',
						},
					},
				},
				{
					id: '3',
					label: 'Node C',
					data: {
						value: 1,
					},
					meta: {
						color: 'green',
						icon: {
							name: 'C',
						},
					},
				},
				{
					id: '4',
					label: 'Node D',
					data: {
						value: 1,
					},
				},
				{
					id: '5',
					label: 'Node E',
					data: {
						value: 1.5,
					},
				},
				{
					id: '6',
					label: 'Node F',
					data: {
						value: 2,
					},
				},
				{
					id: '7',
					label: 'Node G',
					data: {
						value: 2,
					},
				},
			];
			this.links = [
				{
					id: 'a',
					source: '1',
					target: '2',
					meta: {
						color: 'red',
						width: 3,
					},
				},
				{
					id: 'b',
					source: '1',
					target: '3',
					meta: {
						color: 'green',
						width: 3,
					},
				},
				{
					id: 'c',
					source: '3',
					target: '4',
					meta: {
						color: 'purple',
						width: 3,
					},
				},
				{
					id: 'f',
					source: '2',
					target: '6',
					meta: {
						color: 'purple',
						width: 1,
					},
				},
				{
					id: 'g',
					source: '5',
					target: '7',
					meta: {
						color: 'yellow',
						width: 2,
					},
				},
			];
		}, 1000);
	}

	onNodeOpen(node: IGraphNode) {
		console.log(node);
	}

	selectItemDonut(id: string) {
		this.selectedItemDonut = id;
	}
	hoverItemDonut(id: string) {
		this.hoveredItemDonut = id;
	}
}
