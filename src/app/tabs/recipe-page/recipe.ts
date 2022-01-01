export interface Recipe{
    Author: Author,
    AvgRating: number,
    ImageURL: string,
    PortionSize: number,
    TimeMin: string,
    Title: string
}

interface Author{
    Name: string,
    ImageUrl: string
}

export interface Tip{
    Icon: string,
    Description: string,
    Color: string
}

export interface Ingredient{
    Icon: string,
    Name: string,
    Quantity: number,
    QuantityType: QuantityType
}

interface QuantityType{
    For: string,
    Name: string,
    Short: string
}