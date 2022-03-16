export interface Recipe{
    UID: string,
    Author: Author,
    AvgRating: number,
    ImgURL: string,
    PortionSize: number,
    TimeMin: string,
    Title: string,
    Category: string[],
    Difficulty: string,
}

export interface RecipeData{
    Ingredients: Ingredient[],
    Ratings: Rating[],
    Steps: string[],
    Tips: Tip[]
}

export interface Rating{
    Rating: number,
    Comment: string,
    User: string,
    UserImgURL: string;
    UserUID: string;
}

export interface Author{
    UID: string,
    Name: string,
    ImgURL: string
}

export interface FavoriteRecipe{
    addedAt: Date,
}

interface Tip{
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