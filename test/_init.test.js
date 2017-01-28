"use strict";
import fs from "fs";
import path from "path";
import {should, expect} from "chai";
should(); // init should
global.fs = fs;
global.path = path;
global.should = should;
global.expect = expect;
global.APP_ROOT = __dirname;

import * as index from "../index";

describe("Initialization Test Suite", ()=> {
    it("should have an initializer method", ()=>{
        index.initialize.should.be.a.function;
    });
    it("should handle a connection", (done)=>{
        index.initialize({
            settings: {
                name: "files",
                path: global.APP_ROOT,
                file: "a_file.txt",
        }}, done);
    });
});
