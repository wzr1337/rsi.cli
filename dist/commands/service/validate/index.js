"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ajv_1 = __importDefault(require("ajv"));
function loadSchema(filename) {
    var file = path_1.default.resolve(process.cwd(), filename);
    return JSON.parse(fs_1.default.readFileSync(file, 'utf-8'));
}
exports.loadSchema = loadSchema;
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
function validate(schemaPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let ajv = new ajv_1.default({
            //schemaId: 'id',
            allErrors: true,
            jsonPointers: true,
        });
        // To use Ajv with draft-06 schemas you need to explicitly add the meta-schema to the validator instance
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        let $validate = ajv.compile(loadSchema(path_1.default.join(__dirname, '../../../../node_modules/rsi.schema/dist/$rsi.schema.json')));
        yield $validate(loadSchema(schemaPath));
        if ($validate.errors)
            throw { validationErrors: $validate.errors };
        return true;
    });
}
exports.validate = validate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS92YWxpZGF0ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsZ0RBQXdCO0FBQ3hCLDRDQUFvQjtBQUNwQiw4Q0FBc0I7QUFHdEIsU0FBZ0IsVUFBVSxDQUFDLFFBQWU7SUFDeEMsSUFBSSxJQUFJLEdBQUcsY0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUhELGdDQUdDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCSTtBQUVKLFNBQXNCLFFBQVEsQ0FBQyxVQUFrQjs7UUFDL0MsSUFBSSxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUM7WUFDaEIsaUJBQWlCO1lBQ2pCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsWUFBWSxFQUFFLElBQUk7U0FFbkIsQ0FBQyxDQUFDO1FBQ0gsd0dBQXdHO1FBQ3hHLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsQ0FBQztRQUVyRSxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSwyREFBMkQsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzSCxNQUFNLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUV4QyxJQUFJLFNBQVMsQ0FBQyxNQUFNO1lBQUUsTUFBTSxFQUFDLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUMsQ0FBQztRQUNqRSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FBQTtBQWhCRCw0QkFnQkMifQ==