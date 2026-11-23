const { createFeedbackHandler } = require("../../../_promo-service-v3-actions");
module.exports = createFeedbackHandler();

module.exports=require('../../../_work-log.js').withWorkLog('v3/promo-requests/[id]/feedback.js',module.exports);
