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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvc2VydmljZS9yZW5kZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0Isd0RBQWdDO0FBQ2hDLHVDQUF5QjtBQUN6QixtQ0FBa0M7QUFDbEMsa0RBQXlCO0FBQ3pCLGtEQUErQztBQUUvQyxnREFBZ0Y7QUFFaEYsTUFBTSxVQUFVLEdBQVc7SUFDekIsVUFBVSxFQUFFO1FBQ1Y7WUFDRSxJQUFJLEVBQUUsU0FBUztZQUNmLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxJQUFJLEVBQUUsY0FBYztvQkFDcEIsVUFBVSxFQUFFO3dCQUNWOzRCQUNFLElBQUksRUFBRSxVQUFVOzRCQUNoQixJQUFJLEVBQUUsTUFBTTt5QkFDYjt3QkFDRDs0QkFDRSxJQUFJLEVBQUUsTUFBTTs0QkFDWixJQUFJLEVBQUUsUUFBUTt5QkFDZjt3QkFDRDs0QkFDRSxJQUFJLEVBQUUsVUFBVTs0QkFDaEIsSUFBSSxFQUFFLFdBQVc7eUJBQ2xCO3FCQUNGO2lCQUNGO2dCQUNEO29CQUNFLElBQUksRUFBRSxVQUFVO29CQUNoQixVQUFVLEVBQUU7d0JBQ1Y7NEJBQ0UsSUFBSSxFQUFFLE1BQU07NEJBQ1osSUFBSSxFQUFFLFFBQVE7eUJBQ2Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELEtBQUssRUFBRTtnQkFDTDtvQkFDRSxJQUFJLEVBQUUsVUFBVTtvQkFDaEIsU0FBUyxFQUFFLFNBQVM7b0JBQ3BCLFVBQVUsRUFBRTt3QkFDVixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTztxQkFDaEM7aUJBQ0Y7YUFDRjtZQUNELFVBQVUsRUFBRTtnQkFDVjtvQkFDRSxJQUFJLEVBQUUsc0JBQXNCO29CQUM1QixFQUFFLEVBQUUsa0JBQWtCO29CQUN0QixRQUFRLEVBQUUsVUFBVTtpQkFB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