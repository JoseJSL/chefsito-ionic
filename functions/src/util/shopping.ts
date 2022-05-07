import { Directive } from 'ask-sdk-model';
import { HandlerInput } from 'ask-sdk-core';
import { Ingredient } from './recipe';
import { isNotWordConnector } from './firebase';
import { searchAmazon, AmazonSearchResult } from 'unofficial-amazon-search'

export async function getProductsDirective(ingredients: Ingredient[], handlerInput: HandlerInput): Promise<Directive>{
    let shopDirective: Directive = {
        type: 'Connections.StartConnection',
        uri: 'connection://AMAZON.AddToShoppingCart/1',
        token: 'AddToShoppingCartToken',
        input: {
            'products': { 'asin': 'B0957T7XN4'}
        }
    };
    
    return shopDirective;
}

export async function searchProducts(ingredients: Ingredient[]): Promise<AmazonSearchResult[]>{
    let results: AmazonSearchResult[] = [];
    const keywords = getAllKeywords(ingredients);
    let searchResult: AmazonSearchResult;

    for(let i = 0; i < keywords.length; i++){
        searchResult = (await searchAmazon(keywords[i], {includeSponsoredResults: false, page: 1})).searchResults[0];
        searchResult.productUrl = getAsniFromURL(searchResult.productUrl);
        results.push(searchResult);
    }

    return results;
}

function getAsniFromURL(url: string){
    const start = url.indexOf('dp/') + 3;
    return url.substring(start, start + 10);
}

function getAllKeywords(ingredients: Ingredient[]): string[]{
    let keywords: string[] = [];
    for(let i = 0; i < ingredients.length; i++){
        keywords.push(getIngredientKeywords(ingredients[i]));
    }

    return keywords;
}

function getIngredientKeywords(ingredient: Ingredient): string{
    let keywords = '';
    ingredient.Name.split(' ').filter(word => isNotWordConnector(word)).forEach(w => keywords += normalize(w) + ' ');
    return keywords;
}

function normalize(word: string): string{
    return word.toLowerCase().replace(/[.|,|!|¡|]/g, '');
}