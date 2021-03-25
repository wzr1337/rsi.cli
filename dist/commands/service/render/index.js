"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSchemas = exports.propertyCompare = exports.loadTemplates = exports.render = exports.getSampleSchema = void 0;
const path = __importStar(require("path"));
const mustache_1 = __importDefault(require("mustache"));
const fs = __importStar(require("fs"));
const stream_1 = require("stream");
const vinyl_1 = __importDefault(require("vinyl"));
const Logger_1 = require("../../../utils/Logger");
const regex_1 = require("../../../utils/regex");
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
/**
 * parses schema(s) into ISchema compliant objects
 * @param  {string|Array<string>} serviceDefs path(s) to viwi scheme file
 * @return {object} schema representation
 */
// export async function parseSchemas(schemapaths:string|string[]):Promise<ISchema> {
function parseSchemas(serviceDefs) {
    return __awaiter(this, void 0, void 0, function* () {
        // serviceDefs = Array.isArray(serviceDefs) ? serviceDefs : [serviceDefs];
        var ret = {
            namespaces: []
        };
        if (Object.keys(serviceDefs).length === 0)
            throw new Error('passed empty service definition(s)');
        for (const schemaPath in serviceDefs) {
            try {
                // check file availablity
                fs.accessSync(serviceDefs[schemaPath], fs.constants.R_OK);
            }
            catch (error) {
                throw new Error(`Can not parse schema from ${serviceDefs[schemaPath] || "undefined"}!`);
            }
            // start parsing if no exception was thrown
            const schema = JSON.parse(fs.readFileSync(serviceDefs[schemaPath], 'utf8')); // might fail an throw an error which is caught by async
            const namespaceName = (null !== schema.name.match(regex_1.SERVICE_NAME_REGEX)) ? schema.name.match(regex_1.SERVICE_NAME_REGEX)[1] : undefined;
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
                                    if (null === $ref.match(regex_1.REFERENCE_NAME_REGEX))
                                        throw new Error(`Reference ${$ref} is broken`);
                                    let attributeReference = $ref.match(regex_1.REFERENCE_NAME_REGEX)[1];
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
                                            if (null === $ref.match(regex_1.REFERENCE_NAME_REGEX))
                                                throw new Error(`Reference ${$ref} is broken`);
                                            let attributeReference = $ref.match(regex_1.REFERENCE_NAME_REGEX)[1];
                                            // we also need to keep track of the reference
                                            const attrRef = {
                                                to: $ref,
                                                from: `${namespace.name}.${cla$$.name}`,
                                                property: attributeName
                                            };
                                            attrTypes.push(attributeReference);
                                            // add to the list of references
                                            namespace.references ? namespace.references.push(attrRef) : namespace.references = [attrRef];
                                            return $ref.match(regex_1.REFERENCE_NAME_REGEX)[1];
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
                                    if (null === $ref.match(regex_1.REFERENCE_NAME_REGEX))
                                        throw new Error(`Reference ${$ref} is broken`);
                                    let attributeReference = $ref.match(regex_1.REFERENCE_NAME_REGEX)[1];
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
                                            if (null === $ref.match(regex_1.REFERENCE_NAME_REGEX))
                                                throw new Error(`Reference ${$ref} is broken`);
                                            let attributeReference = $ref.match(regex_1.REFERENCE_NAME_REGEX)[1];
                                            // we also need to keep track of the reference
                                            const attrRef = {
                                                to: $ref,
                                                from: `${namespace.name}.${typeDefinition.name}`,
                                                property: attributeName
                                            };
                                            attrTypes.push(attributeReference);
                                            // add to the list of references
                                            namespace.references ? namespace.references.push(attrRef) : namespace.references = [attrRef];
                                            return $ref.match(regex_1.REFERENCE_NAME_REGEX)[1];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9yZW5kZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3Qix3REFBZ0M7QUFDaEMsdUNBQXlCO0FBQ3pCLG1DQUFrQztBQUNsQyxrREFBeUI7QUFDekIsa0RBQStDO0FBRS9DLGdEQUFnRjtBQUVoRixNQUFNLFVBQVUsR0FBVztJQUN6QixVQUFVLEVBQUU7UUFDVjtZQUNFLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFO2dCQUNQO29CQUNFLElBQUksRUFBRSxjQUFjO29CQUNwQixVQUFVLEVBQUU7d0JBQ1Y7NEJBQ0UsSUFBSSxFQUFFLFVBQVU7NEJBQ2hCLElBQUksRUFBRSxNQUFNO3lCQUNiO3dCQUNEOzRCQUNFLElBQUksRUFBRSxNQUFNOzRCQUNaLElBQUksRUFBRSxRQUFRO3lCQUNmO3dCQUNEOzRCQUNFLElBQUksRUFBRSxVQUFVOzRCQUNoQixJQUFJLEVBQUUsV0FBVzt5QkFDbEI7cUJBQ0Y7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLFVBQVUsRUFBRTt3QkFDVjs0QkFDRSxJQUFJLEVBQUUsTUFBTTs0QkFDWixJQUFJLEVBQUUsUUFBUTt5QkFDZjtxQkFDRjtpQkFDRjthQUNGO1lBQ0QsS0FBSyxFQUFFO2dCQUNMO29CQUNFLElBQUksRUFBRSxVQUFVO29CQUNoQixTQUFTLEVBQUUsU0FBUztvQkFDcEIsVUFBVSxFQUFFO3dCQUNWLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPO3FCQUNoQztpQkFDRjthQUNGO1lBQ0QsVUFBVSxFQUFFO2dCQUNWO29CQUNFLElBQUksRUFBRSxzQkFBc0I7b0JBQzVCLEVBQUUsRUFBRSxrQkFBa0I7b0JBQ3RCLFFBQVEs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