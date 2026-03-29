/**
 * SQLite adapter that mimics Supabase client API
 * Used for local development to avoid Supabase dependency
 */

import Database from 'better-sqlite3';
import path from 'path';

// Database file location
const DB_PATH = path.join(process.cwd(), 'local-sqlite.db');

let db: Database.Database | null = null;

/**
 * Initialize the SQLite database with required tables
 */
export function initDatabase(): Database.Database {
  if (db) return db;
  
  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  
  // Create bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      student_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      lesson_type TEXT DEFAULT 'single',
      status TEXT DEFAULT 'pending',
      notes TEXT,
      pickup_address TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  
  console.log('✅ SQLite database initialized at:', DB_PATH);
  return db;
}

/**
 * Get database instance (lazy initialization)
 */
export function getDatabase(): Database.Database {
  if (!db) {
    return initDatabase();
  }
  return db;
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * SQLite client that mimics Supabase client API
 */
export class SQLiteClient {
  private db: Database.Database;
  
  constructor() {
    this.db = getDatabase();
  }
  
  from(table: string) {
    const self = this;
    
    return {
      /**
       * Select columns from table
       */
      select: (columns: string = '*') => {
        return {
          /**
           * Order results by a column
           */
          order: (column: string, options: { ascending?: boolean } = {}) => {
            const { ascending = true } = options;
            const direction = ascending ? 'ASC' : 'DESC';
            
            return {
              /**
               * Filter by column equals value
               */
              eq: (col: string, value: any) => {
                const stmt = self.db.prepare(`SELECT ${columns} FROM ${table} WHERE ${col} = ? ORDER BY ${column} ${direction}`);
                const rows = stmt.all(value);
                
                return {
                  then: (resolve: Function) => resolve({ data: rows, error: null }),
                  data: rows
                };
              },
              
              /**
               * Filter by column not equals value
               */
              neq: (col: string, value: any) => {
                const stmt = self.db.prepare(`SELECT ${columns} FROM ${table} WHERE ${col} != ? ORDER BY ${column} ${direction}`);
                const rows = stmt.all(value);
                
                return {
                  then: (resolve: Function) => resolve({ data: rows, error: null }),
                  data: rows
                };
              },
              
              /**
               * Filter by multiple conditions using .or() style
               */
              or: (filter: string) => {
                // Parse simple OR conditions like "status.eq.pending,date.eq.2026-04-01"
                const conditions = filter.split(',').map((f: string) => {
                  const [col, op, val] = f.split('.');
                  return `${col} ${op === 'eq' ? '=' : op} '${val}'`;
                }).join(' OR ');
                
                const stmt = self.db.prepare(`SELECT ${columns} FROM ${table} WHERE ${conditions} ORDER BY ${column} ${direction}`);
                const rows = stmt.all();
                
                return {
                  then: (resolve: Function) => resolve({ data: rows, error: null }),
                  data: rows
                };
              },
              
              then: (resolve: Function) => {
                const stmt = self.db.prepare(`SELECT ${columns} FROM ${table} ORDER BY ${column} ${direction}`);
                const rows = stmt.all();
                resolve({ data: rows, error: null });
              }
            };
          },
          
          /**
           * Filter by column equals value (without order)
           */
          eq: (col: string, value: any) => {
            const stmt = self.db.prepare(`SELECT ${columns} FROM ${table} WHERE ${col} = ?`);
            const rows = stmt.all(value);
            
            return {
              order: (orderCol: string, options: { ascending?: boolean } = {}) => {
                const { ascending = true } = options;
                const direction = ascending ? 'ASC' : 'DESC';
                const orderedStmt = self.db.prepare(`SELECT ${columns} FROM ${table} WHERE ${col} = ? ORDER BY ${orderCol} ${direction}`);
                const orderedRows = orderedStmt.all(value);
                return {
                  then: (resolve: Function) => resolve({ data: orderedRows, error: null }),
                  data: orderedRows
                };
              },
              then: (resolve: Function) => resolve({ data: rows, error: null }),
              data: rows
            };
          },
          
          then: (resolve: Function) => {
            const stmt = self.db.prepare(`SELECT ${columns} FROM ${table}`);
            const rows = stmt.all();
            resolve({ data: rows, error: null });
          }
        };
      },
      
      /**
       * Insert one or more rows
       */
      insert: (items: any[]) => {
        const now = new Date().toISOString();
        const insertedIds: string[] = [];
        
        const insertMany = self.db.transaction((rows: any[]) => {
          for (const item of rows) {
            const id = item.id || generateId();
            insertedIds.push(id);
            
            const columns = ['id', ...Object.keys(item), 'created_at', 'updated_at'];
            const placeholders = columns.map(() => '?').join(', ');
            const values = [id, ...Object.values(item), now, now];
            
            const stmt = self.db.prepare(
              `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`
            );
            stmt.run(...values);
          }
        });
        
        insertMany(items);
        
        return {
          /**
           * Return the inserted rows
           */
          select: () => {
            const placeholders = insertedIds.map(() => '?').join(', ');
            const stmt = self.db.prepare(`SELECT * FROM ${table} WHERE id IN (${placeholders})`);
            const rows = stmt.all(...insertedIds);
            
            return {
              then: (resolve: Function) => resolve({ data: rows, error: null }),
              data: rows
            };
          },
          
          then: (resolve: Function) => {
            const placeholders = insertedIds.map(() => '?').join(', ');
            const stmt = self.db.prepare(`SELECT * FROM ${table} WHERE id IN (${placeholders})`);
            const rows = stmt.all(...insertedIds);
            resolve({ data: rows, error: null });
          }
        };
      },
      
      /**
       * Update rows matching condition
       */
      update: (updates: any) => {
        return {
          /**
           * Filter by column equals value
           */
          eq: (col: string, value: any) => {
            const now = new Date().toISOString();
            const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(updates), now, value];
            
            const stmt = self.db.prepare(
              `UPDATE ${table} SET ${setClauses}, updated_at = ? WHERE ${col} = ?`
            );
            stmt.run(...values);
            
            // Return updated rows
            const selectStmt = self.db.prepare(`SELECT * FROM ${table} WHERE ${col} = ?`);
            const rows = selectStmt.all(value);
            
            return {
              select: () => ({
                then: (resolve: Function) => resolve({ data: rows, error: null }),
                data: rows
              }),
              then: (resolve: Function) => resolve({ data: rows, error: null }),
              data: rows
            };
          }
        };
      },
      
      /**
       * Delete rows matching condition
       */
      delete: () => {
        return {
          eq: (col: string, value: any) => {
            const stmt = self.db.prepare(`DELETE FROM ${table} WHERE ${col} = ?`);
            stmt.run(value);
            
            return {
              then: (resolve: Function) => resolve({ data: null, error: null }),
              data: null
            };
          }
        };
      }
    };
  }
}

// Singleton instance
let sqliteClient: SQLiteClient | null = null;

export function getSQLiteClient(): SQLiteClient {
  if (!sqliteClient) {
    sqliteClient = new SQLiteClient();
  }
  return sqliteClient;
}

// Export types
export type Booking = {
  id: string;
  student_name: string;
  email?: string;
  phone?: string;
  date: string;
  time: string;
  lesson_type: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  pickup_address?: string;
  created_at: string;
  updated_at: string;
};
