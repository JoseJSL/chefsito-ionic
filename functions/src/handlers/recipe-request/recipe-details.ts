import { HandlerInput, RequestHandler, getIntentName } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getRecipeRatingsSpeech } from '../../util/firebase';
import { getRecipeData, getRecipeIngredientsSpeech } from '../../util/firebase';
import { Recipe, RecipeData } from '../../util/recipe';

export const RecipeDetailsIntent: RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return  getIntentName(handlerInput.requestEnvelope) === 'RecipeDetailsIntent';
    },
    handle(handlerInput : HandlerInput) : Response {
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      let response = handlerInput.responseBuilder;
      let speechText: string;

      if(sessionAttributes.allowedToContinue){
        if(sessionAttributes.currentIntent === 'SelectRecipeFromSearchIntent'){
          speechText = 'Puedes preguntarme por los ingredientes o puedes iniciar los pasos para comenzar a cocinar.';
        } else {
          const recipe: Recipe = sessionAttributes.currentRecipe;
          const rating = getRecipeRatingsSpeech(recipe.AvgRating);
    
          speechText = `La receta ${recipe.Title} es una receta de dificultad ${recipe.Difficulty.toLowerCase()} con una duración de ${recipe.TimeMin}. ${rating}.`;
          
          response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL);
          
          sessionAttributes.currentIntent = 'RecipeDetailsIntent'; 
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

export const ContinueRecipeIntent : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return getIntentName(handlerInput.requestEnvelope) === 'ContinueRecipeIntent' && handlerInput.attributesManager.getSessionAttributes().allowedToContinue;
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
        speechText = `Para preparar ${recipe.Title}, necesitas ${ingredients}. Si ya cuentas con los ingredientes, intenta iniciar los pasos.`;
        response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL);
        
        sessionAttributes.currentIntent = 'RecipeIngredientsIntent';
      } else {
        speechText = '¿De qué receta?. Puedes decir "Sorpréndeme" para conseguir una receta aleatoria o pídeme que busque recetas para tí.';
      }

      return response
        .speak(speechText)
        .withShouldEndSession(false)
        .getResponse();
    },
};