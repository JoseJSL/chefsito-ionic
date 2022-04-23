import { HandlerInput, RequestHandler, getIntentName } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getRecipeRatingsSpeech } from '../../util/firebase';
import { Recipe } from '../../util/recipe';

export const RecipeDetailsIntent: RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return  getIntentName(handlerInput.requestEnvelope) === 'RecipeDetailsIntent';
    },
    handle(handlerInput : HandlerInput) : Response {
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      let response = handlerInput.responseBuilder;
      let speechText: string;
  
      if(sessionAttributes.allowedToContinue){
        const recipe: Recipe = sessionAttributes.currentRecipe;
        const rating = getRecipeRatingsSpeech(recipe.AvgRating);
  
        speechText = `La receta ${recipe.Title} es una receta de dificultad ${recipe.Difficulty.toLowerCase()} con una duración de ${recipe.TimeMin}. ${rating}.`;
        
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