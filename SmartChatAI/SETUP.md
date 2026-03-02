# SmartChat AI - Setup Guide

## Quick Start (5 Minutes)

### 1. MongoDB Setup
If you don't have MongoDB installed:

**On macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**On Ubuntu:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**On Windows:**
- Download from https://www.mongodb.com/try/download/community
- Run installer and follow prompts

Or use **MongoDB Atlas** (cloud):
- Create account at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string

### 2. Start Backend Server

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend will run on http://localhost:5000

### 3. Start AI Service

```bash
cd ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

AI Service will run on http://localhost:5001

### 4. Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend will open at http://localhost:3000

### 5. Test the Application

1. Go to http://localhost:3000
2. Register a new account
3. Start chatting!
4. Login as admin to view analytics

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/smartchat-ai
JWT_SECRET=your_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
AI_SERVICE_URL=http://localhost:5001
BCRYPT_ROUNDS=10
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### AI Service (.env)
```
PORT=5001
FLASK_ENV=development
```

## Test Credentials

After setting up, you can:
1. Register new users through the UI
2. Use these test intents for the AI:
   - "Hello" → greeting
   - "How are you?" → how_are_you
   - "What's your name?" → what_is_your_name
   - "Tell me about Python" → education
   - "Thanks!" → thanks
   - "Goodbye" → goodbye

## Database Commands

### MongoDB Shell
```bash
# Connect to database
mongosh

# View databases
show databases

# Use smartchat database
use smartchat-ai

# View collections
show collections

# View users
db.users.find()

# View conversations
db.conversations.find()

# Count documents
db.users.countDocuments()
```

## Verification Checklist

- [ ] MongoDB running (check: mongosh connects)
- [ ] Backend starts without errors (check: /api/health returns 200)
- [ ] AI Service responds (check: hit /health endpoint on port 5001)
- [ ] Frontend loads (check: http://localhost:3000 opens)
- [ ] Can register user (check: email validation works)
- [ ] Can login (check: JWT token returned)
- [ ] Can send chat message (check: AI responds within 2 seconds)
- [ ] Can view analytics (check: admin panel shows stats)

## Common Issues & Solutions

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port in .env
PORT=5002
```

### Module Not Found
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Connection Refused
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Or start MongoDB
mongod
```

### Python venv Issues
```bash
# Create fresh venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Next Steps

1. **Customize Intents**: Edit `/ai-service/intents.json` to add more intents
2. **Train Model**: Run `python train.py` after updating intents
3. **Deploy**: Follow deployment guide for production
4. **Analytics**: Check admin panel for usage insights

## Support & Documentation

- See README.md for full documentation
- Check API endpoints in README
- Review architecture diagram for system overview

Happy chatting! 🚀
