export interface IPieData {
	label: { name: string; picture?: string };
	value: number;
	id: string;
    color?: string;
    activeStroke?: {
        color: string,
        width:number
    }
	clickable?: boolean;
}

export interface IDonutData{
    pies: IPieData[],
    description?:string
}

export class DonutData implements IDonutData{
    pies: IPieData[] = []
    description?: string
    constructor(options?: IDonutData)
    {
        this.pies = options?.pies??[];
        this.description = options?.description
    }
}