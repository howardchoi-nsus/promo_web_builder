const { createPublicationHandler } = require("../_promo-service-v3-actions");
module.exports = createPublicationHandler();

module.exports=require('../_work-log.js').withWorkLog('v3/publications.js',module.exports);
