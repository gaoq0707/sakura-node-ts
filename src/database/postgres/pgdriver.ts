// Copyright 2016 Frank Lin (lin.xiaoe.f@gmail.com). All rights reserved.
// Use of this source code is governed a license that can be found in the LICENSE file.

import * as pg from "pg";
import {Driver} from "../driver";
import {QueryResult} from "../queryresult";
import {DriverOptions} from "../driveroptions";
import {QueryBuilder} from "../querybuilder";
import {PgQueryBuilder} from "./pgquerybuilder";

/**
 * PostgresSQL client using pg.Pool.
 */
export class PgDriver implements Driver {

  private pool_: pg.Pool;

  queryBuilder: QueryBuilder = new PgQueryBuilder();

  constructor(driverOptions: DriverOptions) {
    let config: pg.PoolConfig = {
      user: driverOptions.username,
      database: driverOptions.database,
      password: driverOptions.password,
      host: driverOptions.host,
      port: driverOptions.port | 5432,
      max: 10,
      idleTimeoutMillis: 30000
    };

    this.pool_ = new pg.Pool(config);
  }

  async query(sql: string): Promise<QueryResult> {
    let client: pg.Client = await this.pool_.connect();
    try {
      const pgQueryResult: pg.QueryResult = await client.query(sql);
      return {rows: pgQueryResult.rows};
    } finally {
      client.release();
    }
  }

  async queryInTransaction(sqls: string[]): Promise<QueryResult> {
    let bigSql: string = "BEGIN;";
    for (let sql of sqls) {
      bigSql += sql;
    }
    bigSql += "COMMIT;";

    return await this.query(bigSql);
  }
}
