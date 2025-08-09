# MongoDB Setup Guide

This guide will help you set up MongoDB for your KhelmelaWeb application.

## Option 1: MongoDB Atlas (Recommended for Production)

### 1. Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project
4. Build a new cluster (free tier is sufficient for development)

### 2. Configure Database Access

1. In your Atlas dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Create a username and password (save these securely)
4. Set privileges to "Read and write to any database"
5. Click "Add User"

### 3. Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. For development, you can add "0.0.0.0/0" to allow access from anywhere
4. For production, add only your server's IP address

### 4. Get Your Connection String

1. Go to "Database" in your cluster
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<dbname>` with your actual values

### 5. Set Up Environment Variables

1. Copy `env.example` to `.env`
2. Update the `MONGODB_URI` with your Atlas connection string:

```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/khelmela?retryWrites=true&w=majority
```

## Option 2: Local MongoDB

### 1. Install MongoDB Community Edition

#### Windows:
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a service

#### macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mongodb
```

### 2. Start MongoDB Service

#### Windows:
MongoDB should start automatically as a service.

#### macOS:
```bash
brew services start mongodb-community
```

#### Ubuntu/Debian:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Set Up Environment Variables

1. Copy `env.example` to `.env`
2. Use the local MongoDB URI:

```env
MONGODB_URI=mongodb://localhost:27017/khelmela
```

## Database Setup

### 1. Install Dependencies

Make sure you have the MongoDB dependencies installed:

```bash
npm install mongodb mongoose dotenv
```

### 2. Seed the Database

Run the seeding script to populate your database with initial data:

```bash
npm run db:seed
```

This will create:
- Sample tournaments
- Sample teams
- Sample statistics
- Sample contact messages

### 3. Start the Application

```bash
npm run dev
```

## Switching Between Storage Types

The application supports both MongoDB and in-memory storage. To switch:

### Use MongoDB (Production):
```typescript
// In server/storage.ts
export const storage = new MongoDBStorage();
```

### Use In-Memory Storage (Development/Testing):
```typescript
// In server/storage.ts
export const storage = new MemStorage();
```

## Troubleshooting

### Connection Issues

1. **Check your connection string**: Make sure username, password, and cluster name are correct
2. **Network access**: Ensure your IP is whitelisted in MongoDB Atlas
3. **Database user**: Verify the database user has proper permissions

### Common Errors

1. **"MongoServerSelectionError"**: Check your internet connection and MongoDB Atlas status
2. **"Authentication failed"**: Verify username and password in connection string
3. **"ECONNREFUSED"**: Make sure MongoDB service is running (for local installations)

### Environment Variables

Make sure your `.env` file is in the root directory and contains:

```env
MONGODB_URI=your_connection_string_here
NODE_ENV=development
```

## Production Considerations

1. **Use MongoDB Atlas**: More reliable and managed
2. **Set up proper indexes**: For better query performance
3. **Configure backups**: Enable automatic backups in Atlas
4. **Monitor performance**: Use Atlas monitoring tools
5. **Secure connection**: Use SSL/TLS for production connections

## Database Schema

The application uses the following collections:

- **users**: User accounts and authentication
- **tournaments**: Tournament information and details
- **teams**: Team information linked to tournaments
- **stats**: Application statistics
- **contactmessages**: Contact form submissions

All collections include automatic timestamps (`createdAt`, `updatedAt`) and use MongoDB's ObjectId as the primary key. 