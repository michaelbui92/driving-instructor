const fs = require('fs')
const path = require('path')

const dbPath = path.join(__dirname, '../local-db.json')

class MockSupabaseClient {
  constructor() {
    this.data = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  }

  from(table) {
    return {
      select: (columns = '*') => {
        return {
          order: (orderBy, options = {}) => {
            const { ascending = true } = options
            let items = [...this.data[table]]
            
            // Simple ordering by created_at
            if (orderBy === 'created_at') {
              items.sort((a, b) => {
                const dateA = new Date(a.created_at)
                const dateB = new Date(b.created_at)
                return ascending ? dateA - dateB : dateB - dateA
              })
            }
            
            return {
              then: (resolve) => {
                resolve({ data: items, error: null })
              }
            }
          },
          
          eq: (column, value) => {
            const filtered = this.data[table].filter(item => item[column] === value)
            return {
              order: () => ({
                then: (resolve) => {
                  resolve({ data: filtered, error: null })
                }
              })
            }
          },
          
          neq: (column, value) => {
            const filtered = this.data[table].filter(item => item[column] !== value)
            return {
              order: () => ({
                then: (resolve) => {
                  resolve({ data: filtered, error: null })
                }
              })
            }
          },
          
          then: (resolve) => {
            resolve({ data: this.data[table], error: null })
          }
        }
      },
      
      insert: (items) => {
        const newItems = items.map(item => ({
          id: 'mock-' + Date.now() + '-' + Math.random().toString(36).substring(7),
          ...item,
          created_at: new Date().toISOString()
        }))
        
        this.data[table].push(...newItems)
        fs.writeFileSync(dbPath, JSON.stringify(this.data, null, 2))
        
        return {
          select: () => ({
            then: (resolve) => {
              resolve({ data: newItems, error: null })
            }
          })
        }
      },
      
      update: (updates) => {
        return {
          eq: (column, value) => {
            const updated = this.data[table].map(item => {
              if (item[column] === value) {
                return { ...item, ...updates }
              }
              return item
            })
            
            this.data[table] = updated
            fs.writeFileSync(dbPath, JSON.stringify(this.data, null, 2))
            
            return {
              select: () => ({
                then: (resolve) => {
                  const changed = updated.filter(item => item[column] === value)
                  resolve({ data: changed, error: null })
                }
              })
            }
          }
        }
      }
    }
  }
}

// Test the mock
async function testMock() {
  const mockClient = new MockSupabaseClient()
  
  console.log('🧪 Testing mock Supabase client...')
  
  // Get all bookings
  const { data: allBookings } = await mockClient.from('bookings').select()
  console.log(`📊 ${allBookings.length} bookings in mock database`)
  
  // Create a new booking
  const newBooking = {
    student_name: 'Mock Student',
    email: 'mock@example.com',
    phone: '0411222333',
    date: '2026-04-05',
    time: '11:00:00',
    lesson_type: 'single',
    status: 'pending'
  }
  
  const { data: created } = await mockClient.from('bookings').insert([newBooking])
  console.log(`✅ Created booking: ${created[0].id}`)
  
  // Get updated list
  const { data: updatedBookings } = await mockClient.from('bookings').select()
  console.log(`📈 Now ${updatedBookings.length} bookings`)
  
  // Filter by status
  const { data: pendingBookings } = await mockClient.from('bookings').select().eq('status', 'pending')
  console.log(`⏳ ${pendingBookings.length} pending bookings`)
}

if (require.main === module) {
  testMock().catch(console.error)
}

module.exports = { MockSupabaseClient }