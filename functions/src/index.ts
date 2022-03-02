import * as functions from "firebase-functions";
import { SkillBuilders } from "ask-sdk-core";
import { SkillRequestSignatureVerifier, TimestampVerifier } from "ask-sdk-express-adapter";
import { launchRequestHandler, cancelAndStopIntentHandler, sessionEndedRequestHandler, errorHandler, SurpriseIntent, ContinueRecipeIntent, RecipeIngredientsIntent, RecipeDetailsIntent } from "./request-type";

exports.alexa = functions.https.onRequest(async (req, res) => {
    const skill = SkillBuilders.custom()
        .addRequestHandlers(
            launchRequestHandler, 
            cancelAndStopIntentHandler, 
            sessionEndedRequestHandler,
            ContinueRecipeIntent,
            RecipeIngredientsIntent,
            RecipeDetailsIntent,
            SurpriseIntent)
        .addErrorHandlers(errorHandler)
    .create();

    try {
        const textBody = req.rawBody.toString();
        const requestHeaders = req.headers;

        await new SkillRequestSignatureVerifier().verify(textBody, requestHeaders);
        await new TimestampVerifier().verify(textBody);

        const response = await skill.invoke(req.body);
        res.send(response);
    } catch (err) {
        console.error(err);
        res.send(err);
    }
});
