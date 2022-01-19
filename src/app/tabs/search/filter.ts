export interface Filter{
    search: string,
    category: string,
    difficulty: string,
    orderBy: string,
}

export interface FilterValue{
    title: string,
    value: string,
}

export const orderByList: FilterValue[] = [
    {title: 'Relevancia', value: 'relevant'},
    {title: 'Mejor calificados', value: 'rating'},
    {title: 'Más recientes', value: 'recent'},
];
