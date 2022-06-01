import { HandlerInput, RequestHandler, getIntentName } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getRandomRecipe, getRecipeData } from '../../util/firebase';
import { Recipe } from '../../util/recipe';
import { getSetRecipeData } from '../../util/session-data';
import { getListOfIngredients, listExists, searchProducts } from '../../util/shopping';

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

export const AddIngredientsToListIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return getIntentName(handlerInput.requestEnvelope) === 'AddIngredientsToListIntent' && handlerInput.attributesManager.getSessionAttributes().currentRecipe;
  },
  async handle(handlerInput: HandlerInput): Promise<Response> {
    let speechText: string;
    const response = handlerInput.responseBuilder;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();    

    const recipe: Recipe = sessionAttributes.currentRecipe;

    try{
      const listManager = handlerInput.serviceClientFactory!.getListManagementServiceClient();
      const name = `Chefsito: ${recipe.Title} de ${recipe.Author.Name}`;
      
      if(!(await listExists(name, listManager))){
        const recipeData = await getSetRecipeData(recipe.UID, handlerInput);
        const listOfIngredients = getListOfIngredients(recipeData.Ingredients);

        const newList = await listManager.createList({name: name, state: 'active'});

        speechText = 'La lista fue creada con el nombre "' + newList.name + '".';  
        listOfIngredients.forEach(ing => listManager.createListItem(newList.listId!, {value: ing, status: 'active'}));
        sessionAttributes.currentIntent = 'AddIngredientsToListIntent';
      } else {
        speechText = 'Ya existe una lista con el nombre "' + name + '".';
      }

      response.withSimpleCard('', speechText);
    } catch (e) {
      const error: Error = e as any;

      if(error.name !== 'ServiceError'){
        speechText = 'Lo siento, tuve problemas para crear la lista.';
      } else {
        speechText = 'Si deseas utilizar esta función, necesito tu permiso para leer y modificar listas.';

        response.withAskForPermissionsConsentCard([
          "alexa::household:lists:read",
          "alexa::household:lists:write"]);
      }

      console.error('Error: ' + e);
    }

    return response
      .speak(speechText + ' ¿Qué más quieres hacer?')
      .reprompt('¿Qué más quieres hacer? Recuerda que puedes pedirme ayuda en cualquier momento.')
      .withShouldEndSession(false)
      .getResponse();
  }
}
