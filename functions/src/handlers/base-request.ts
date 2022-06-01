import { ErrorHandler, getIntentName, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getWelcomeSpeech } from '../util/natural-speech';

export const launchRequestHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'LaunchRequest';        
    },
    handle(handlerInput : HandlerInput) : Response {
      const speechText = getWelcomeSpeech() + ' Si no sabes como comenzar, di "ayuda".';
      handlerInput.attributesManager.getSessionAttributes().currentIntent = 'LaunchRequest';

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt('También puedes decir "ayuda" en cualquier momento si no sabes cómo continuar.')
        .withShouldEndSession(false)
        .getResponse();
    },
};

export const errorHandler : ErrorHandler = {
    canHandle(handlerInput : HandlerInput, error : Error) : boolean {
      return true;
    },
    async handle(handlerInput : HandlerInput, error : Error) : Promise<Response> {  
      console.error(error.name + '::: ' + error.message);

      return handlerInput.responseBuilder
        .speak('Lo siento, algo salió mal con tu petición.')
        .reprompt('Lo siento, no pude entenderte. Repítelo, por favor.')
        .withShouldEndSession(false)
        .getResponse();
    }
};

export const cancelAndStopIntentHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      const name = getIntentName(handlerInput.requestEnvelope);
      return name === 'AMAZON.CancelIntent' || name === 'AMAZON.StopIntent';
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
    return getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput : HandlerInput) : Response {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const currentIntent = sessionAttributes.currentIntent;
    let speechText: string;

    if(currentIntent === 'LaunchRequest'){
      speechText = 'Ésta skill te ayudará a buscar recetas de cocina, ver qué ingredientes necesitas para ellas y cómo hacerlas paso a paso. ';
      speechText += 'Puedes decir "Sorpréndeme" para conseguir una receta aleatoria, o pídeme que busque recetas para tí. ';
      speechText += 'También puedes decir "ayuda" en cualquier momento si no sabes qué hacer.';
    } else if(currentIntent === 'RecipeDetailsIntent' || currentIntent === 'ContinueRecipeIntent' || currentIntent === 'SelectRecipeFromSearchIntent'){
      speechText = 'Puedes preguntarme por los ingredientes, o puedes iniciar los pasos para comenzar a cocinar diciendo "paso uno", o "inicia los pasos".';
    } else if(currentIntent === 'RecipeIngredientsIntent'){
<<<<<<< HEAD
      speechText = 'Puedo crear una lista con los ingredientes de la receta si lo deseas, o si ya puedes comenzar a cocinar, inicia los pasos diciendo "Paso uno".'
=======
      speechText = 'Puedes crear una lista con los ingredientes, o si ya los tienes listos, intenta comenzar con los pasos diciendo "Paso uno", o "Inicia los pasos".';
>>>>>>> 2051ae80939a274a9b86706bc87ff91d60de3443
    } else if(currentIntent === 'RecipeStepNumberIntent' || currentIntent === 'RecipeNextStepIntent' || currentIntent === 'RecipePreviousStepIntent'){
      speechText = 'Puedes decir "Continúa", "Anterior", o dime el número del paso que quieras saber. ';
      speechText += 'Si no te sientes seguro de seguir con los pasos, puedes preguntarme por más detalles de la receta, o por sus ingredientes.';
    } else if(currentIntent === 'SearchRecipesLikeIntent'){
      speechText = 'Puedes seleccionar una de las recetas diciéndome su número. Si no te gusta ninguna de las recetas, prueba buscar algo más, o dí "Sorpréndeme" para encontrar recetas aleatorias.';
    } else if(currentIntent === 'AddIngredientsToListIntent'){
      speechText = 'Si ya tienes los ingredientes listos, puedes iniciar los pasos diciendo "paso uno", o "inicia los pasos".';
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
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput : HandlerInput) : Response {  
      return handlerInput.responseBuilder.withShouldEndSession(true).getResponse();
    },
};
