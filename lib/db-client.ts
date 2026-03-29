/**
 * Database client factory
 * Returns SQLite client for local development, Supabase for production
 */

import { getSQLiteClient, SQLiteClient, initDatabase, Booking as SQLiteBooking } from './sqlite';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Booking } from './supabase';

// Type for the unified client interface
export type DBClient = {
  from(table: string): {
    select(columns?: string): any;
    insert(items: any[]): any;
    update(updates: any): any;
    delete(): any;
  };
};

/**
 * Check if we should use SQLite (local development)
 */
export function isLocalDev(): boolean {
  // Check for local development markers
  const isDev = process.env.NODE_ENV === 'development';
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Use SQLite if:
  // 1. In development mode AND either no Supabase URL or no service role key
  // 2. Explicitly set to use local DB
  if (process.env.USE_LOCAL_DB === 'true') return true;
  if (isDev && (!hasSupabaseUrl || !hasServiceRole)) return true;
  
  return false;
}

/**
 * Get the appropriate database client
 */
export function getDBClient(): DBClient {
  if (isLocalDev()) {
    console.log('📦 Using SQLite database (local development)');
    return getSQLiteClient();
  }
  
  // Return Supabase client wrapper
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  return {
    from: (table: string) => supabase.from(table)
  };
}

/**
 * Initialize the database (call this at app startup)
 */
export function initializeDatabase(): void {
  if (isLocalDev()) {
    initDatabase();
  }
}

// Re-export types
export type { Booking, SQLiteBooking };
