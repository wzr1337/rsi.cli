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
const Logger_1 = require("../../../utils/Logger");
function readFile(filename) {
    var json = null;
    var file = path_1.default.resolve(process.cwd(), filename);
    try {
        try {
            json = JSON.parse(fs_1.default.readFileSync(file, 'utf-8'));
        }
        catch (JSONerr) {
            json = require(file);
        }
    }
    catch (err) {
        Logger_1.Logger.error(err.message);
        process.exit(2);
    }
    return json;
}
/* @@ TODO: migrtae to Joi for beeter reporting


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
function validate(candidate) {
    return __awaiter(this, void 0, void 0, function* () {
        candidate = candidate || path_1.default.join(process.cwd(), "src/schema.json");
        let ajv = new ajv_1.default({
            //schemaId: 'id',
            allErrors: true,
            jsonPointers: true,
        });
        // To use Ajv with draft-06 schemas you need to explicitly add the meta-schema to the validator instance
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        let validate = ajv.compile(readFile(path_1.default.join(__dirname, '../../../assets/$rsi.schema.json')));
        let result = yield validate(readFile(candidate));
        if (validate.errors)
            throw { validationErrors: validate.errors };
    });
}
exports.validate = validate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS92YWxpZGF0ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsZ0RBQXdCO0FBQ3hCLDRDQUFvQjtBQUNwQiw4Q0FBc0I7QUFDdEIsa0RBQStDO0FBRy9DLFNBQVMsUUFBUSxDQUFDLFFBQWU7SUFDL0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLElBQUksSUFBSSxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2pELElBQUk7UUFDQSxJQUFJO1lBQ0EsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNyRDtRQUFDLE9BQU0sT0FBTyxFQUFFO1lBQ2IsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN4QjtLQUNKO0lBQUMsT0FBTSxHQUFHLEVBQUU7UUFDVCxlQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25CO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCSTtBQUVKLFNBQXNCLFFBQVEsQ0FBQyxTQUFpQjs7UUFDOUMsU0FBUyxHQUFHLFNBQVMsSUFBSSxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3JFLElBQUksR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDO1lBQ2hCLGlCQUFpQjtZQUNqQixTQUFTLEVBQUUsSUFBSTtZQUNmLFlBQVksRUFBRSxJQUFJO1NBRW5CLENBQUMsQ0FBQztRQUNILHdHQUF3RztRQUN4RyxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDLENBQUM7UUFFckUsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsa0NBQWtDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0YsSUFBSSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFFakQsSUFBSSxRQUFRLENBQUMsTUFBTTtZQUFFLE1BQU0sRUFBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFDLENBQUM7SUFDakUsQ0FBQztDQUFBO0FBaEJELDRCQWdCQyJ9