export function getFoundRecipeStartSpeech(): string {
    const r = Math.round(Math.random() * 5);
    
    switch(r){
        case 0:
            return "Te apetece la receta";
        case 1:
            return "Qué te parece una receta";
        case 2:
            return "Encontré una receta";
        case 3:
            return "Qué te parece la receta";
        case 4:
            return "Que tal la receta";
        default:
            return "Que tal una receta";
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
            speech = categoryCount > 1 ? "en las categorías " : " en la categoría ";
            speech += categories;
            break;
        case 1:
            speech = categoryCount > 1 ? "de las categorías " : "de la categoría ";
            speech += categories;
            break;
        default:
            speech = categoryCount > 1 ? "en las secciones " : "de la sección ";
            speech += categories;
    }

    return speech;
}

function getTitleSpeech(title: string): string{
    const r = Math.round(Math.random() * 1);

    switch(r){
        case 0:
            return "llamada " + title;
        default:
            return "con el nombre "+ title;
    }
}