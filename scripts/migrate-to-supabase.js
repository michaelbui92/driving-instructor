#!/usr/bin/env node

/**
 * Migration script to move data from localStorage to Supabase
 * Run this after setting up Supabase tables
 */

const { supabase } = require('../lib/supabase')

async function migrateBookings() {
  console.log('Starting migration of bookings from localStorage to Supabase...')
  
  try {
    // In a real scenario, we would read from localStorage
    // For now, we'll demonstrate the migration pattern
    const localStorageBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
    
    console.log(`Found ${localStorageBookings.length} bookings to migrate`)
    
    for (const booking of localStorageBookings) {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          student_name: booking.studentName || booking.name,
          email: booking.email,
          phone: booking.phone,
          date: booking.date,
          time: booking.time,
          lesson_type: booking.lessonType,
          status: booking.status || 'confirmed',
          created_at: booking.createdAt || new Date().toISOString()
        })
        
      if (error) {
        console.error(`Error migrating booking ${booking.id}:`, error)
      } else {
        console.log(`Migrated booking ${booking.id}`)
      }
    }
    
    console.log('Booking migration complete!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

async function migrateAvailabilityRules() {
  console.log('Migrating availability rules...')
  
  try {
    // Get rules from localStorage or default structure
    const rules = JSON.parse(localStorage.getItem('instructor_availability_rules') || '[]')
    
    if (rules.length === 0) {
      console.log('No custom rules found, using default schedule...')
      
      // Insert default rules based on the JSON structure
      const defaultRules = [
        // Weekdays
        { type: 'weekly', day_type: 'monday', start_time: '09:00', end_time: '17:00', priority: 1 },
        { type: 'weekly', day_type: 'tuesday', start_time: '09:00', end_time: '17:00', priority: 1 },
        { type: 'weekly', day_type: 'wednesday', start_time: '09:00', end_time: '17:00', priority: 1 },
        { type: 'weekly', day_type: 'thursday', start_time: '09:00', end_time: '17:00', priority: 1 },
        { type: 'weekly', day_type: 'friday', start_time: '09:00', end_time: '17:00', priority: 1 },
        // Saturday
        { type: 'weekly', day_type: 'saturday', start_time: '09:00', end_time: '15:00', priority: 1 },
      ]
      
      for (const rule of defaultRules) {
        const { error } = await supabase
          .from('availability_rules')
          .insert(rule)
          
        if (error) {
          console.error(`Error inserting rule for ${rule.day_type}:`, error)
        }
      }
    }
    
    console.log('Availability rules migration complete!')
  } catch (error) {
    console.error('Availability rules migration failed:', error)
  }
}

async function main() {
  console.log('=== Supabase Migration Script ===')
  
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('ERROR: Supabase environment variables not set!')
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
    process.exit(1)
  }
  
  await migrateAvailabilityRules()
  await migrateBookings()
  
  console.log('=== Migration Complete ===')
  console.log('Note: This script assumes tables have been created in Supabase.')
  console.log('Run the SQL from create-tables.sql in your Supabase dashboard first.')
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { migrateBookings, migrateAvailabilityRules }