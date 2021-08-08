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
    clearOutput: {
      type: "boolean" as const,
      description: "whether clean output images or not before generate new slice images"
    },
    template: {
      type: "string" as const,
      description: "Template of virtual property transformed local CSS. It accepts template content instead of a template file path"
    }
  },
  additionalProperties: false,
};
