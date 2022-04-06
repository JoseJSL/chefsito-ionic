import { HandlerInput, RequestHandler, getIntentName } from 'ask-sdk-core';
import { Directive, Response } from 'ask-sdk-model';
import { getProductsDirective } from '../util/shopping';

export const ShoppingTestIntent : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return getIntentName(handlerInput.requestEnvelope) === 'ShoppingTestIntent';
  },
  async handle(handlerInput : HandlerInput) : Promise<Response> {    
    let speechText: string = 'Haciendo la prueba...';
    let shopDirective: Directive = await getProductsDirective([], handlerInput);

    return handlerInput.responseBuilder
      .speak(speechText)
      .addDirective(shopDirective)
      .getResponse();
  },
};

export const SessionResumedRequestHandler : RequestHandler = {
  canHandle(handlerInput : HandlerInput) : boolean {
    return handlerInput.requestEnvelope.request.type === 'SessionResumedRequest';
  },
  async handle(handlerInput : HandlerInput) : Promise<Response> {
    console.log("Ingresando a SessionResumedRequestHandler...");
    let speechText: string;
    const cause = (handlerInput.requestEnvelope.request as any).cause;
    if(cause){
      switch(cause.status.code){
        
        case('200'):
          if(typeof cause.result !== 'undefined'){
            speechText = 'Parece que hubo un problema al intentar agregar los productos al carrito de compra.';
          } else if(cause.token){
            speechText = 'Sus productos han sido agregados a su carrito con éxito.';
          } else {
            speechText = "Lo siento, tuve problemas con tu petición.";          
          }
          break;

        default:
          speechText = 'Hubo un problema intentano agregar los productos al carrito de compra.';
      }
    } else {
      speechText = "Lo siento, tuve problemas con tu petición.";
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};
