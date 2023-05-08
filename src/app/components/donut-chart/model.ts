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
