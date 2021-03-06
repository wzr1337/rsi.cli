
import path from "path";
import fs from "fs";
import Ajv from "ajv";


export function loadSchema(filename:string){
  var file = path.resolve(process.cwd(), filename);
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

/* @@ TODO: migrate to Joi for beeter reporting


export async function validate(obj:any) {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    access_token: [Joi.string(), Joi.number()],
    birthyear: Joi.number().integer().min(1900).max(2013),
    email: Joi.string().email({ minDomainAtoms: 2 })
  }).with('username', 'birthyear').without('password', 'access_token');

  // Return result.
  const result = Joi.validate(obj, schema, {abortEarly: false});
  if (null !== result.error) {
    throw result.error;
  }
  return result.value;
} */

export async function validate(schemaPath?:string):Promise<boolean> {
  let ajv = new Ajv({
    //schemaId: 'id',
    allErrors: true,
    jsonPointers: true,
    //verbose: true
  });
  // To use Ajv with draft-06 schemas you need to explicitly add the meta-schema to the validator instance
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

  let $validate = ajv.compile(loadSchema(path.join(__dirname, '../../../../node_modules/rsi.schema/dist/$rsi.schema.json')));
  
  await $validate(loadSchema(schemaPath));
 
  if ($validate.errors) throw {validationErrors: $validate.errors};
  return true;
}