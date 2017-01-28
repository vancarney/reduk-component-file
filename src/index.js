"use strict";
/**
 * Loopback Intialization Hook
 * @param dataSource
 * @param callback
 */
import FileComponent from "./FileComponent"
function initialize(dataSource, callback) {
    dataSource.connector = new FileComponent(dataSource.settings);
    dataSource.connector.connect(callback);
}

export {initialize};