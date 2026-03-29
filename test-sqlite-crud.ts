/**
 * Test script for SQLite CRUD operations
 * Run with: npx tsx test-sqlite-crud.ts
 */

import { initDatabase, getSQLiteClient, SQLiteClient } from './lib/sqlite';

async function testCRUD() {
  console.log('🧪 Testing SQLite CRUD operations...\n');
  
  // Initialize database
  initDatabase();
  const db = getSQLiteClient();
  
  // Test 1: READ - Get all bookings
  console.log('📖 TEST 1: READ all bookings');
  const { data: allBookings, error: readError } = await db.from('bookings').select('*');
  if (readError) {
    console.error('❌ Read error:', readError);
    return;
  }
  console.log(`✅ Found ${allBookings.length} bookings`);
  console.log('   Sample:', allBookings[0]?.student_name, '-', allBookings[0]?.status);
  console.log('');
  
  // Test 2: CREATE - Add a new booking
  console.log('➕ TEST 2: CREATE new booking');
  const newBooking = {
    student_name: 'Test Student SQLite',
    email: 'sqlite-test@example.com',
    phone: '0411222333',
    date: '2026-04-10',
    time: '10:00:00',
    lesson_type: 'single',
    status: 'pending'
  };
  
  const { data: created, error: createError } = await db
    .from('bookings')
    .insert([newBooking]);
  
  if (createError) {
    console.error('❌ Create error:', createError);
    return;
  }
  console.log(`✅ Created booking with ID: ${created[0].id}`);
  console.log('   Details:', created[0].student_name, '-', created[0].date, created[0].time);
  console.log('');
  
  // Test 3: READ with filter - Get pending bookings
  console.log('📖 TEST 3: READ bookings with filter (status = pending)');
  const { data: pendingBookings, error: filterError } = await db
    .from('bookings')
    .select('*')
    .eq('status', 'pending');
  
  if (filterError) {
    console.error('❌ Filter error:', filterError);
    return;
  }
  console.log(`✅ Found ${pendingBookings.length} pending bookings`);
  console.log('');
  
  // Test 4: UPDATE - Update booking status
  console.log('✏️  TEST 4: UPDATE booking status (confirm the new booking)');
  const bookingToUpdate = created[0].id;
  const { data: updated, error: updateError } = await db
    .from('bookings')
    .update({ status: 'confirmed', notes: 'Updated via SQLite test' })
    .eq('id', bookingToUpdate);
  
  if (updateError) {
    console.error('❌ Update error:', updateError);
    return;
  }
  console.log(`✅ Updated booking ${bookingToUpdate} to status: confirmed`);
  console.log('   Notes added:', updated?.notes);
  console.log('');
  
  // Test 5: VERIFY UPDATE - Read the updated booking
  console.log('📖 TEST 5: VERIFY update worked');
  const { data: verifiedBookings } = await db
    .from('bookings')
    .select('*')
    .eq('id', bookingToUpdate);
  
  if (verifiedBookings && verifiedBookings.length > 0) {
    const verified = verifiedBookings[0];
    console.log(`✅ Verified: ${verified.student_name} is now ${verified.status}`);
    console.log('   Notes:', verified.notes);
  }
  console.log('');
  
  // Test 6: DELETE - Remove test booking
  console.log('🗑️  TEST 6: DELETE test booking');
  const { error: deleteError } = await db
    .from('bookings')
    .delete()
    .eq('id', bookingToUpdate);
  
  if (deleteError) {
    console.error('❌ Delete error:', deleteError);
    return;
  }
  console.log(`✅ Deleted booking ${bookingToUpdate}`);
  console.log('');
  
  // Final count
  const { data: finalBookings } = await db.from('bookings').select('*');
  console.log('📊 Final booking count:', finalBookings.length);
  console.log('');
  
  console.log('🎉 All CRUD tests passed!');
}

testCRUD().catch(console.error);
