import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import authVerificationRoutes from './routes/authVerification';
import studentProfileRoutes from './routes/studentProfile';
import collegeRoutes from './routes/colleges';
import canteenRoutes from './routes/canteens';
import menuRoutes from './routes/menus';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payments';
import kdsRoutes from './routes/kds';
import inventoryRoutes from './routes/inventory';
import couponRoutes from './routes/coupons';
import reviewRoutes from './routes/reviews';
import adminRoutes from './routes/admin';
import aiRoutes from './routes/ai';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO Server
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

app.use(cors());

// Capture raw body for Razorpay Webhook signature verification
app.use(
  express.json({
    verify: (req: Request, res: Response, buf: Buffer) => {
      (req as any).rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// API v1 Router registrations
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auth', authVerificationRoutes);
app.use('/api/v1/verification', authVerificationRoutes);
app.use('/api/v1/memberships', authVerificationRoutes);
app.use('/api/v1/profile', studentProfileRoutes);
app.use('/api/v1', collegeRoutes);
app.use('/api/v1/canteens', canteenRoutes);
app.use('/api/v1/menus', menuRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/kds', kdsRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);

// Health check endpoints
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'CampusBite Production API & Real-Time Socket Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    razorpayMode: 'READY_STANDARD_CHECKOUT',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Socket.IO Room Joining and Real-Time Event Handlers
io.on('connection', (socket) => {
  console.log('⚡ Client connected to Socket.IO:', socket.id);

  socket.on('join_canteen', (canteenId: string) => {
    socket.join(`canteen_${canteenId}`);
    console.log(`Socket ${socket.id} joined room canteen_${canteenId}`);
  });

  socket.on('join_order', (orderId: string) => {
    socket.join(`order_${orderId}`);
    console.log(`Socket ${socket.id} joined room order_${orderId}`);
  });

  socket.on('join_kds', (canteenId: string) => {
    socket.join(`kds_${canteenId}`);
    console.log(`Socket ${socket.id} joined room kds_${canteenId}`);
  });

  socket.on('disconnect', () => {
    console.log('⚡ Socket disconnected:', socket.id);
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 CampusBite Production Express API & Socket.IO running on http://localhost:${PORT}`);
});

export { app, server, io };
