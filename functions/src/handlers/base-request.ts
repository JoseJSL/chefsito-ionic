import { ErrorHandler, HandlerInput, RequestHandler, getIntentName } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';

export const launchRequestHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'LaunchRequest';        
    },
    handle(handlerInput : HandlerInput) : Response {
      const speechText = 'Bienvenido chefsito. ¿Qué hacemos hoy?';      

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withShouldEndSession(false)
        .getResponse();
    },
};

export const errorHandler : ErrorHandler = {
    canHandle(handlerInput : HandlerInput, error : Error ) : boolean {
      return true;
    },
    handle(handlerInput : HandlerInput, error : Error) : Response {  
      console.log(error.name + ': ' + error.message);
      return handlerInput.responseBuilder
        .speak('Lo siento, no pude entenderte.')
        .reprompt('Lo siento, no pude entenderte. Repítelo, por favor.')
        .withShouldEndSession(false)
        .getResponse();
    }
};

export const cancelAndStopIntentHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && (request.intent.name === 'AMAZON.CancelIntent'
           || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput : HandlerInput) : Response {
      return handlerInput.responseBuilder
        .speak('Hasta luego, chefsito')
        .withShouldEndSession(true)      
        .getResponse();
    },
};

export const helpIntentHandler : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput : HandlerInput) : Response {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const currentIntent = sessionAttributes.currentIntent;
    let speechText: string;

    if(currentIntent === 'RecipeDetailsIntent' || currentIntent === 'ContinueRecipeIntent' || currentIntent === 'SelectRecipeFromSearchIntent'){
      speechText = 'Puedes preguntarme por los ingredientes, o puedes iniciar los pasos para comenzar a cocinar diciendo "paso uno", o "inicia los pasos".';
    } else if(currentIntent === 'RecipeIngredientsIntent'){
      speechText = 'Si tiene todos los ingredientes listos, puede comenzar con los pasos diciendo "Paso uno", o "Inicia los pasos".';
    } else if(currentIntent === 'RecipeStepNumberIntent' || currentIntent === 'RecipeNextStepIntent' || currentIntent === 'RecipePreviousStepIntent'){
      speechText = 'Si no te sientes seguro de seguir con los pasos, puedes preguntarme por más detalles de la receta, o por sus ingredientes.';
    } else if(currentIntent === 'SearchRecipesLikeIntent'){
      speechText = 'Puedes seleccionar una de las recetas diciéndome su número. Si no te gusta ninguna de las recetas, prueba buscar algo más, o dí "Sorpréndeme" para encontrar recetas aleatorias.';
    } else {
      speechText = 'Puedes decir "Sorpréndeme" para conseguir una receta aleatoria, o pídeme que busque recetas para tí.';
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Usos de Chefsito', speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

export const sessionEndedRequestHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return getIntentName(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput : HandlerInput) : Response {  
      return handlerInput.responseBuilder.withShouldEndSession(true).getResponse();
    },
};
