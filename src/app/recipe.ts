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
    UserUID;
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

export const defaultRecipe: Recipe = {
    Author: {
        UID: '',
        Name: '',
        ImgURL: 'assets/user-default.png',
    },
    AvgRating: 0,
    ImgURL: '',
    PortionSize: 0,
    TimeMin: '0',
    Title: 'Receta',
    UID: 'null',
    Category: [''],
    Difficulty: '',
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
    Category: [''],
    Difficulty: '',
}