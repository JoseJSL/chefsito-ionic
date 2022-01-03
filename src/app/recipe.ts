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

interface Author{
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
    Tips: [],
}

// <color name="difficultyVeryHard">#7A0000</color>
// <color name="difficultyHard">#DF1A1A</color>
// <color name="difficultyKindaHard">#FF5722</color>
// <color name="difficultyNormal">#FF9800</color>
// <color name="difficultyKindaEasy">#FFEB3B</color>
// <color name="difficultyEasy">#8BC34A</color>
// <color name="difficultyVeryEasy">#4CAF50</color>
// <color name="difficultyBeginner">#00BCD4</color>