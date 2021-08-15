"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: "object",
    properties: {
        property: {
            description: "Custom CSS property name.",
            type: "string",
        },
        output: {
            description: "slice block name",
            anyOf: [{ instanceof: "Function" }, { type: "string" }],
        },
        outputPath: {
            type: "string",
            description: "output path of slice images",
        },
        template: {
            instanceof: "Function",
            description: "Template of virtual property transformed local CSS.",
        },
        cachePath: {
            type: "string",
            description: "cache path of slice images",
        }
    },
    additionalProperties: false,
};
