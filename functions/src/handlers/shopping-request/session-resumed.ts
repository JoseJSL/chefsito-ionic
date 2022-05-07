import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';

export const SessionResumedRequestHandler : RequestHandler = {
    canHandle(handlerInput : HandlerInput) : boolean {
      return handlerInput.requestEnvelope.request.type === 'SessionResumedRequest';
    },
    handle(handlerInput : HandlerInput) : Response {
      console.log("Ingresando a SessionResumedRequestHandler...");
      let speechText: string;
      const request =  handlerInput.requestEnvelope.request.type === 'SessionResumedRequest' ? handlerInput.requestEnvelope.request : undefined;

      if(request && request.cause){
        const token = request.cause.token;
        const status = request.cause.status;
        const code = status?.code;
        const message = status?.message;
        const payload = request.cause.result;

        console.info(`[Shopping Response] ${JSON.stringify(request)}`);
        console.info(`[INFO] Shopping Action Result: Code - ${code}, Message - ${message}, Payload - ${payload}`);

        switch(code){
          case('200'):
            if(payload){
              if(payload.code === 'AlexaShopping.RetryLaterError'){
                speechText = 'Parece que hubo un problema al intentar agregar los productos al carrito de compra.';
              } else {
                speechText = "Lo siento, ocurrió un error al añadir al carrito, inténtelo de nuevo más tarde.";
                console.info(`[INFO] Shopping Action had an issue while performing the request. ${payload.message}`);
              }
            } else if(token === 'AddToShoppingCartToken'){
              console.info(`[INFO] Shopping Action: Add to cart action was a success for ${token}.`);
              speechText = 'Sus productos han sido agregados a su carrito con éxito.';
            } else {
              speechText = "Lo siento, tuve problemas con tu petición.";          
            }

            break;
          default:
            console.info(`[INFO] Shopping Action: There was a problem performing the shopping action.`);
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
  