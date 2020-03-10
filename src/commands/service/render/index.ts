import * as path from "path";
import mustache from "mustache";
import * as fs from "fs";
import { Readable } from "stream";
import File from "vinyl";
import { Logger } from "../../../utils/Logger";
import { ISchema, ISchemaNameSpace, ISchemaReference } from "./interfaces";
import { SERVICE_NAME_REGEX, REFERENCE_NAME_REGEX } from '../../../utils/regex';

const SAMPLEDATA:ISchema = {
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
          property: "rimTypes"},
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
}


/**
 * parses a schema from RSI definitions
 * @param  {String}   schemaPath path to RSI schema
 */
export async function getSampleSchema():Promise<ISchema> {
  return SAMPLEDATA;
}

/**
 * renderes plantuml syntax from RSI definitions
 * @param  {String}   schemaPath path to RSI schema
 */
export async function render(schemaData:ISchema):Promise<Readable> {
  if(! schemaData){
    var err = new Error(`Can not render out of ${typeof schemaData}, need an ISchema!`);
    throw err;
  }
  // create an returnable ReadStream that is in object mode, because we want to put File objects on it
  const outStream = new Readable({ objectMode: true });
  outStream._read = () => {}; // implemenmts a read() function 

  const $templates = await loadTemplates(path.join(__dirname, "../../../../assets/class.templates/"));

  // publish package.json
  outStream.push(new File({
    cwd: '/',
    base: '/',
    path: '/classDiagram.puml',
    contents: Buffer.from(mustache.render($templates['$index'], schemaData, $templates),"utf-8")
  }));

  // end the stream
  outStream.push(null);
  return outStream;
}


/**
 * load mustache templates asynchronously
 * @param  {String} mustachesPath The path to all mustaches
 * @private
 */
export async function loadTemplates(mustachesPath:string):Promise<{[templateName:string]: string}> {
  var templates: {[templateName:string]: string} = {
  };
  const fileNames = fs.readdirSync(mustachesPath, {encoding: "utf8"});
  for (const filename of fileNames) {
    templates[path.basename(filename, '.mustache')] = fs.readFileSync(path.join(mustachesPath, filename), "utf8");
  }
  return templates;
};


 // compare property names for sorting
export function propertyCompare (a:{name:string}, b:{name:string}) {
  if (a.name === "id") 
    return -4
  if (a.name === "name") 
    return -3
  if (a.name === "uri") 
    return -2
  if (b.name === "id") 
    return 4
  if (b.name === "name") 
    return 3
  if (b.name === "uri") 
    return 2
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}



/**
 * parses schema(s) into ISchema compliant objects
 * @param  {string|Array<string>} serviceDefs path(s) to viwi scheme file
 * @return {object} schema representation
 */
