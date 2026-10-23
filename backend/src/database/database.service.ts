import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import pg from 'pg';
import type { PoolClient, QueryResult, QueryResultRow } from 'pg';
import { getDatabaseConfig } from '../config/database.config.js';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly pool: pg.Pool;
  private isConnected = false;

  constructor() {
    const config = getDatabaseConfig();
    this.pool = new pg.Pool({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      database: config.database,
      max: 10,
      connectionTimeoutMillis: 5000,
    });
    this.pool.on('error', (error: Error) => {
      this.isConnected = false;
      this.logger.error('Unexpected PostgreSQL pool error', error.stack);
    });
  }

  async onModuleInit() {
    const config = getDatabaseConfig();
    this.logger.log(
      `Connecting to PostgreSQL database at ${config.host}:${config.port}/${config.database}...`,
    );
    await this.pool.query('SELECT 1');
    await this.pool.query('SELECT id FROM users LIMIT 0');
    this.isConnected = true;
    this.logger.log('PostgreSQL connection established.');
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.isConnected = false;
  }

  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    values: (string | number | boolean | null)[] = [],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, values);
  }

  async withTransaction<T>(
    operation: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await operation(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        this.logger.error(
          'PostgreSQL transaction rollback failed',
          rollbackError,
        );
      }
      throw error;
    } finally {
      client.release();
    }
  }

  isDbConnected(): boolean {
    return this.isConnected;
  }
}
