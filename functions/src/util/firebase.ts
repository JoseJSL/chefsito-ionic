import { Ingredient, Recipe, RecipeData } from "./recipe"
import * as Firebase from "firebase-admin"
import { Categories } from "./category";

Firebase.initializeApp()
const Firestore = Firebase.firestore();

export async function getRandomRecipe(): Promise<Recipe>{
  const recipes = await Firestore.collection("Recipe").get();
  const rnd = Math.round(Math.random() * recipes.docs.length);

  return recipes.docs[rnd].data() as Recipe;
}

export async function getRecipeData(UID: string): Promise<RecipeData>{
  const data = await Firestore.collection("Recipe").doc(UID).collection("Data").get();
  return data.docs[0].data() as RecipeData;
}

export function getRecipeIngredientsSpeech(list: Ingredient[]): string{
  let ingredients = ""

  if (list.length > 1){
    for(let i = 0; i < list.length - 1; i++){
      ingredients += getReadableIngredient(list[i]) + ", ";
    } 

    ingredients = ingredients.substring(0, ingredients.length - 2);
    const ing = getReadableIngredient(list[list.length -1]);
    ingredients += ing.charAt(0) == "i" ? (", e " + ing) : (", y " + ing);
  } else {
    ingredients += getReadableIngredient(list[0]);
  }

  return ingredients;
}

export function getReadableIngredient(ing: Ingredient): string{
  let type = "";

  if(ing.QuantityType.Name != "Unidades"){
    type = ing.Quantity > 1 ? ing.QuantityType.Name: ing.QuantityType.Name.substring(0, ing.QuantityType.Name.length - 1);
    type += " de";
  }

  return `${ing.Quantity} ${type} ${ing.Name}`.toLowerCase().replace("de de ", "de ");
}

export function getRecipeCategoriesSpeech(recipe: Recipe): string{
  let cats = "";

  if(recipe.Category.length > 1){
    for(let i = 0; i < recipe.Category.length - 1; i++){
      cats += getReadableCategory(recipe.Category[i]) + ", ";
    }

    cats = cats.substring(0, cats.length-2);
    const c = getReadableCategory(recipe.Category[recipe.Category.length - 1]);
    cats += c.charAt(0) == "i" ? (" e " + c) : (" y " + c);
  } else {
    cats = getReadableCategory(recipe.Category[0]);
  }

  return cats;
}

function getReadableCategory(cat: string){
  for(let i = 0; i < Categories.length; i++){
    if(Categories[i].urlName === cat) return Categories[i].title.toLowerCase();
  }

  return "";
}

export function getRecipeRatingsSpeech(rating: number): string{
  return rating == 0 ? "Aún no ha sido calificada por nadie" : 
    rating == 1 ? `Tiene una calificación de ${rating} estrella` : `Tiene una calificación de ${rating} estrellas`;
}

export async function getRecipesLike(query: string): Promise<Recipe[]>{
  let words: string[] = query.toLowerCase().split(/[ ]+/);
  const wordsBack = [... words];

  for(let i = 0; i < words.length; i++){
    if(!isNotWordConnector(words[i])){
      words.splice(i, 1);
    }
  }

  if(words.length < 1){
    words = wordsBack;
  }

  const recipes = await Firestore.collection('Recipe').get();
  let result: Recipe[] = [];

  let recipeData: Recipe;
  
  recipes.forEach(r => {
    recipeData = r.data() as Recipe;

    for(let i = 0; i < words.length; i++){
      if(recipeData.Title.toLowerCase().includes(words[i])){
        result.push(recipeData);
        i = words.length;
      }
    }
  });

  return result;
}

export function isNotWordConnector(word: string){
  if(word == 'a'){
    return false;
  } else if(word == 'con'){
    return false;
  } else if(word == 'de'){
    return false;
  } else if(word == 'del'){
    return false;
  } else if(word == 'la'){
    return false;
  } else if(word == 'sobre'){
    return false;
  } else if(word == 'y'){
    return false;
  } else if(word == 'o'){
    return false;
  } else if(word == 'e'){
    return false;
  }

  return true;
}

export async function getRecipeWhereTitleAndAuthor(title: string, authorName: string): Promise<Recipe | null>{
  const recipes = (await Firestore.collection('Recipe').where('Title', "==", title).where('Author.Name', '==', authorName).get());
  
  if(!recipes.empty){
    return recipes.docs[0].data() as Recipe;
  } else {
    return null;
  }
}
