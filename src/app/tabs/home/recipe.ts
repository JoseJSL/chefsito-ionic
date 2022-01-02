export interface Recipe {
    UID: string,
    TimeTip: Tip;
    //DifficultyTip: Tip;
    //SpecialTip: Tip;

    ImageURL: string;
    Title: string;
    Rating: number;
    Author: Author;
    UploadTime: Date;
    
    //Steps: string[];
    //Ingredients: Ingredient[];
    //BasePortionSize: number;
}

interface Tip {
    Icon: string;
    Description: string;
    Color: string;
}

interface Ingredient {
    Name: string;
    Amount: number;
}

interface Author{
    Name: String;
    ImageUrl: String;
}