import { HandlerInput } from "ask-sdk-core";
import { getRecipeData } from "./firebase";
import { RecipeData } from "./recipe";

export async function getSetRecipeData(recipeUID: string, handlerInput: HandlerInput): Promise <RecipeData>{
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    if(sessionAttributes.currentRecipeData){
        return sessionAttributes.currentRecipeData;
    } else {
        const data = await getRecipeData(recipeUID);
        sessionAttributes.currentRecipeData = data;
        return data;
    }
}

export function getSetCurrentStep(recipeData: RecipeData, index: number, handlerInput: HandlerInput) : string{
    const stepsLength = recipeData.Steps.length;

    if (index > stepsLength){
        index = stepsLength;
    } else if (index <= 0){
        index = 1;
    }
    
    handlerInput.attributesManager.getSessionAttributes().lastStep = index;
    return `Paso ${index} de ${stepsLength}:\n${recipeData.Steps[index - 1]}`;
}