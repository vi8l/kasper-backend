"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.init = void 0;
const mysql_1 = require("mysql");
const db_configs_1 = require("../configs/db_configs");
const db_configs = db_configs_1.DB_CONFIGS.mySqlDbConfigs;
let pool;
/**
 * generates pool connection to be used throughout the app
 */
const init = () => {
    try {
        pool = (0, mysql_1.createPool)({
            connectionLimit: db_configs.DB_CONNECTION_LIMIT,
            host: db_configs.DB_HOST,
            user: db_configs.DB_USER,
            password: db_configs.DB_PASSWORD,
            database: db_configs.DB_DATABASE,
        });
        console.debug('MySql Adapter Pool generated successfully');
    }
    catch (error) {
        console.error('[mysql.connector][init][Error]: ', error);
        throw new Error('failed to initialized pool');
    }
};
exports.init = init;
/**
 * executes SQL queries in MySQL db
 *
 * @param {string} query - provide a valid SQL query
 * @param {string[] | Object} params - provide the parameterized values used
 * in the query
 */
const execute = (query, params) => {
    try {
        if (!pool)
            throw new Error('Pool was not created. Ensure pool is created when running the app.');
        return new Promise((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error)
                    reject(error);
                else
                    resolve(results);
            });
        });
    }
    catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('failed to execute MySQL query');
    }
};
exports.execute = execute;
