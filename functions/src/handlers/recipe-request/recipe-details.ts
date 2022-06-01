import { HandlerInput, RequestHandler, getIntentName } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getRecipeRatingsSpeech } from '../../util/firebase';
import { getRecipeData, getRecipeIngredientsSpeech } from '../../util/firebase';
import { getRecipeBunchSpeech } from '../../util/natural-speech';
import { Recipe, RecipeData } from '../../util/recipe';
import { SurpriseIntent } from './search-recipe';

export const RecipeDetailsIntent: RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return  getIntentName(handlerInput.requestEnvelope) === 'RecipeDetailsIntent';
    },
    handle(handlerInput : HandlerInput) : Response {
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

      const helpSpeech = 'Puedes preguntarme por los ingredientes, o puedes iniciar los pasos para comenzar a cocinar diciendo "paso uno", o "inicia los pasos".';

      let response = handlerInput.responseBuilder;
      let speechText: string;

      if(sessionAttributes.allowedToContinue){
        if(sessionAttributes.currentIntent === 'SelectRecipeFromSearchIntent'){
          speechText = helpSpeech;
        } else {
          const recipe: Recipe = sessionAttributes.currentRecipe;
          const rating = getRecipeRatingsSpeech(recipe.AvgRating);
    
          speechText = `La receta ${recipe.Title} es una receta de dificultad ${recipe.Difficulty.toLowerCase()} con una duración de ${recipe.TimeMin}. ${rating}.`;
          speechText += 'Puedes preguntarme por los ingredientes, o puedes iniciar los pasos para comenzar a cocinar diciendo "paso uno", o "inicia los pasos".';
          response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL);
          
          sessionAttributes.currentIntent = 'RecipeDetailsIntent'; 
        }
      } else {
        speechText = '¿De qué receta?. Puedes decir "Sorpréndeme" para conseguir una receta aleatoria, o pídeme que busque recetas para tí.';
      }
  
      return response
        .speak(speechText)
        .reprompt(helpSpeech)
        .withShouldEndSession(false)
        .getResponse();
    },
};

export const ContinueRecipeIntent : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return (getIntentName(handlerInput.requestEnvelope) === 'AMAZON.YesIntent') && handlerInput.attributesManager.getSessionAttributes().allowedToContinue;
  },
  handle(handlerInput : HandlerInput) : Response {
    const recipe: Recipe = handlerInput.attributesManager.getSessionAttributes().currentRecipe;
    const speechText = `De la receta ${recipe.Title} puedes preguntarme por más detalles, los ingredientes, o quizá, ya quieras iniciar con los pasos.`;
    handlerInput.attributesManager.getSessionAttributes().currentIntent = 'ContinueRecipeIntent';
  
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
        speechText = `Para preparar ${recipe.Title}, necesitas ${ingredients}. Si ya cuentas con los ingredientes, intenta iniciar los pasos. También puedo crear una lista con los ingredientes de la receta.`;
        response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL);
        
        sessionAttributes.currentIntent = 'RecipeIngredientsIntent';
      } else {
        speechText = '¿De qué receta?. Puedes decir "Sorpréndeme" para conseguir una receta aleatoria o pídeme que busque recetas para tí.';
      }
      
      return response
        .speak(speechText)
        .reprompt('Puedes crear una lista con los ingredientes, o si ya los tienes listos, intenta comenzar con los pasos diciendo "Paso uno", o "Inicia los pasos".')
        .withShouldEndSession(false)
        .getResponse();
    },
};

export const NoIntent : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return (getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent');
  },
  async handle(handlerInput : HandlerInput) : Promise<Response> {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    if(sessionAttributes.currentIntent === 'SelectRecipeFromSearchIntent'){
      return NoIntentSelectRecipeFromSearchIntent(handlerInput);
    } else if(sessionAttributes.currentIntent === 'SurpriseIntent') {
      return await SurpriseIntent.handle(handlerInput);
    }
        
    return handlerInput.responseBuilder
      .speak('¿Qué más quieres hacer?')
      .withShouldEndSession(false)
      .getResponse();
  },
};

function NoIntentSelectRecipeFromSearchIntent(handlerInput: HandlerInput): Response{
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  const searchedRecipes: Recipe[] = sessionAttributes.searchedRecipes;
  const response = handlerInput.responseBuilder;
  let speechText: string;

  if(searchedRecipes.length > 0){
    const recipe: Recipe = sessionAttributes.currentRecipe;
    
    for(let i = 0; i < searchedRecipes.length; i++){
      if(recipe.UID === searchedRecipes[i].UID){
        searchedRecipes.splice(i, 1);
        break;
      }
    }
  
    speechText = 'De tu búsqueda, solo quedan las recetas' + getRecipeBunchSpeech(searchedRecipes).replace('Encontré las recetas', '');
    speechText += ' Si no te interesa ninguna, intenta hacer otra búsqueda o di "Sorpréndeme" para encontrar una receta aleatoria.'; 
    response.withSimpleCard(searchedRecipes.length + (searchedRecipes.length > 1 ? ' resultados.' : ' resultado.') , speechText);
  } else {
    speechText = 'No encontré más recetas, intenta hacer otra búsqueda o di "Sorpréndeme" para encontrar una receta aleatoria.';
    response.withSimpleCard('0 resultados.', speechText);
  }

  return response.
    speak(speechText).
    withShouldEndSession(false).
    getResponse();
}
