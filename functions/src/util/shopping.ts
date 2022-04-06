import { Directive } from 'ask-sdk-model';
import { HandlerInput } from 'ask-sdk-core';
import { Ingredient } from './recipe';

export async function getProductsDirective(ingredients: Ingredient[], handlerInput: HandlerInput): Promise<Directive>{
    let shopDirective: Directive = {
        type: 'Connections.StartConnection',
        uri: 'connection://AMAZON.AddToShoppingCart/1',
        input: {
            products: [
                { asin: 'B0086VNGGU' },
            ],
        },
        token: 'AddToShoppingCartToken',
        onCompletion: 'RESUME_SESSION',
    };
    
    return shopDirective;
}
