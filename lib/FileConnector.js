import {DataSource} from "loopback-datasource-juggler";
import * as storage from "loopback-component-storage";
const connectors = new WeakMap();
class FileConnector {
    /**
     *
     * @param _path
     */
    constructor(_path, _name) {
        let _ = new DataSource({
            connector: storage,
            provider: "filesystem",
            root: _path,
        });
        connectors.set(this, {
            name: _name,
            ds: _.createModel(_name),
        });
    }

    /**
     * getter for container name
     */
    get name() {
        return connectors.get(this).name;
    }

    /**
     * getter for connection
     * @returns {*}
     */
    get connector() {
        return connectors.get(this).ds;
    }

    /**
     *
     * @param file
     * @param encoding
     * @param cb
     */
    read(file, encoding, cb) {
        var res = null;
        let _ = this.connector.downloadStream(this.name, file, null, (e,res)=>{
            if (cb !== null) { cb.apply(this, arguments); }
        });
        _.setEncoding(encoding);
        _.on("data", (data)=> {
            res = res !== null ? res + data : data;
        });
        _.on("end", ()=>{
            if (cb !== null) {
                cb(null, res);
            }
        });
    }

    /**
     *
     * @param file
     * @param data
     * @param encoding
     * @param cb
     */
    write(file, data, encoding, cb) {
        let _ = this.connector.uploadStream(this.name, file, null, (e, res)=> {
            if (cb !== null) { cb.apply(this, arguments); }
        });
        _.write(data, encoding, cb);
    }

    /**
     *
     * @param oldname
     * @param newName
     * @param encoding
     * @param cb
     */
    rename(oldName, newName, encoding, cb) {
        this.read(oldName, encoding, (e, data)=> {
            if (e) {
                if (cb && typeof cb === "function") {
                    cb(e);
                }
                return;
            }
            this.write(newName, data, encoding, (e)=> {
                if (e) {
                    if (cb && typeof cb === "function") {
                        cb(e);
                    }
                    return;
                }
                return this.connector.removeFile(this.name, oldName, cb);
            })
        });
    }

    /**
     *
     * @param cb
     */
    remove(fileName, cb) {
        this.connector.removeFile(this.name, fileName, cb);
    }
}
export default FileConnector;
