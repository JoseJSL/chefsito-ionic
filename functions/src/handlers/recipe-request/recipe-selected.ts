import { HandlerInput, RequestHandler, getIntentName } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getRecipeData, getRecipeIngredientsSpeech } from '../../util/firebase';
import { Recipe, RecipeData } from '../../util/recipe';

export const ContinueRecipeIntent : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return getIntentName(handlerInput.requestEnvelope) === 'ContinueRecipeIntent' && handlerInput.attributesManager.getSessionAttributes().allowedToContinue;
  },
  handle(handlerInput : HandlerInput) : Response {
    const recipe: Recipe = handlerInput.attributesManager.getSessionAttributes().currentRecipe;
    const speechText = `De la receta ${recipe.Title} puedo darte más detalles, los ingredientes, o quizá, ya quieras iniciar con los pasos.`;
  
    return handlerInput.responseBuilder
      .speak(speechText)
      .withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL)
      .withShouldEndSession(false)
      .getResponse();
  },
};

export const RecipeIngredientsIntent: RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return getIntentName(handlerInput.requestEnvelope) === 'RecipeIngredientsIntent';
    },
    async handle(handlerInput : HandlerInput) : Promise<Response> {
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      let response = handlerInput.responseBuilder;
      let speechText: string;
      
      if(sessionAttributes.allowedToContinue){
        const recipe: Recipe = sessionAttributes.currentRecipe;
  
        let recipeData: RecipeData;
  
        if(sessionAttributes.currentRecipeData){
          recipeData = sessionAttributes.currentRecipeData;
        } else {
          recipeData = await getRecipeData(recipe.UID);
          sessionAttributes.currentRecipeData = recipeData;
        }
  
        const ingredients = getRecipeIngredientsSpeech(recipeData.Ingredients);
        speechText = `Para preparar ${recipe.Title}, necesitas ${ingredients}. ¿Continuamos?`;
        response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL)
      } else {
        speechText = '¿De qué receta?';
      }
      return response
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
    },
};