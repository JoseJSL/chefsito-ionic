import { HandlerInput, RequestHandler, getIntentName } from 'ask-sdk-core';
import { Directive, Response } from 'ask-sdk-model';
import { getProductsDirective } from '../../util/shopping';

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