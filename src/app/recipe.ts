export interface Recipe{
    UID: string,
    Author: Author,
    AvgRating: number,
    ImgURL: string,
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

export interface FavoriteRecipe{
    addedAt: Date,
}

interface Author{
    UID: string,
    Name: string,
    ImgURL: string
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
    UserImgURL: string,
}
//https://i.imgur.com/XDyo0Hu.png

export const defaultRecipe: Recipe = {
    Author: {
        UID: '',
        Name: 'Chefsito',
        ImgURL: 'https://i.imgur.com/JgjqbN3.png',
    },
    AvgRating: 0,
    ImgURL: '',
    PortionSize: 0,
    TimeMin: '0',
    Title: 'Receta',
    UID: 'null',
}

export const defaultRecipeData: RecipeData = {
    Ingredients: [],
    Ratings: [],
    Steps: [],
    Tips: [
        {Icon: 'time', Description: '', Color: ''},
        {Icon: 'book', Description: '', Color: ''},
        {Icon: 'help', Description: '', Color: ''},
    ],
}

export const defaultRecipeCreator: Recipe = {
    Author: {
        UID: '',
        Name: '',
        ImgURL: '',
    },
    AvgRating: 0,
    ImgURL: 'assets/food-tray.jpg',
    PortionSize: 1,
    TimeMin: '0',
    Title: 'Nombre de la receta',
    UID: '',
}