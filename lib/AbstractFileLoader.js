/**
 * AbstractFileLoader
 * @author Van Carney <carney.van@gmail.com>
 *
 */
import {_} from "lodash";
import path from "path";
import {EventEmitter} from "events";
import * as utils from "wf-utils";
import FileConnector from "./FileConnector";
var __data = new WeakMap();
var __loaderRefs = new WeakMap();
class AbstractFileLoader extends EventEmitter {
    static initClass() {
        this.prototype.replacer = null;
    }

    /**
     *
     * @param fullFilePath
     * @param modelName
     */
    constructor(modelName, containerPath, fileName) {
        super();
        // if ("AbstractLoader" === Fun.getConstructorName(this)) {
        //   throw "AbstractAdapter can not be directly instantiated" +
        //   "\nhint: use a subclass instead.";
        // }
        let _name = modelName || `loader${Object.keys(__loaderRefs).length}`;
        let _ds = new FileConnector(containerPath, _name);
        __data.set(this, null);
        __loaderRefs.set(this, {
            path: containerPath,
            file: fileName,
            filePath: path.join(containerPath, _name, fileName),
            name: _name,
            ds: _ds,
        });
    }

    get path() {
        return __loaderRefs.get(this).path;
    }

    get container() {
        return __loaderRefs.get(this).ds;
    }

    get name() {
        return __loaderRefs.get(this).name;
    }

    get filePath() {
        return __loaderRefs.get(this).filePath;
    }

    get file() {
        return __loaderRefs.get(this).file;
    }

    /**
     *
     * @param _path
     * @returns {*}
     */
    exists(callback) {
        return this.container.connector.getFile(this.name, this.file, (e, res)=> {
            callback( res !== null );
        });
    }

    /**
     *
     * @param callback
     * @returns {boolean}
     */
    load(callback) {
        return this.container.read(this.file, "utf8", (e, data)=> {
            this.contents = data || null;
            callback(e, data);
        });
    }

    /**
     *
     * @returns {*}
     */
    get contents() {
        return __data.get(this);
    }

    /**
     *
     * @param value
     */
    set contents(value) {
        __data.set(this, value);
    }

    /**
     * Saves Loaded File
     * @param callback
     * @returns {*}
     */
    save(callback) {
        if (this.path === null) {
            // sets error if path is null
            if (utils.exists(callback)) {
                callback("path was not defined", null);
            }
            return;
        }

        return this.container.write(this.file, this.contents, "utf8", callback);
    }

    /**
     * renames loaded file
     * @param newPath
     * @param callback
     * @returns {*}
     */
    rename(newPath, callback) {
        return this.container.rename(this.file, newPath, "utf8", (e)=>{
            let _ = __loaderRefs.get(this);
            _.file = newPath;
            __loaderRefs.set(this, _);
            callback(e);
        });
    }

    /**
     * deletes Loaded File
     * @param callback
     * @returns {boolean}
     */
    destroy(cb) {
        return this.container.remove(this.file, cb);
    }

    /**
     * returns raw contents of loaded file
     * @returns {*}
     */
    valueOf() {
        return this.contents || null;
    }

    /**
     * returns JSON-formatted contents of loaded file
     * @returns JSON
     */
    toJSON() {
        return JSON.parse(this.toString());
    }

    /**
     *
     * @param readable
     * @returns string representation of File
     */
    toString(readable = false) {
        if (typeof this.valueOf() === "string") {
            return this.valueOf();
        }
        return JSON.stringify(this.valueOf(), this.replacer, readable ? 2 : undefined);
    }
}
AbstractFileLoader.initClass();
export default AbstractFileLoader;
