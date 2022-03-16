import { ErrorHandler, HandlerInput, RequestHandler, getIntentName, getSlotValue } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { getRandomRecipe, getRecipeCategoriesSpeech, getRecipeData, getRecipeIngredientsSpeech, getRecipeRatingsSpeech } from "./firebase";
import { getCategoriesAndTitleSpeech, getFoundRecipeStartSpeech } from "./random-speech";
import { Recipe, RecipeData} from "./recipe";
import { getSetCurrentStep, getSetRecipeData } from "./recipe-utility";

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

    let speechText = getFoundRecipeStartSpeech() + " ";
    speechText += getCategoriesAndTitleSpeech(rndRecipe.Category.length, categories, rndRecipe.Title);
    speechText += ", del chefsito " + rndRecipe.Author.Name + ". ¿Continuamos con ésta receta?";

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
    return  getIntentName(handlerInput.requestEnvelope) === "RecipeDetailsIntent";
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
      speechText = "¿De qué receta?";
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
      speechText = "¿De qué receta?";
    }
    return response
      .speak(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

export const RecipeStepNumberIntent: RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return getIntentName(handlerInput.requestEnvelope) === "RecipeStepNumberIntent";
  },
  async handle(handlerInput : HandlerInput) : Promise<Response> {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let response = handlerInput.responseBuilder;
    let speechText: string;
    
    if(sessionAttributes.allowedToContinue){
      const recipe: Recipe = sessionAttributes.currentRecipe;
      const recipeData: RecipeData = await getSetRecipeData(recipe.UID, handlerInput);
      const stepNumber = Number.parseInt(getSlotValue(handlerInput.requestEnvelope, "stepNumber"));
      
      speechText = await getSetCurrentStep(recipeData, stepNumber, handlerInput);
      response.withStandardCard(recipe.Title, speechText, recipe.ImgURL, recipe.ImgURL);
    } else {
      speechText = "¿De qué receta?";
    }

    return response
      .speak(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

export const RecipeNextStepIntent: RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return getIntentName(handlerInput.requestEnvelope) === "RecipeNextStepIntent";
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
      speechText = "¿De qué receta?";
    }

    return response
      .speak(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

export const RecipePreviousStepIntent: RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return getIntentName(handlerInput.requestEnvelope) === "RecipePreviousStepIntent";
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
      speechText = "¿De qué receta?";
    }

    return response
      .speak(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};
