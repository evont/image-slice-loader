export default {
  type: "object" as const,
  properties: {
    property: {
      description: "Custom CSS property name.",
      type: "string" as const,
    },
    output: {
      description: "slice block name", 
      anyOf: [{ type: "array" as const }, { type: "string" as const }],
    },
    outputPath: {
      type: "string" as const,
      description: "output path of slice images"
    },
    template: {
      type: "string" as const,
      description: "Template of virtual property transformed local CSS. It accepts template content instead of a template file path"
    },
    sepTemplate: {
      type: "string" as const,
      description: "Template of virtual property transformed local CSS. It accepts template content instead of a template file path"
    },
    handlebarsHelpers: {
      type: "object" as const,
      description: "helper for handlebars template"
    }
  },
  additionalProperties: false,
};
