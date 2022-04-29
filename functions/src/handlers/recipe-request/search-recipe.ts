import { HandlerInput, RequestHandler, getIntentName, getSlotValue } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getRandomRecipe, getRecipeCategoriesSpeech, getRecipeRatingsSpeech, getRecipesLike } from '../../util/firebase';
import { getCategoriesAndTitleSpeech, getFoundRecipeStartSpeech, getRecipeBunchSpeech } from '../../util/natural-speech';
import { Recipe } from '../../util/recipe';

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
      sessionAttributes.currentIntent = 'SurpriseIntent';
  
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
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      let speechText: string;
  
      const query = getSlotValue(handlerInput.requestEnvelope, 'query');
      const recipes = await getRecipesLike(query);
      
      if(recipes.length > 0 ){
        speechText = getRecipeBunchSpeech(recipes);
        speechText += 'Dime su número para continuar con una receta.';

        sessionAttributes.currentIntent = 'SearchRecipesLikeIntent';
        sessionAttributes.searchedRecipes = recipes;
      } else {
        speechText = 'Lo siento, no pude encontrar recetas con ' + query;
        sessionAttributes.searchedRecipes = undefined;
      }

      return handlerInput.responseBuilder
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
    },
};

export const SelectRecipeFromSearchIntent: RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return getIntentName(handlerInput.requestEnvelope) === 'SelectRecipeFromSearchIntent' &&
    handlerInput.attributesManager.getSessionAttributes().searchedRecipes !== undefined;
  },
  async handle(handlerInput : HandlerInput) : Promise<Response> {
    let speechText: string;
    const slot: string | null = getSlotValue(handlerInput.requestEnvelope, 'recipeIndex');
    
    if(slot){
      const index: number = parseInt(slot) - 1;
      const recipes: Recipe[] = handlerInput.attributesManager.getSessionAttributes().searchedRecipes ;
      
      if(recipes[index]){
        const categories = getRecipeCategoriesSpeech(recipes[index]);
        const rating = getRecipeRatingsSpeech(recipes[index].AvgRating);
    
        speechText = 'La receta ' + getCategoriesAndTitleSpeech(recipes[index].Category.length, categories, recipes[index].Title);
        speechText += `, es una receta de dificultad ${recipes[index].Difficulty.toLowerCase()} con una duración de ${recipes[index].TimeMin}. ${rating}.`;
        speechText += '¿Continuamos con esta receta?';
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.currentRecipe = recipes[index];
        sessionAttributes.allowedToContinue = true;
        sessionAttributes.allowedToShop = true;
        sessionAttributes.currentIntent = 'SelectRecipeFromSearchIntent';
      } else {
        speechText = 'No hay una receta #' + (index + 1) + '. Solo ' + getRecipeBunchSpeech(recipes);
      }
    } else {
      speechText = 'Lo siento, no pude entenderte.';
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};
