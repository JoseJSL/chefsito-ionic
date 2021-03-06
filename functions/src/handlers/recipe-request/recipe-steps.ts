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
        speechText += ' ¿Qué más quieres hacer?';
        sessionAttributes.currentIntent = 'RecipeStepNumberIntent';
      } else {
        speechText = '¿De qué receta?. Puedes decir "Sorpréndeme" para conseguir una receta aleatoria o pídeme que busque recetas para tí.';
      }
  
      return response
        .speak(speechText )
        .withShouldEndSession(false)
        .getResponse();
    },
};
    
export const RecipeNextStepIntent: RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      const name = getIntentName(handlerInput.requestEnvelope);
      return name === 'RecipeNextStepIntent' || name =='AMAZON.NextIntent'; 
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
        sessionAttributes.currentIntent = 'RecipeNextStepIntent';

        response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL);
        speechText += ' ¿Qué más quieres hacer?';
        if(recipeData.Steps.length > nextStepIndex){
          response.reprompt('Puedes decir "siguiente paso" o "paso anterior" para seguir.');
        } else {
          response.reprompt('¿Qué más quieres hacer?');
        }
      } else {
        speechText = '¿De qué receta?. Puedes decir "Sorpréndeme" para conseguir una receta aleatoria o pídeme que busque recetas para tí.';
      }
  
      return response
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
    },
};
    
export const RecipePreviousStepIntent: RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      const name = getIntentName(handlerInput.requestEnvelope);
      return name === 'RecipePreviousStepIntent' || name == 'AMAZON.PreviousIntent';
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
        sessionAttributes.currentIntent = 'RecipePreviousStepIntent';

        response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL);
        speechText += ' ¿Qué más quieres hacer?';
        response.reprompt('Puedes decir "paso anterior" o "siguiente paso" para seguir.');
      } else {
        speechText = '¿De qué receta?. Puedes decir "Sorpréndeme" para conseguir una receta aleatoria o pídeme que busque recetas para tí.';
      }
  
      return response
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
    },
};