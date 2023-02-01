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
                    label: 'Node A'
                    , data: {
                        value: 4
                    }
                }, {
                    id: '2',
                    label: 'Node B',
                    data: {
                        value: 4,
                        tooltipData:{
                            title:'node a',
                            subTitle:'super node with a letter',
                            content:'more content about this awesome node A'
                          }
                    }
                }, {
                    id: '3',
                    label: 'Node C',
                    data: {
                        value: 4
                    }
                }, {
                    id: '4',
                    label: 'Node D',
                    data: {
                        value: 4
                    }
                }, {
                    id: '5',
                    label: 'Node E',
                    data: {
                        value: 4
                    }
                },
                {
                    id: '6',
                    label: 'Node F',
                    data: {
                        value: 4
                    }
                },
                {
                    id: '7',
                    label: 'Node G',
                    data: {
                        value: 4
                    }
                },
                {
                    id: '8',
                    label: 'Node H',
                    data: {
                        value: 4
                    }
                },
                {
                    id: '9',
                    label: 'Node I',
                    data: {
                        value: 4,
                        tooltipData:{
                            title:'node D',
                            subTitle:'super node with d letter',
                            content:'more content about this awesome node D, better than C'
                          }
                    }
                }
            ]
            this.links = [{
                id: 'a',
                source: '1',
                target: '2',
                meta: {
                    color: "blue"
                }
            },
            {
                id: 'azaz',
                source: '1',
                target: '4',
                meta: {
                    color: "purple"
                }
            },
            {
                id: 'azaz18',
                source: '1',
                target: '8',
                meta: {
                    color: "yellow"
                }
            },
            {
                id: 'azaz17',
                source: '1',
                target: '7',
                meta: {
                    color: "black"
                }
            },
            {
                id: 'azazazaz',
                source: '1',
                target: '5',
                meta: {
                    color: "green"
                }
            },
            {
                id: 'bbbbb',
                source: '2',
                target: '5',
                meta: {
                    color: "grey"
                }
            },
            {
                id: 'ccccc',
                source: '3',
                target: '6',
                meta: {
                    color: "orange"
                }
            },
            {
                id: 'dddd',
                source: '4',
                target: '6',
                meta: {
                    color: "blue"
                }
            },
            {
                id: 'bazazazaz',
                source: '1',
                target: '3',
                meta: {
                    color: "pink"
                }
            }, {
                id: 'c',
                source: '3',
                target: '4',
                meta: {
                    color: "marron"
                }
            }, {
                id: 'd',
                source: '3',
                target: '5',
                meta: {
                    color: "blue"
                }
            }, {
                id: 'e',
                source: '4',
                target: '5',
                meta: {
                    color: "blue"
                }
            }, {
                id: 'f',
                source: '2',
                target: '6',
                meta: {
                    color: "red"
                }

            },
            {
                id: 'azaz28',
                source: '2',
                target: '8',
                meta: {
                    color: "red"
                }
            },
            {
                id: 'azaz29',
                source: '2',
                target: '9',
                meta: {
                    color: "red"
                }
            }
            ];
        }, (1000));
    }

    onNodeOpen(node: IGraphNode) {
        console.log(node);
    }
}
