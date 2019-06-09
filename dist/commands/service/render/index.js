"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const mustache_1 = __importDefault(require("mustache"));
const fs = __importStar(require("fs"));
const stream_1 = require("stream");
const vinyl_1 = __importDefault(require("vinyl"));
const Logger_1 = require("../../../utils/Logger");
const SAMPLEDATA = {
    namespaces: [
        {
            name: "chassis",
            classes: [
                {
                    name: "wheelsObject",
                    properties: [
                        {
                            name: "position",
                            type: "enum"
                        },
                        {
                            name: "name",
                            type: "String"
                        },
                        {
                            name: "rimTypes",
                            type: "rimType[]"
                        }
                    ]
                },
                {
                    name: "rimTypes",
                    properties: [
                        {
                            name: "name",
                            type: "string"
                        }
                    ]
                }
            ],
            enums: [
                {
                    name: "position",
                    belongsTo: "chassis",
                    properties: [
                        "FL", "FR", "RR", "RL", "spare"
                    ]
                }
            ],
            references: [
                {
                    from: "chassis.wheelsObject",
                    to: "chassis.rimTypes",
                    property: "rimTypes"
                },
                {
                    from: "chassis.rimTypes",
                    to: "chassis.rimTypes",
                    property: "parent"
                },
                {
                    from: "chassis.wheelsObject",
                    to: "chassis position",
                    property: "position"
                }
            ]
        },
        {
            name: "fleet",
            classes: [
                {
                    name: "vehicles",
                    properties: [
                        {
                            name: "wheels",
                            type: "wheelsObject"
                        }
                    ]
                }
            ],
            references: [
                {
                    from: "fleet.vehicles",
                    to: "chassis.wheelsObject",
                    property: "wheels"
                }
            ]
        }
    ]
};
/**
 * parses a schema from RSI definitions
 * @param  {String}   schemaPath path to RSI schema
 */
function getSampleSchema() {
    return __awaiter(this, void 0, void 0, function* () {
        return SAMPLEDATA;
    });
}
exports.getSampleSchema = getSampleSchema;
/**
 * renderes plantuml syntax from RSI definitions
 * @param  {String}   schemaPath path to RSI schema
 */
function render(schemaData) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!schemaData) {
            var err = new Error(`Can not render out of ${typeof schemaData}, need an ISchema!`);
            throw err;
        }
        // create an returnable ReadStream that is in object mode, because we want to put File objects on it
        const outStream = new stream_1.Readable({ objectMode: true });
        outStream._read = () => { }; // implemenmts a read() function 
        const $templates = yield loadTemplates(path.join(__dirname, "../../../../assets/class.templates/"));
        // publish package.json
        outStream.push(new vinyl_1.default({
            cwd: '/',
            base: '/',
            path: '/classDiagram.puml',
            contents: Buffer.from(mustache_1.default.render($templates['$index'], schemaData, $templates), "utf-8")
        }));
        // end the stream
        outStream.push(null);
        return outStream;
    });
}
exports.render = render;
/**
 * load mustache templates asynchronously
 * @param  {String} mustachesPath The path to all mustaches
 * @private
 */
function loadTemplates(mustachesPath) {
    return __awaiter(this, void 0, void 0, function* () {
        var templates = {};
        const fileNames = fs.readdirSync(mustachesPath, { encoding: "utf8" });
        for (const filename of fileNames) {
            templates[path.basename(filename, '.mustache')] = fs.readFileSync(path.join(mustachesPath, filename), "utf8");
        }
        return templates;
    });
}
exports.loadTemplates = loadTemplates;
;
// compare property names for sorting
function propertyCompare(a, b) {
    if (a.name === "id")
        return -4;
    if (a.name === "name")
        return -3;
    if (a.name === "uri")
        return -2;
    if (b.name === "id")
        return 4;
    if (b.name === "name")
        return 3;
    if (b.name === "uri")
        return 2;
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}
const SERVICE_REGEX = /((?:rsi|viwi).service.([a-zA-Z][a-zA-Z0-9]+))/;
const REFERENCE_NAME_REGEX = /[a-zA-Z0-9]+\.((?:.+Object$)|(?:.+Type$))/;
/**
 * parses schema(s) into ISchema compliant objects
 * @param  {string|Array<string>} schemapaths path(s) to viwi scheme file
 * @return {object} schema representation
 */
