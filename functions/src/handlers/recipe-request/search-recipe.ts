import { HandlerInput, RequestHandler, getIntentName, getSlotValue } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getRandomRecipe, getRecipeCategoriesSpeech, getRecipesLike } from '../../util/firebase';
import { getCategoriesAndTitleSpeech, getFoundRecipeStartSpeech, getRecipeBunchSpeech } from '../../util/natural-speech';

export const SurpriseIntent : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return getIntentName(handlerInput.requestEnvelope) === 'SurpriseIntent';
    },
    async handle(handlerInput : HandlerInput) : Promise<Response> {    
      const rndRecipe = await getRandomRecipe();
      const categories = getRecipeCategoriesSpeech(rndRecipe);
  
      let speechText = getFoundRecipeStartSpeech() + ' ';
      speechText += getCategoriesAndTitleSpeech(rndRecipe.Category.length, categories, rndRecipe.Title);
      speechText += ', del chefsito ' + rndRecipe.Author.Name + '. ¿Continuamos con ésta receta?';
  
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      sessionAttributes.currentRecipe = rndRecipe;
      sessionAttributes.allowedToContinue = true;
      sessionAttributes.allowedToShop = true;
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(`¿Continuamos con la receta ${rndRecipe.Title}?`)
        .withStandardCard(rndRecipe.Title, speechText, rndRecipe.ImgURL, rndRecipe.ImgURL)
        .withShouldEndSession(false)
        .getResponse();
    },
};

export const SearchRecipesLikeIntent: RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return getIntentName(handlerInput.requestEnvelope) === 'SearchRecipesLikeIntent';
    },
    async handle(handlerInput : HandlerInput) : Promise<Response> {
      let speechText: string;
  
      const query = getSlotValue(handlerInput.requestEnvelope, 'query');
      const recipes = await getRecipesLike(query);
      
      if(recipes.length > 0 ){
        speechText = getRecipeBunchSpeech(recipes);
        handlerInput.attributesManager.getSessionAttributes().currentIntent = 'SearchRecipesLikeIntent';
      } else {
        speechText = 'Lo siento, no pude encontrar recetas con ' + query;
      }
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
    },
};