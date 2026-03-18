const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Handle API routes (mock for now)
      if (pathname.startsWith('/api/')) {
        res.setHeader('Content-Type', 'application/json');
        
        if (pathname === '/api/availability') {
          // Return available slots
          const data = {
            weekdays: {
              monday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
              tuesday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
              wednesday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
              thursday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
              friday: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
            },
            weekends: {
              saturday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
              sunday: []
            }
          };
          res.end(JSON.stringify(data));
          return;
        }
        
        if (pathname === '/api/bookings' && req.method === 'POST') {
          // Create booking (mock implementation)
          const body = [];
          req.on('data', chunk => body.push(chunk));
          req.on('end', () => {
            const bookingData = JSON.parse(Buffer.concat(body).toString());
            // Here you would save to your JSON file
            res.end(JSON.stringify({ 
              success: true, 
              bookingId: `DRIVE-${Date.now()}`,
              message: 'Booking confirmed! We\'ll contact you within 24 hours.'
            }));
          });
          return;
        }
      }

      // Let Next.js handle all other routes
      await handle(req, res);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});