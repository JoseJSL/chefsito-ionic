import { Recipe } from './recipe';

export function getFoundRecipeStartSpeech(): string {
    const r = Math.round(Math.random() * 5);
    
    switch(r){
        case 0:
            return 'Te apetece la receta';
        case 1:
            return 'Qué te parece una receta';
        case 2:
            return 'Encontré una receta';
        case 3:
            return 'Qué te parece la receta';
        case 4:
            return 'Que tal la receta';
        default:
            return 'Que tal una receta';
    }
}

export function getCategoriesAndTitleSpeech(categoryCount:number, categories: string, title: string): string{
    let r = Math.round(Math.random() * 1);

    if(r == 0){ //Categorías primero
        return `${getCategoriesSpeech(categoryCount, categories)}, ${getTitleSpeech(title)}`;
    } else { // Nombre primero
        return `${getTitleSpeech(title)}, ${getCategoriesSpeech(categoryCount, categories)}`;
    }
}

function getCategoriesSpeech(categoryCount: number, categories: string): string{
    const r = Math.round(Math.random() * 2);
    let speech: string;
    switch(r){
        case 0:
            speech = categoryCount > 1 ? 'en las categorías ' : ' en la categoría ';
            speech += categories;
            break;
        case 1:
            speech = categoryCount > 1 ? 'de las categorías ' : 'de la categoría ';
            speech += categories;
            break;
        default:
            speech = categoryCount > 1 ? 'en las secciones ' : 'de la sección ';
            speech += categories;
    }

    return speech;
}

function getTitleSpeech(title: string): string{
    const r = Math.round(Math.random() * 1);

    switch(r){
        case 0:
            return 'llamada ' + title;
        default:
            return 'con el nombre '+ title;
    }
}

export function getRecipeBunchSpeech(recipes: Recipe[]): string{
    let speech = 'Encontré las recetas: ';

    if(recipes.length > 1 ){
        for(let i = 0; i < recipes.length - 1; i++){
            speech += (i + 1) + ': ' + recipes[i].Title + ' de ' + recipes[i].Author.Name + ', ';
        }
    
        speech += recipes[recipes.length - 1].Title.charAt(0) == 'i' ? 
            ' e ' + recipes.length + ': ' + recipes[recipes.length - 1].Title + ' de ' + recipes[recipes.length - 1].Author.Name + '.' :
            ' y ' + recipes.length + ': ' + recipes[recipes.length - 1].Title + ' de ' + recipes[recipes.length - 1].Author.Name + '.'     
    } else {
        speech += '1: ' + recipes[0].Title + ' de ' + recipes[0].Author.Name + '.';
    }
    
    return speech;
}

export function askContinue(concatAtEnd?: string): string{
    const r = Math.round(Math.random());

    switch(r){
        case 0: return `¿Seguimos${concatAtEnd ? ' ' + concatAtEnd : ''}?`;
        default: return `¿Continuamos${concatAtEnd ? ' ' + concatAtEnd : ''}?`;
    }
}

export function getWelcomeSpeech(): string{
    const r = Math.round(Math.random());

    switch(r){
        case 0: return 'Hola chefsito. ¿Qué cocinamos hoy?';
        default: return 'Bienvenido chefsito. ¿Qué hacemos hoy?';
    }
}
