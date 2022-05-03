import * as functions from "firebase-functions";
import { SkillBuilders } from "ask-sdk-core";
import { SkillRequestSignatureVerifier, TimestampVerifier } from "ask-sdk-express-adapter";
import { launchRequestHandler, cancelAndStopIntentHandler, sessionEndedRequestHandler, errorHandler, helpIntentHandler } from "./handlers/base-request";
import { ContinueRecipeIntent, NoIntent, RecipeDetailsIntent, RecipeIngredientsIntent } from "./handlers/recipe-request/recipe-details";
import { RecipeNextStepIntent, RecipePreviousStepIntent, RecipeStepNumberIntent } from "./handlers/recipe-request/recipe-steps";
import { SearchRecipesLikeIntent, SelectRecipeFromSearchIntent, SurpriseIntent } from "./handlers/recipe-request/search-recipe";
import { ShoppingTestIntent } from "./handlers/shopping-request/try-shop";
import { SessionResumedRequestHandler } from "./handlers/shopping-request/session-resumed";

const skill = SkillBuilders.custom()
    .addRequestHandlers(
        launchRequestHandler, 
        cancelAndStopIntentHandler, 
        sessionEndedRequestHandler,
        helpIntentHandler,
        ContinueRecipeIntent,
        RecipeIngredientsIntent,
        RecipeDetailsIntent,
        RecipeStepNumberIntent,
        RecipeNextStepIntent,
        RecipePreviousStepIntent,
        SurpriseIntent,
        SearchRecipesLikeIntent,
        SelectRecipeFromSearchIntent,
        ShoppingTestIntent,
        SessionResumedRequestHandler,
        NoIntent)
    .addErrorHandlers(errorHandler)
.create();

exports.alexa = functions.https.onRequest(async (req, res) => {
    try {
        const textBody = req.rawBody.toString();

        await new SkillRequestSignatureVerifier().verify(textBody, req.headers);
        await new TimestampVerifier().verify(textBody);

        const response = await skill.invoke(req.body);  
        res.send(response);
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});