// export async function parseSchemas(schemapaths:string|string[]):Promise<ISchema> {
export async function parseSchemas(serviceDefs: Object):Promise<ISchema> {

  // serviceDefs = Array.isArray(serviceDefs) ? serviceDefs : [serviceDefs];

  var ret:ISchema = {
    namespaces: []
  };
  if (Object.keys(serviceDefs).length === 0) throw new Error('passed empty service definition(s)');
  for (const schemaPath in serviceDefs) {

    try {
      // check file availablity
      fs.accessSync(serviceDefs[schemaPath], fs.constants.R_OK);
    } catch (error) {
      throw new Error(`Can not parse schema from ${serviceDefs[schemaPath] || "undefined"}!`);
    }

    // start parsing if no exception was thrown
    const schema = JSON.parse(fs.readFileSync(serviceDefs[schemaPath], 'utf8')); // might fail an throw an error which is caught by async
    const namespaceName = (null !== schema.name.match(SERVICE_NAME_REGEX)) ? schema.name.match(SERVICE_NAME_REGEX)[1] : undefined;
    if (!namespaceName) throw new Error("no service name found for in " + schema.name);

    let namespace:ISchemaNameSpace = {
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
        const cla$$:{name:string, properties: any[]} = {
          name: resourceName + "Object",
          properties: []
        }
        // iterate over all attributes
        if(!resource.objectModel) throw new Error(`objectModel missing in resource definition of ${namespaceName}.${resourceName}`)
        for (const attributeName in resource.objectModel.attributes) {
          if (resource.objectModel.attributes.hasOwnProperty(attributeName)) {
            const modelAttribute = resource.objectModel.attributes[attributeName];
            
            let attribute: {name:string, type?:string, format?:string} = {
              "name": attributeName,
            };

            // reference type or object
            if(modelAttribute.type === 'object' && modelAttribute.hasOwnProperty("oneOf")){
              let attrTypes: string[] = []
              for (const item of modelAttribute.oneOf) {
                const $ref = item['#ref'];
                if(null === $ref.match(REFERENCE_NAME_REGEX)) throw new Error(`Reference ${$ref} is broken`)
                let attributeReference = $ref.match(REFERENCE_NAME_REGEX)[1]; 
                // we also need to keep track of the reference
                const attrRef:ISchemaReference = {
                  to: $ref,
                  from: `${namespace.name}.${cla$$.name}`,
                  property: attributeName
                }
                attrTypes.push(attributeReference);
                // add to the list of references
                namespace.references ? namespace.references.push(attrRef) : namespace.references = [attrRef];
              }
              attribute.type = attrTypes.join(" | ");
            }
            else if(modelAttribute.enum) { // it is an enumeration
              attribute.type = modelAttribute.type;

              // add the enum to the list of available enums
              const enumeration = {
                name : attributeName,
                belongsTo : cla$$.name,
                properties : modelAttribute.enum
              }
              namespace.enums.push(enumeration);

              // an enum also needs to be in the references list
              const attrRef:ISchemaReference = {
                to: `${enumeration.belongsTo} ${attributeName}`,
                from: `${namespace.name}.${cla$$.name}`,
                property: attributeName
              }
              namespace.references.push(attrRef);
            }
            // we found an array of "something"
            else if(modelAttribute.type === "array" && modelAttribute.items) {
              if(modelAttribute.items && modelAttribute.items.type === "object") {
                if(!modelAttribute.items.oneOf) Logger.error(`missing oneOf definition for array ${namespace.name}.${cla$$.name}`);
                let attrTypes:string[] = [];
                // @@TODO: may there be arrays of enums? ==> references will fail and enums will not be created
                attrTypes = modelAttribute.items.oneOf.map(item => {
                  if (!item['#ref']) {
                    // this is an array of primitives
                    return item.type;
                  }
                  else {
                    const $ref = item['#ref'];
                    if(null === $ref.match(REFERENCE_NAME_REGEX)) throw new Error(`Reference ${$ref} is broken`);
                    let attributeReference = $ref.match(REFERENCE_NAME_REGEX)[1]; 
                    // we also need to keep track of the reference
                    const attrRef:ISchemaReference = {
                      to: $ref,
                      from: `${namespace.name}.${cla$$.name}`,
                      property: attributeName
                    }
                    attrTypes.push(attributeReference);
                    // add to the list of references
                    namespace.references ? namespace.references.push(attrRef) : namespace.references = [attrRef];
                    return $ref.match(REFERENCE_NAME_REGEX)[1]
                  }
                });
                attribute.type = attrTypes.map((e => e+ "[]")).join(" | ");
              }
              else if(modelAttribute.items && modelAttribute.items.type !== "object") {
                let attrTypes:string[] = [modelAttribute.items.type];
                // @@TODO: may there be arrays of enums? ==> references will fail and enums will not be created
                attribute.type = attrTypes.map((e => e+ "[]")).join(" | ");
              }
              else {
                Logger.error(`items must be object: ${namespace.name}.${cla$$.name}:${attributeName}`);
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
        const typeDefinition:{name:string, properties: any[]} = {
          name: typeName + "Type",
          properties: []
        }

        // iterate over all attributes
        if(!type.attributes) throw new Error(`attributes missing in type definition of ${namespaceName}.${typeName}`)
        for (const attributeName in type.attributes) {
          if (type.attributes.hasOwnProperty(attributeName)) {
            const modelAttribute = type.attributes[attributeName];
            
            let attribute: {name:string, type?:string, format?:string} = {
              "name": attributeName,
            };

            // reference type or object
            if(modelAttribute.type === 'object' && modelAttribute.hasOwnProperty("oneOf")){
              let attrTypes: string[] = []
              for (const item of modelAttribute.oneOf) {
                const $ref = item['#ref'];
                if(null === $ref.match(REFERENCE_NAME_REGEX)) throw new Error(`Reference ${$ref} is broken`)
                let attributeReference = $ref.match(REFERENCE_NAME_REGEX)[1]; 
                // we also need to keep track of the reference
                const attrRef:ISchemaReference = {
                  to: $ref,
                  from: `${namespace.name}.${typeDefinition.name}`,
                  property: attributeName
                }
                attrTypes.push(attributeReference);
                // add to the list of references
                namespace.references ? namespace.references.push(attrRef) : namespace.references = [attrRef];
              }
              attribute.type = attrTypes.join(" | ");
            }
            else if(modelAttribute.enum) { // it is an enumeration
              attribute.type = modelAttribute.type;

              // add the enum to the list of available enums
              const enumeration = {
                name : attributeName,
                belongsTo : typeDefinition.name,
                properties : modelAttribute.enum
              }
              namespace.enums.push(enumeration);

              // an enum also needs to be in the references list
              const attrRef:ISchemaReference = {
                to: `${enumeration.belongsTo} ${attributeName}`,
                from: `${namespace.name}.${typeDefinition.name}`,
                property: attributeName
              }
              namespace.references.push(attrRef);
            }
            // we found an array of "something"
            else if(modelAttribute.type === "array" && modelAttribute.items) {
              if(modelAttribute.items && modelAttribute.items.type === "object") {
                if(!modelAttribute.items.oneOf) Logger.error(`missing oneOf definition for array ${namespace.name}.${typeDefinition.name}`);
                let attrTypes:string[] = [];
                // @@TODO: may there be arrays of enums? ==> references will fail and enums will not be created
                attrTypes = modelAttribute.items.oneOf.map(item => {
                  if (!item['#ref']) {
                    // this is an array of primitives
                    return item.type;
                  }
                  else {
                    const $ref = item['#ref'];
                    if(null === $ref.match(REFERENCE_NAME_REGEX)) throw new Error(`Reference ${$ref} is broken`);
                    let attributeReference = $ref.match(REFERENCE_NAME_REGEX)[1]; 
                    // we also need to keep track of the reference
                    const attrRef:ISchemaReference = {
                      to: $ref,
                      from: `${namespace.name}.${typeDefinition.name}`,
                      property: attributeName
                    }
                    attrTypes.push(attributeReference);
                    // add to the list of references
                    namespace.references ? namespace.references.push(attrRef) : namespace.references = [attrRef];
                    return $ref.match(REFERENCE_NAME_REGEX)[1]
                  }
                });
                attribute.type = attrTypes.map((e => e+ "[]")).join(" | ");
              }
              else {
                Logger.error(`items must be object: ${namespace.name}.${typeDefinition.name}`);
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
  };
  return ret;
}
