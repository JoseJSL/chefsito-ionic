import * as functions from "firebase-functions";
import { SkillBuilders } from "ask-sdk-core";
import { SkillRequestSignatureVerifier, TimestampVerifier } from "ask-sdk-express-adapter";
import { launchRequestHandler, cancelAndStopIntentHandler, sessionEndedRequestHandler, errorHandler } from "./handlers/base-request";
import { SurpriseIntent, ContinueRecipeIntent, RecipeIngredientsIntent, RecipeDetailsIntent, RecipeStepNumberIntent, RecipeNextStepIntent, RecipePreviousStepIntent, SearchRecipesLikeIntent } from "./handlers/recipe-request";
import { SessionResumedRequestHandler, ShoppingTestIntent } from "./handlers/shopping-request";

const skill = SkillBuilders.custom()
    .addRequestHandlers(
        launchRequestHandler, 
        cancelAndStopIntentHandler, 
        sessionEndedRequestHandler,
        ContinueRecipeIntent,
        RecipeIngredientsIntent,
        RecipeDetailsIntent,
        RecipeStepNumberIntent,
        RecipeNextStepIntent,
        RecipePreviousStepIntent,
        SurpriseIntent,
        SearchRecipesLikeIntent,
        ShoppingTestIntent,
        SessionResumedRequestHandler)
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
        res.send(err);
    }
});
 