import { HandlerInput, RequestHandler, getIntentName, getSlotValue } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { Recipe, RecipeData} from '../../util/recipe';
import { getSetCurrentStep, getSetRecipeData } from '../../util/session-data';

export const RecipeStepNumberIntent: RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return getIntentName(handlerInput.requestEnvelope) === 'RecipeStepNumberIntent';
    },
    async handle(handlerInput : HandlerInput) : Promise<Response> {
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      let response = handlerInput.responseBuilder;
      let speechText: string;
      
      if(sessionAttributes.allowedToContinue){
        const recipe: Recipe = sessionAttributes.currentRecipe;
        const recipeData: RecipeData = await getSetRecipeData(recipe.UID, handlerInput);
        const stepNumber = Number.parseInt(getSlotValue(handlerInput.requestEnvelope, 'stepNumber'));
        
        speechText = await getSetCurrentStep(recipeData, stepNumber, handlerInput);
        response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL);
      } else {
        speechText = '¿De qué receta?';
      }
  
      return response
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
    },
};
    
export const RecipeNextStepIntent: RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return getIntentName(handlerInput.requestEnvelope) === 'RecipeNextStepIntent';
    },
    async handle(handlerInput : HandlerInput) : Promise<Response> {
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      let response = handlerInput.responseBuilder;
      let speechText: string; 
      
      if(sessionAttributes.allowedToContinue){
        const recipe: Recipe = sessionAttributes.currentRecipe;
        const recipeData: RecipeData = await getSetRecipeData(recipe.UID, handlerInput);
        const nextStepIndex = sessionAttributes.lastStep ? sessionAttributes.lastStep + 1 : 1;
  
        speechText = await getSetCurrentStep(recipeData, nextStepIndex, handlerInput);
        response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL);
      } else {
        speechText = '¿De qué receta?';
      }
  
      return response
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
    },
};
    
export const RecipePreviousStepIntent: RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return getIntentName(handlerInput.requestEnvelope) === 'RecipePreviousStepIntent';
    },
    async handle(handlerInput : HandlerInput) : Promise<Response> {
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      let response = handlerInput.responseBuilder;
      let speechText: string; 
      
      if(sessionAttributes.allowedToContinue){
        const recipe: Recipe = sessionAttributes.currentRecipe;
        const recipeData: RecipeData = await getSetRecipeData(recipe.UID, handlerInput);
        const prevStepIndex = sessionAttributes.lastStep ? sessionAttributes.lastStep -1 : 1;
  
        speechText = await getSetCurrentStep(recipeData, prevStepIndex, handlerInput);
        response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL);
      } else {
        speechText = '¿De qué receta?';
      }
  
      return response
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
    },
};