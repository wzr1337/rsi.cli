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
exports.propertyCompare = propertyCompare;
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
            //@@ TODO: a lot of code duplication going on in the following sections. needs refactoring URGENTLY
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
                                else if (modelAttribute.items && modelAttribute.items.type !== "object") {
                                    let attrTypes = [modelAttribute.items.type];
                                    // @@TODO: may there be arrays of enums? ==> references will fail and enums will not be created
                                    attribute.type = attrTypes.map((e => e + "[]")).join(" | ");
                                }
                                else {
                                    Logger_1.Logger.error(`items must be object: ${namespace.name}.${cla$$.name}:${attributeName}`);
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
            // second, take care of all type definitions
            for (const typeName in schema.types) {
                if (schema.types.hasOwnProperty(typeName)) {
                    const type = schema.types[typeName];
                    const typeDefinition = {
                        name: typeName + "Type",
                        properties: []
                    };
                    // iterate over all attributes
                    if (!type.attributes)
                        throw new Error(`attributes missing in type definition of ${namespaceName}.${typeName}`);
                    for (const attributeName in type.attributes) {
                        if (type.attributes.hasOwnProperty(attributeName)) {
                            const modelAttribute = type.attributes[attributeName];
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
                                        from: `${namespace.name}.${typeDefinition.name}`,
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
                                    belongsTo: typeDefinition.name,
                                    properties: modelAttribute.enum
                                };
                                namespace.enums.push(enumeration);
                                // an enum also needs to be in the references list
                                const attrRef = {
                                    to: `${enumeration.belongsTo} ${attributeName}`,
                                    from: `${namespace.name}.${typeDefinition.name}`,
                                    property: attributeName
                                };
                                namespace.references.push(attrRef);
                            }
                            // we found an array of "something"
                            else if (modelAttribute.type === "array" && modelAttribute.items) {
                                if (modelAttribute.items && modelAttribute.items.type === "object") {
                                    if (!modelAttribute.items.oneOf)
                                        Logger_1.Logger.error(`missing oneOf definition for array ${namespace.name}.${typeDefinition.name}`);
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
                                                from: `${namespace.name}.${typeDefinition.name}`,
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
                                    Logger_1.Logger.error(`items must be object: ${namespace.name}.${typeDefinition.name}`);
                                }
                            }
                            //we found a primitive type ;)
                            else {
                                attribute.type = modelAttribute.type;
                                attribute.format = modelAttribute.format;
                            }
                            typeDefinition.properties.push(attribute);
                        }
                    }
                    // before we add the type, order properties so we have id, name, uri on top for uniformity
                    typeDefinition.properties = typeDefinition.properties.sort(propertyCompare);
                    namespace.types ? namespace.types.push(typeDefinition) : namespace.types = [typeDefinition];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9yZW5kZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0Isd0RBQWdDO0FBQ2hDLHVDQUF5QjtBQUN6QixtQ0FBa0M7QUFDbEMsa0RBQXlCO0FBQ3pCLGtEQUErQztBQUcvQyxNQUFNLFVBQVUsR0FBVztJQUN6QixVQUFVLEVBQUU7UUFDVjtZQUNFLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFO2dCQUNQO29CQUNFLElBQUksRUFBRSxjQUFjO29CQUNwQixVQUFVLEVBQUU7d0JBQ1Y7NEJBQ0UsSUFBSSxFQUFFLFVBQVU7NEJBQ2hCLElBQUksRUFBRSxNQUFNO3lCQUNiO3dCQUNEOzRCQUNFLElBQUksRUFBRSxNQUFNOzRCQUNaLElBQUksRUFBRSxRQUFRO3lCQUNmO3dCQUNEOzRCQUNFLElBQUksRUFBRSxVQUFVOzRCQUNoQixJQUFJLEVBQUUsV0FBVzt5QkFDbEI7cUJBQ0Y7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLFVBQVUsRUFBRTt3QkFDVjs0QkFDRSxJQUFJLEVBQUUsTUFBTTs0QkFDWixJQUFJLEVBQUUsUUFBUTt5QkFDZjtxQkFDRjtpQkFDRjthQUNGO1lBQ0QsS0FBSyxFQUFFO2dCQUNMO29CQUNFLElBQUksRUFBRSxVQUFVO29CQUNoQixTQUFTLEVBQUUsU0FBUztvQkFDcEIsVUFBVSxFQUFFO3dCQUNWLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPO3FCQUNoQztpQkFDRjthQUNGO1lBQ0QsVUFBVSxFQUFFO2dCQUNWO29CQUNFLElBQUksRUFBRSxzQkFBc0I7b0JBQzVCLEVBQUUsRUFBRSxrQkFBa0I7b0JBQ3RCLFFBQVEsRUFBRSxVQUFVO2lCQUFDO2dCQUN2QjtvQkFD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