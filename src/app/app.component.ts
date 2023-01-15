import { Component, OnInit } from '@angular/core';
import { IGraphClusterNode, IGraphLink, IGraphNode } from 'src/app/components/graph-node';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'd3';
    pieData: { label: string, value: number; }[] = [];
    nodes: IGraphNode[] = [];
    clusters: IGraphClusterNode[] = [];
    links: IGraphLink[] = [];
    ngOnInit() {
        this.pieData = [
            { label: 'option1', value: 100 },
            /*{ label: 'option2', value: 10 },
            { label: 'option3', value: 15 }*/
        ];
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
                            font: {
                                name: 'A',
                                frontSize: "2em",
                                color: 'green'
                            }
                        },
                        label: {
                            color: "purple",
                            fontFamily: "arial"

                        }
                    }
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
                            image: {
                                src: 'https://picsum.photos/50/50'
                            }
                        }
                    }

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
                            font: {
                                name: 'C'
                            }
                        }
                    }
                },
                {
                    id: '4',
                    label: 'Node D',
                    data: {
                        value: 1
                    }
                },
                {
                    id: '5',
                    label: 'Node E',
                    data: {
                        value: 1.5
                    }
                },
                {
                    id: '6',
                    label: 'Node F',
                    data: {
                        value: 2
                    }
                },
                {
                    id: '7',
                    label: 'Node G',
                    data: {
                        value: 2
                    }
                }
            ];
            this.links = [

                {
                    id: 'a',
                    source: '1',
                    target: '2',
                    meta: {
                        color: 'red',
                        width: 3
                    }
                },
                {
                    id: 'b',
                    source: '1',
                    target: '3',
                    meta: {
                        color: 'green',
                        width: 3
                    }
                },
                {
                    id: 'c',
                    source: '3',
                    target: '4',
                    meta: {
                        color: 'purple',
                        width: 3
                    }
                },
                {
                    id: 'f',
                    source: '2',
                    target: '6',
                    meta: {
                        color: 'purple',
                        width: 1
                    }
                },
                {
                    id: 'g',
                    source: '5',
                    target: '7',
                    meta: {
                        color: 'yellow',
                        width: 2
                    }
                }
            ];
        }, (1000));
    }

    onNodeOpen(node: IGraphNode) {
        console.log(node);
    }
}
