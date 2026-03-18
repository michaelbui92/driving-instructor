import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data');

export function readData(filename) {
  const fullPath = path.join(dataPath, filename);
  try {
    const fileContent = readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

export function writeData(filename, data) {
  const fullPath = path.join(dataPath, filename);
  try {
    writeFileSync(fullPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getAvailableSlots(date) {
  const data = readData('students.json');
  if (!data) return [];
  
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const { availability } = data;
  
  // Get slots for the day
  let daySlots = [];
  const dayLower = dayName.toLowerCase();
  
  if (availability.weekdays[dayLower]) {
    daySlots = availability.weekdays[dayLower].enabled ? 
      availability.weekdays[dayLower].slots : [];
  } else if (availability.weekends[dayLower]) {
    daySlots = availability.weekends[dayLower].enabled ? 
      availability.weekends[dayLower].slots : [];
  }
  
  // Filter out already booked slots
  const dateString = date.toISOString().split('T')[0];
  const bookedSlots = data.bookings
    .filter(booking => booking.date === dateString && booking.status === 'booked')
    .map(booking => booking.time);
  
  return daySlots.filter(slot => !bookedSlots.includes(slot));
}

export function createBooking(bookingData) {
  const data = readData('students.json');
  if (!data) return null;
  
  const booking = {
    id: generateId(),
    ...bookingData,
    status: 'booked',
    createdAt: new Date().toISOString()
  };
  
  data.bookings.push(booking);
  writeData('students.json', data);
  
  return booking;
}

export function getStudentBookings(studentId) {
  const data = readData('students.json');
  if (!data) return [];
  
  return data.bookings.filter(booking => booking.studentId === studentId);
}