import { HandlerInput, RequestHandler, getIntentName } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getRandomRecipe, getRecipeData } from '../../util/firebase';
import { searchProducts } from '../../util/shopping';

export const ShoppingTestIntent : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return getIntentName(handlerInput.requestEnvelope) === 'ShoppingTestIntent';
  },
  async handle(handlerInput : HandlerInput) : Promise<Response> {    
    let speechText: string = '';
    const recipe = await getRandomRecipe();
    const ingredients = (await getRecipeData(recipe.UID)).Ingredients;
    let searchResults = await searchProducts(ingredients);
    
    for(let i = 0; i < searchResults.length; i++){
      speechText += searchResults[i].title + ': ' + searchResults[i].productUrl + ', ';
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(recipe.Title, speechText)
      .getResponse();
  },
};