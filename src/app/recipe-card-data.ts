export interface RecipeCardData {
    Title: string,
    ImageURL: string,
    PortionSize: number,
    TimeMin:  number,
    AvgRating,
    Author: Author
}

interface Author{
    Name: string,
    ImageURL: string
}