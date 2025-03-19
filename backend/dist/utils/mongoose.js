"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidObjectId = exports.toObjectId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const error_1 = require("../middleware/error");
const toObjectId = (id) => {
    try {
        return new mongoose_1.default.Types.ObjectId(id);
    }
    catch (error) {
        throw new error_1.APIError(400, 'Invalid ID format');
    }
};
exports.toObjectId = toObjectId;
const isValidObjectId = (id) => {
    return mongoose_1.default.Types.ObjectId.isValid(id);
};
exports.isValidObjectId = isValidObjectId;
