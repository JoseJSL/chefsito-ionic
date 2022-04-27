import { ErrorHandler, HandlerInput, RequestHandler, getIntentName } from "ask-sdk-core";
import { Response } from "ask-sdk-model";

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

export const helpIntentHandler : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && request.intent.name === "AMAZON.HelpIntent";
  },
  handle(handlerInput : HandlerInput) : Response {
    const speechText: string = 'Puedes decir "Sorpréndeme" para conseguir una receta aleatoria ó "Busca recetas de..." para buscar recetas con ingredientes específicos.';
    
    return handlerInput.responseBuilder
      .speak(speechText)

      .withSimpleCard('Usos de Chefsito', speechText)
      .withShouldEndSession(false)
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