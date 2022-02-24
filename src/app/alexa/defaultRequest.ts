import { ErrorHandler, HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response, SessionEndedRequest } from 'ask-sdk-model';

export const launchRequestHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'LaunchRequest';        
    },
    handle(handlerInput : HandlerInput) : Response {
      const speechText = 'Bienvenido a Chefsito, aún estoy en desarrollo, así que solo puedo realizar pruebas con algunas palabras.';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('Bienvenido a Chefsito', 'Intenta realizar pruebas con algunas palabras.')
        .getResponse();
    },
};

export const errorHandler : ErrorHandler = {
    canHandle(handlerInput : HandlerInput, error : Error ) : boolean {
      return true;
    },
    handle(handlerInput : HandlerInput, error : Error) : Response {  
      return handlerInput.responseBuilder
        .speak('Lo siento, no pude entenderte.')
        .reprompt('Lo siento, no pude entenderte. Repítelo, por favor.')
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
      const speechText = 'Gracias por usar Chefsito.';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('Gracias por usar Chefsito.', 'Adios')
        .withShouldEndSession(true)      
        .getResponse();
    },
};

export const sessionEndedRequestHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      const request = handlerInput.requestEnvelope.request;    
      return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput : HandlerInput) : Response {
      console.log(`Se ha teminado la sesión: ${(handlerInput.requestEnvelope.request as SessionEndedRequest).reason}`);
  
      return handlerInput.responseBuilder.getResponse();
    },
 };