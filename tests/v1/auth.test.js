"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const app_1 = __importDefault(require("../../src/app"));
const error_code_1 = require("../../src/utils/error_code");
(0, vitest_1.describe)("Testing signing up flow", () => {
    (0, vitest_1.it)("testing with correct data for success", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            email: "emma8@gmail.com",
            first_name: "emma",
            last_name: "tester",
            password: "Password11@",
        };
        const res = yield app_1.default.request("api/v1/auth/signup", {
            method: "POST",
            body: JSON.stringify(data),
        });
        (0, vitest_1.expect)(res.status).toBe(201);
        (0, vitest_1.expect)(yield res.json()).toContain({
            status_code: error_code_1.ErrorCode.SUCCESS,
        });
    }));
});
