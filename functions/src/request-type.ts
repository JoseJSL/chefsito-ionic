import { ErrorHandler, HandlerInput, RequestHandler, getIntentName } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { getRandomRecipe, getRecipeCategoriesSpeech, getRecipeData, getRecipeIngredientsSpeech, getRecipeRatingsSpeech } from "./firebase";
import { Recipe, RecipeData} from "./recipe";

export const launchRequestHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      const request = handlerInput.requestEnvelope.request;
      return request.type === "LaunchRequest";        
    },
    handle(handlerInput : HandlerInput) : Response {
      const speechText = "Bienvenido chefsito. ¿Qué hacemos hoy?";
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    },
};

export const errorHandler : ErrorHandler = {
    canHandle(handlerInput : HandlerInput, error : Error ) : boolean {
      return true;
    },
    handle(handlerInput : HandlerInput, error : Error) : Response {  
      console.log(error.name + ": " + error.message);
      return handlerInput.responseBuilder
        .speak("Lo siento, no pude entenderte.")
        .reprompt("Lo siento, no pude entenderte. Repítelo, por favor.")
        .getResponse();
    }
};

export const cancelAndStopIntentHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      const request = handlerInput.requestEnvelope.request;
      return request.type === "IntentRequest"
        && (request.intent.name === "AMAZON.CancelIntent"
           || request.intent.name === "AMAZON.StopIntent");
    },
    handle(handlerInput : HandlerInput) : Response {
      return handlerInput.responseBuilder
        .speak("Hasta luego, chefsito")
        .withShouldEndSession(true)      
        .getResponse();
    },
};

export const sessionEndedRequestHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return getIntentName(handlerInput.requestEnvelope) === "SessionEndedRequest";
    },
    handle(handlerInput : HandlerInput) : Response {  
      return handlerInput.responseBuilder.withShouldEndSession(true).getResponse();
    },
};

export const SurpriseIntent : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return getIntentName(handlerInput.requestEnvelope) === "SurpriseIntent";
  },
  async handle(handlerInput : HandlerInput) : Promise<Response> {    
    const rndRecipe = await getRandomRecipe();
    const categories = getRecipeCategoriesSpeech(rndRecipe);

    let speechText = "Encontré una receta en la";
    speechText += rndRecipe.Category.length > 1 ? "s categorías " : " categoría ";
    speechText += categories ;
    speechText += ", llamada " + rndRecipe.Title + ", del chefsito " + rndRecipe.Author.Name;
    speechText += ". ¿Continuamos con ésta receta?"
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.currentRecipe = rndRecipe;
    sessionAttributes.allowedToContinue = true;

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
    return getIntentName(handlerInput.requestEnvelope) === "ContinueRecipeIntent" && handlerInput.attributesManager.getSessionAttributes().allowedToContinue;
  },
  handle(handlerInput : HandlerInput) : Response {
    const recipe: Recipe = handlerInput.attributesManager.getSessionAttributes().currentRecipe;
    const speechText = `De la receta ${recipe.Title} puedo darte más detalles, los ingredientes o quizá, ya quieras iniciar con los pasos.`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL)
      .withShouldEndSession(false)
      .getResponse();
  },
};

export const RecipeDetailsIntent: RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return  getIntentName(handlerInput.requestEnvelope) === "RecipeDetailsIntent";
  },
  handle(handlerInput : HandlerInput) : Response {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let response = handlerInput.responseBuilder;
    let speechText: string;

    if(sessionAttributes.allowedToContinue){
      const recipe: Recipe = sessionAttributes.currentRecipe;
      const rating = getRecipeRatingsSpeech(recipe.AvgRating);

      speechText = `La receta ${recipe.Title} es una receta ${recipe.Difficulty} con una duración de ${recipe.TimeMin}. ${rating}.`;
      
      response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL)
    } else {
      speechText = "¿De qué receta?"
    }

    return response
      .speak(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

export const RecipeIngredientsIntent: RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return getIntentName(handlerInput.requestEnvelope) === "RecipeIngredientsIntent";
  },
  async handle(handlerInput : HandlerInput) : Promise<Response> {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let response = handlerInput.responseBuilder;
    let speechText: string;
    
    if(sessionAttributes.allowedToContinue){
      const recipe: Recipe = sessionAttributes.currentRecipe;
      const recipeData: RecipeData = await getRecipeData(recipe.UID);
      const ingredients = getRecipeIngredientsSpeech(recipeData.Ingredients);

      speechText = `Para preparar ${recipe.Title}, necesitas ${ingredients}. ¿Continuamos?`;
      response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL)
    } else {
      speechText = "¿De qué receta?"
    }
    return response
      .speak(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};