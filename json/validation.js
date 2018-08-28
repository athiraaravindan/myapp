let Ajv = require('ajv')
let ajv = Ajv({ allErrors:true, removeAdditional:'all' })
let userSchema = require('../json/new.user')
ajv.addSchema(userSchema, 'new.user')

/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function errorResponse(schemaErrors) {
  console.log("schemaErrors", schemaErrors)
  let errors = schemaErrors.map((error) => {
    return {
      path: error.dataPath,
      message: error.message
    }
  })
  return {
    status: 'failed',
    errors: errors
  }
}

/**
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 * @return {Object} response
 */
 module.exports = (params) => {
  return (req, res, next) => {
    let valid = ajv.validate(params.schemaName, req.body)
    if (!valid) {
      return res.json({'status':'Error', error:errorResponse(ajv.errors)})
      // return res.render(params.view, errorResponse(ajv.errors))
    }
    next()
  }
}