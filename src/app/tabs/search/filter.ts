export interface Filter{
    search: string,
    category: string,
    difficulty: number,
    orderBy: string,
}

export interface FilterValue{
    title: string,
    value: string,
}

export const orderByList: FilterValue[] = [
    {title: 'Relevancia', value: 'relevant'},
    {title: 'Calificación', value: 'rating'},
    {title: 'Recientes', value: 'recent'},
];
