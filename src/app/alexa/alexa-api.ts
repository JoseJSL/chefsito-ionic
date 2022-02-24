import { SkillBuilders } from 'ask-sdk-core';
import { launchRequestHandler, cancelAndStopIntentHandler, sessionEndedRequestHandler, errorHandler,  } from './defaultRequest';


const skill = SkillBuilders.custom()
    .addRequestHandlers(
        launchRequestHandler,
        cancelAndStopIntentHandler,
        sessionEndedRequestHandler)
    .addErrorHandlers(errorHandler)
.create();