function parseSchemas(schemapaths) {
    return __awaiter(this, void 0, void 0, function* () {
        schemapaths = Array.isArray(schemapaths) ? schemapaths : [schemapaths];
        var ret = {
            namespaces: []
        };
        for (const schemaPath of schemapaths) {
            try {
                // check file availablity
                fs.accessSync(schemaPath, fs.constants.R_OK);
            }
            catch (error) {
                throw new Error(`Can not parse schema from ${schemaPath}!`);
            }
            // start parsing if no exception was thrown
            const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8')); // might fail an throw an error which is caught by async
            const namespaceName = (null !== schema.name.match(SERVICE_REGEX)) ? schema.name.match(SERVICE_REGEX)[2] : undefined;
            if (!namespaceName)
                throw new Error("no service name found for in " + schema.name);
            let namespace = {
                name: namespaceName,
                enums: [],
                types: [],
                references: []
            };
            // first, take care of all resource definitions 
            for (const resourceName in schema.resources) {
                if (schema.resources.hasOwnProperty(resourceName)) {
                    const resource = schema.resources[resourceName];
                    const cla$$ = {
                        name: resourceName + "Object",
                        properties: []
                    };
                    // iterate over all attributes
                    if (!resource.objectModel)
                        throw new Error(`objectModel missing in resource definition of ${namespaceName}.${resourceName}`);
                    for (const attributeName in resource.objectModel.attributes) {
                        if (resource.objectModel.attributes.hasOwnProperty(attributeName)) {
                            const modelAttribute = resource.objectModel.attributes[attributeName];
                            let attribute = {
                                "name": attributeName,
                            };
                            // reference type or object
                            if (modelAttribute.type === 'object' && modelAttribute.hasOwnProperty("oneOf")) {
                                let attrTypes = [];
                                for (const item of modelAttribute.oneOf) {
                                    const $ref = item['#ref'];
                                    if (null === $ref.match(REFERENCE_NAME_REGEX))
                                        throw new Error(`Reference ${$ref} is broken`);
                                    let attributeReference = $ref.match(REFERENCE_NAME_REGEX)[1];
                                    // we also need to keep track of the reference
                                    const attrRef = {
                                        to: $ref,
                                        from: `${namespace.name}.${cla$$.name}`,
                                        property: attributeName
                                    };
                                    attrTypes.push(attributeReference);
                                    // add to the list of references
                                    namespace.references ? namespace.references.push(attrRef) : namespace.references = [attrRef];
                                }
                                attribute.type = attrTypes.join(" | ");
                            }
                            else if (modelAttribute.enum) { // it is an enumeration
                                attribute.type = modelAttribute.type;
                                // add the enum to the list of available enums
                                const enumeration = {
                                    name: attributeName,
                                    belongsTo: cla$$.name,
                                    properties: modelAttribute.enum
                                };
                                namespace.enums.push(enumeration);
                                // an enum also needs to be in the references list
                                const attrRef = {
                                    to: `${enumeration.belongsTo} ${attributeName}`,
                                    from: `${namespace.name}.${cla$$.name}`,
                                    property: attributeName
                                };
                                namespace.references.push(attrRef);
                            }
                            // we found an array of "something"
                            else if (modelAttribute.type === "array" && modelAttribute.items) {
                                if (modelAttribute.items && modelAttribute.items.type === "object") {
                                    if (!modelAttribute.items.oneOf)
                                        Logger_1.Logger.error(`missing oneOf definition for array ${namespace.name}.${cla$$.name}`);
                                    let attrTypes = [];
                                    // @@TODO: may there be arrays of enums? ==> references will fail and enums will not be created
                                    attrTypes = modelAttribute.items.oneOf.map(item => {
                                        if (!item['#ref']) {
                                            // this is an array of primitives
                                            return item.type;
                                        }
                                        else {
                                            const $ref = item['#ref'];
                                            if (null === $ref.match(REFERENCE_NAME_REGEX))
                                                throw new Error(`Reference ${$ref} is broken`);
                                            let attributeReference = $ref.match(REFERENCE_NAME_REGEX)[1];
                                            // we also need to keep track of the reference
                                            const attrRef = {
                                                to: $ref,
                                                from: `${namespace.name}.${cla$$.name}`,
                                                property: attributeName
                                            };
                                            attrTypes.push(attributeReference);
                                            // add to the list of references
                                            namespace.references ? namespace.references.push(attrRef) : namespace.references = [attrRef];
                                            return $ref.match(REFERENCE_NAME_REGEX)[1];
                                        }
                                    });
                                    attribute.type = attrTypes.map((e => e + "[]")).join(" | ");
                                }
                                else {
                                    Logger_1.Logger.error(`items must be object: ${namespace.name}.${cla$$.name}`);
                                }
                            }
                            //we found a primitive type ;)
                            else {
                                attribute.type = modelAttribute.type;
                                attribute.format = modelAttribute.format;
                            }
                            cla$$.properties.push(attribute);
                        }
                    }
                    // before we add the class, oder properties so we have id, name, uri on top for uniformity
                    cla$$.properties = cla$$.properties.sort(propertyCompare);
                    namespace.classes ? namespace.classes.push(cla$$) : namespace.classes = [cla$$];
                }
            }
            // second take care of all type definitions
            // @@TODO: to be implemented
            ret.namespaces.push(namespace);
        }
        ;
        return ret;
    });
}
exports.parseSchemas = parseSchemas;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9yZW5kZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0Isd0RBQWdDO0FBQ2hDLHVDQUF5QjtBQUN6QixtQ0FBa0M7QUFDbEMsa0RBQXlCO0FBQ3pCLGtEQUErQztBQXFDL0MsTUFBTSxVQUFVLEdBQVc7SUFDekIsVUFBVSxFQUFFO1FBQ1Y7WUFDRSxJQUFJLEVBQUUsU0FBUztZQUNmLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxJQUFJLEVBQUUsY0FBYztvQkFDcEIsVUFBVSxFQUFFO3dCQUNWOzRCQUNFLElBQUksRUFBRSxVQUFVOzRCQUNoQixJQUFJLEVBQUUsTUFBTTt5QkFDYjt3QkFDRDs0QkFDRSxJQUFJLEVBQUUsTUFBTTs0QkFDWixJQUFJLEVBQUUsUUFBUTt5QkFDZjt3QkFDRDs0QkFDRSxJQUFJLEVBQUUsVUFBVTs0QkFDaEIsSUFBSSxFQUFFLFdBQVc7eUJBQ2xCO3FCQUNGO2lCQUNGO2dCQUNEO29CQUNFLElBQUksRUFBRSxVQUFVO29CQUNoQixVQUFVLEVBQUU7d0JBQ1Y7NEJBQ0UsSUFBSSxFQUFFLE1BQU07NEJBQ1osSUFBSSxFQUFFLFFBQVE7eUJBQ2Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELEtBQUssRUFBRTtnQkFDTDtvQkFDRSxJQUFJLEVBQUUsVUFBVTtvQkFDaEIsU0FBUyxFQUFFLFNBQVM7b0JBQ3BCLFVBQVUsRUFBRTt3QkFDVixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTztxQkFDaEM7aUJBQ0Y7YUFDRjtZQUNELFVBQVUsRUFBRTtnQkFDVjtvQkFDRSxJQUFJLEVBQUUsc0JBQXNCO29CQUM1QixFQUFFLEVBQUUsa0JBQWtCO29CQUN0QixRQUFRLEVBQUUsVUFBVTtpQkFBQztnQkFDdkI7b0JBQ0UsSUFBSSxFQUFFLGtCQUFrQjtvQkFDeEIsRUFBRSxFQUFFLGtCQUFrQjtvQkFDdEIsUUFBUSxFQUFFLFFBQVE7aUJBQ25CO2dCQUNEO29CQUNFLElBQUksRUFBRSxzQkFBc0I7b0JBQzVCLEVBQUUsRUFBRSxrQkFBa0I7b0JBQ3RCLFFBQVEsRUFBRSxVQUFVO2lCQUNyQjthQUNGO1NBQ0Y7UUFDRDtZQUNFLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFO2dCQUNQO29CQUNFLElBQUksRUFBRSxVQUFVO29CQUNoQixVQUFVLEVBQUU7d0JBQ1Y7NEJBQ0UsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsSUFBSSxFQUFFLGNBQWM7eUJBQ3JCO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRCxVQUFVLEVBQUU7Z0JBQ1Y7b0JBQ0UsSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsRUFBRSxFQUFFLHNCQUFzQjtvQkFDMUIsUUFBUSxFQUFFLFFBQVE7aUJBQ25CO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQTtBQUdEOzs7R0FHRztBQUNILFNBQXNCLGVBQWU7O1FBQ25DLE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7Q0FBQTtBQUZELDBDQUVDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBc0IsTUFBTSxDQUFDLFVBQWtCOztRQUM3QyxJQUFHLENBQUUsVUFBVSxFQUFDO1lBQ2QsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMseUJBQXlCLE9BQU8sVUFBVSxvQkFBb0IsQ0FBQyxDQUFDO1lBQ3BGLE1BQU0sR0FBRyxDQUFDO1NBQ1g7UUFDRCxvR0FBb0c7UUFDcEcsTUFBTSxTQUFTLEdBQUcsSUFBSSxpQkFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDckQsU0FBUyxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUMsQ0FBQyxpQ0FBaUM7UUFFN0QsTUFBTSxVQUFVLEdBQUcsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUscUNBQXFDLENBQUMsQ0FBQyxDQUFDO1FBRXBHLHVCQUF1QjtRQUN2QixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksZUFBSSxDQUFDO1lBQ3RCLEdBQUcsRUFBRSxHQUFHO1lBQ1IsSUFBSSxFQUFFLEdBQUc7WUFDVCxJQUFJLEVBQUUsb0JBQW9CO1lBQzFCLFFBQVEsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUMsT0FBTyxDQUFDO1NBQzdGLENBQUMsQ0FBQyxDQUFDO1FBRUosaUJBQWlCO1FBQ2pCLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztDQUFBO0FBdEJELHdCQXNCQztBQUdEOzs7O0dBSUc7QUFDSCxTQUFzQixhQUFhLENBQUMsYUFBb0I7O1FBQ3RELElBQUksU0FBUyxHQUFvQyxFQUNoRCxDQUFDO1FBQ0YsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUNwRSxLQUFLLE1BQU0sUUFBUSxJQUFJLFNBQVMsRUFBRTtZQUNoQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQy9HO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztDQUFBO0FBUkQsc0NBUUM7QUFBQSxDQUFDO0FBR0QscUNBQXFDO0FBQ3RDLFNBQVMsZUFBZSxDQUFFLENBQWUsRUFBRSxDQUFlO0lBQ3hELElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJO1FBQ2pCLE9BQU8sQ0FBQyxDQUFDLENBQUE7SUFDWCxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTTtRQUNuQixPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQ1gsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLEtBQUs7UUFDbEIsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUNYLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJO1FBQ2pCLE9BQU8sQ0FBQyxDQUFBO0lBQ1YsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU07UUFDbkIsT0FBTyxDQUFDLENBQUE7SUFDVixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSztRQUNsQixPQUFPLENBQUMsQ0FBQTtJQUNWLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSTtRQUNqQixPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ1osSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJO1FBQ2pCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBRUQsTUFBTSxhQUFhLEdBQUcsK0NBQStDLENBQUM7QUFDdEUsTUFBTSxvQkFBb0IsR0FBRywyQ0FBMkMsQ0FBQztBQUV6RTs7OztHQUlHO0FBQ0gsU0FBc0IsWUFBWSxDQUFDLFdBQTJCOztRQUU1RCxXQUFXLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXZFLElBQUksR0FBRyxHQUFXO1lBQ2hCLFVBQVUsRUFBRSxFQUFFO1NBQ2YsQ0FBQztRQUVGLEtBQUssTUFBTSxVQUFVLElBQUksV0FBVyxFQUFFO1lBRXBDLElBQUk7Z0JBQ0YseUJBQXlCO2dCQUN6QixFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzlDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyw2QkFBNkIsVUFBVSxHQUFHLENBQUMsQ0FBQzthQUM3RDtZQUVELDJDQUEyQztZQUMzQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyx3REFBd0Q7WUFFeEgsTUFBTSxhQUFhLEdBQUcsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUVwSCxJQUFJLENBQUMsYUFBYTtnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVuRixJQUFJLFNBQVMsR0FBb0I7Z0JBQy9CLElBQUksRUFBRSxhQUFhO2dCQUNuQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxLQUFLLEVBQUUsRUFBRTtnQkFDVCxVQUFVLEVBQUUsRUFBRTthQUNmLENBQUM7WUFFRixnREFBZ0Q7WUFDaEQsS0FBSyxNQUFNLFlBQVksSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUMzQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFO29CQUNsRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUNoRCxNQUFNLEtBQUssR0FBb0M7d0JBQzlDLElBQUksRUFBRSxZQUFZLEdBQUcsUUFBUTt3QkFDN0IsVUFBVSxFQUFFLEVBQUU7cUJBQ2YsQ0FBQTtvQkFDRCw4QkFBOEI7b0JBQzlCLElBQUcsQ0FBQyxRQUFRLENBQUMsV0FBVzt3QkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxhQUFhLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQTtvQkFDM0gsS0FBSyxNQUFNLGFBQWEsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRTt3QkFDM0QsSUFBSSxRQUFRLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLEVBQUU7NEJBQ2pFLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDOzRCQUV0RSxJQUFJLFNBQVMsR0FBZ0Q7Z0NBQzNELE1BQU0sRUFBRSxhQUFhOzZCQUN0QixDQUFDOzRCQUVGLDJCQUEyQjs0QkFDM0IsSUFBRyxjQUFjLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxjQUFjLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFDO2dDQUM1RSxJQUFJLFNBQVMsR0FBYSxFQUFFLENBQUE7Z0NBQzVCLEtBQUssTUFBTSxJQUFJLElBQUksY0FBYyxDQUFDLEtBQUssRUFBRTtvQ0FDdkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29DQUMxQixJQUFHLElBQUksS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDO3dDQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxJQUFJLFlBQVksQ0FBQyxDQUFBO29DQUM1RixJQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDN0QsOENBQThDO29DQUM5QyxNQUFNLE9BQU8sR0FBb0I7d0NBQy9CLEVBQUUsRUFBRSxJQUFJO3dDQUNSLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksRUFBRTt3Q0FDdkMsUUFBUSxFQUFFLGFBQWE7cUNBQ3hCLENBQUE7b0NBQ0QsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO29DQUNuQyxnQ0FBZ0M7b0NBQ2hDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7aUNBQzlGO2dDQUNELFNBQVMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs2QkFDeEM7aUNBQ0ksSUFBRyxjQUFjLENBQUMsSUFBSSxFQUFFLEVBQUUsdUJBQXVCO2dDQUNwRCxTQUFTLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUM7Z0NBRXJDLDhDQUE4QztnQ0FDOUMsTUFBTSxXQUFXLEdBQUc7b0NBQ2xCLElBQUksRUFBRyxhQUFhO29DQUNwQixTQUFTLEVBQUcsS0FBSyxDQUFDLElBQUk7b0NBQ3RCLFVBQVUsRUFBRyxjQUFjLENBQUMsSUFBSTtpQ0FDakMsQ0FBQTtnQ0FDRCxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQ0FFbEMsa0RBQWtEO2dDQUNsRCxNQUFNLE9BQU8sR0FBb0I7b0NBQy9CLEVBQUUsRUFBRSxHQUFHLFdBQVcsQ0FBQyxTQUFTLElBQUksYUFBYSxFQUFFO29DQUMvQyxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7b0NBQ3ZDLFFBQVEsRUFBRSxhQUFhO2lDQUN4QixDQUFBO2dDQUNELFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzZCQUNwQzs0QkFDRCxtQ0FBbUM7aUNBQzlCLElBQUcsY0FBYyxDQUFDLElBQUksS0FBSyxPQUFPLElBQUksY0FBYyxDQUFDLEtBQUssRUFBRTtnQ0FDL0QsSUFBRyxjQUFjLENBQUMsS0FBSyxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtvQ0FDakUsSUFBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSzt3Q0FBRSxlQUFNLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxTQUFTLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO29DQUNuSCxJQUFJLFNBQVMsR0FBWSxFQUFFLENBQUM7b0NBQzVCLCtGQUErRjtvQ0FDL0YsU0FBUyxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTt3Q0FDaEQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTs0Q0FDakIsaUNBQWlDOzRDQUNqQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7eUNBQ2xCOzZDQUNJOzRDQUNILE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs0Q0FDMUIsSUFBRyxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQztnREFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGFBQWEsSUFBSSxZQUFZLENBQUMsQ0FBQzs0Q0FDN0YsSUFBSSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7NENBQzdELDhDQUE4Qzs0Q0FDOUMsTUFBTSxPQUFPLEdBQW9CO2dEQUMvQixFQUFFLEVBQUUsSUFBSTtnREFDUixJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7Z0RBQ3ZDLFFBQVEsRUFBRSxhQUFhOzZDQUN4QixDQUFBOzRDQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs0Q0FDbkMsZ0NBQWdDOzRDQUNoQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRDQUM3RixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTt5Q0FDM0M7b0NBQ0gsQ0FBQyxDQUFDLENBQUM7b0NBQ0gsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUNBQzVEO3FDQUNJO29DQUNILGVBQU0sQ0FBQyxLQUFLLENBQUMseUJBQXlCLFNBQVMsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7aUNBQ3ZFOzZCQUNGOzRCQUNELDhCQUE4QjtpQ0FDekI7Z0NBQ0gsU0FBUyxDQUFDLElBQUksR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDO2dDQUNyQyxTQUFTLENBQUMsTUFBTSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUM7NkJBQzFDOzRCQUVELEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3lCQUNsQztxQkFDRjtvQkFFRCwwRkFBMEY7b0JBQzFGLEtBQUssQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7b0JBRTFELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2pGO2FBQ0Y7WUFFQywyQ0FBMkM7WUFDM0MsNEJBQTRCO1lBQzVCLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2hDO1FBQUEsQ0FBQztRQUNGLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztDQUFBO0FBOUlELG9DQThJQyJ9