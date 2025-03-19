"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "Admin";
    UserRole["Leader"] = "Leader";
    UserRole["Employee"] = "Employee";
})(UserRole || (exports.UserRole = UserRole = {}));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    oktaId: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
// Middleware to update the updatedAt timestamp
userSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ oktaId: 1 });
userSchema.index({ role: 1 });
exports.User = (0, mongoose_1.model)('User', userSchema);
