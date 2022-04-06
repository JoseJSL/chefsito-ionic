import { HandlerInput, RequestHandler, getIntentName, getSlotValue } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getRandomRecipe, getRecipeCategoriesSpeech, getRecipeData, getRecipeIngredientsSpeech, getRecipeRatingsSpeech, getRecipesLike } from '../util/firebase';
import { getCategoriesAndTitleSpeech, getFoundRecipeStartSpeech, getRecipeBunchSpeech } from '../util/natural-speech';
import { Recipe, RecipeData} from '../util/recipe';
import { getSetCurrentStep, getSetRecipeData } from '../util/session-data';

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