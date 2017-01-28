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
