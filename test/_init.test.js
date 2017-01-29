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
  it("should have exported the initialization method", ()=>{
    index.initialize.should.be.a.function;
  });
  it("should handle a connection", (done)=>{
    let _cb = (conn)=> {
      conn.contents.should.eq("testing ... 123");
      done();
    }
    index.initialize({
      settings: {
        name: "fixtures",
        path: global.APP_ROOT,
        file: "init_data.txt",
    }}, _cb);
  });
});
