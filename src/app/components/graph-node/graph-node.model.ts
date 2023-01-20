import { ClusterNode, Edge, Node } from '@swimlane/ngx-graph';

export interface IGraphConfig {
	nodeSize: number;
	labelHeight: number;
}

export interface IGraphLink extends Edge {
	meta?: {
		color?: string;
		width?: number;
		markerEnd?: string;
		cssClass?: string;
	};
}

export interface IGraphNode extends Node {
	meta?: {
		color: string;
		backgroundColor?: string;

		icon?: {
			font?: {
				fontFamily?: string;
				frontSize?: string;
				color?: string;
				name: string;
			};

			image?: {
				height?: number;
				width?: number;
				src: string;
			};
			svg?: {
				height?: number;
				width?: number;
				src: string;
				color?: string;
			};

			cssClass?: string;
		};
		cssClass?: string;
		label?: {
			color?: string;
			fontSize?: string;
			fontFamily?: string;
			cssClass?: string;
		};
	};
	data: {
		value: number;
	};
}
export interface IGraphClusterNode extends ClusterNode {
	meta?: {
		color: string;
		backgroundColor?: string;
		icon?: {
			font?: {
				fontFamily?: string;
				frontSize?: string;
				color?: string;
				name: string;
			};

			image?: {
				height?: number;
				width?: number;
				src: number;
			};
			svg?: {
				height?: number;
				width?: number;
				src: string;
				color?: string;
			};

			cssClass?: string;
		};
		cssClass?: string;
		label?: {
			color?: string;
			fontSize?: string;
			fontFamily?: string;
			cssClass?: string;
		};
	};
	data?: {
		value: number;
	};
}
