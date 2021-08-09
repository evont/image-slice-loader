"use strict";
exports.__esModule = true;
exports["default"] = {
    type: "object",
    properties: {
        property: {
            description: "Custom CSS property name.",
            type: "string"
        },
        output: {
            description: "slice block name",
            anyOf: [{ type: "array" }, { type: "string" }]
        },
        outputPath: {
            type: "string",
            description: "output path of slice images"
        },
        clearOutput: {
            type: "boolean",
            description: "whether clean output images or not before generate new slice images"
        },
        template: {
            type: "string",
            description: "Template of virtual property transformed local CSS. It accepts template content instead of a template file path"
        },
        sepTemplate: {
            type: "string",
            description: "Template of virtual property transformed local CSS. It accepts template content instead of a template file path"
        },
        handlebarsHelpers: {
            type: "object",
            description: "helper for handlebars template"
        }
    },
    additionalProperties: false
};
