import { ClusterNode, Edge, Node } from "@swimlane/ngx-graph";

export interface IGraphLink extends Edge {
  meta?: {
    color?: string,
    width?: number,
    markerEnd?: string,
    cssClass?: string;
  };
}

export interface IGraphNode extends Node {
  meta?: {
    color: string,

    icon?: {
      name?: string,
      fontFamily?: string,
      frontSize?: string,
      color?: string,
      cssClass?: string,
    };
    cssClass?: string,
    label?: {
      color?: string,
      fontSize?: string,
      fontFamily?: string,
      cssClass?: string,
    };
  };
  data: {
    value: number;
  };

}
export interface IGraphClusterNode extends ClusterNode {
  meta?: {
    color: string,

    icon?: {
      name?: string,
      fontFamily?: string,
      frontSize?: string,
      color?: string,
      cssClass?: string,
    };
    cssClass?: string,
    label?: {
      color?: string,
      fontSize?: string,
      fontFamily?: string,
      cssClass?: string,
    };
  };
  data?: {
    value: number;
  };

}
