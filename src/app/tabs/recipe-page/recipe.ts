export interface Recipe{
    UID: string,
    Author: Author,
    AvgRating: number,
    ImageURL: string,
    PortionSize: number,
    TimeMin: string,
    Title: string
}

export interface RecipeData{
    Ingredients: Ingredient[],
    Ratings: Rating[],
    Steps: string[],
    Tips: Tip[]
}


interface Author{
    Name: string,
    ImageUrl: string
}

interface Tip{
    Icon: string,
    Description: string,
    Color: string
}

interface Ingredient{
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

interface Rating{
    Rating: number,
    User: string,
    UserImageURL
}