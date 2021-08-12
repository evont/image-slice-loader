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
        template: {
            type: "string",
            description: "Template of virtual property transformed local CSS."
        },
        sepTemplate: {
            type: "string",
            description: "Template of virtual property transformed local CSS in seperate way."
        },
        handlebarsHelpers: {
            type: "object",
            description: "helper for handlebars template"
        }
    },
    additionalProperties: false
};
