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
            anyOf: [{ "instanceof": "Function" }, { type: "string" }]
        },
        outputPath: {
            type: "string",
            description: "output path of slice images"
        },
        template: {
            "instanceof": "Function",
            description: "Template of virtual property transformed local CSS."
        }
    },
    additionalProperties: false
};
