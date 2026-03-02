# SmartChat AI - Quick Reference

## Project Structure
```
SmartChatAI/
├── frontend/          → React.js UI
├── backend/           → Node.js REST API  
├── ai-service/        → Python NLP Service
├── README.md          → Full documentation
├── SETUP.md           → Quick setup guide
├── DEPLOYMENT.md      → Deployment options
├── TESTING.md         → Testing strategies
├── AI_MODEL_DOCUMENTATION.md → ML details
├── INTERVIEW_GUIDE.md → For interviews
└── docker-compose.yml → Docker setup
```

## Quick Commands

### Backend
```bash
cd backend
npm install
npm run dev           # Start with auto-reload
npm test              # Run tests
```

### Frontend
```bash
cd frontend
npm install
npm start             # For development
npm run build         # Production build
```

### AI Service
```bash
cd ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python train.py       # Train model (first time)
python app.py         # Start service
```

### MongoDB
```bash
# Local (if installed)
mongod
mongosh               # Connect

# Or use MongoDB Atlas (cloud)
```

## API Endpoints (Quick Reference)

### auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user info

### chat
- `POST /api/chat/conversations` - Create chat
- `GET /api/chat/conversations` - List chats  
- `POST /api/chat/messages` - Send message
- `DELETE /api/chat/conversations/:id` - Delete chat

### admin
- `GET /api/admin/users` - All users
- `DELETE /api/admin/users/:id` - Remove user
- `GET /api/admin/analytics` - System stats

## Environment Variables

### backend/.env
```
MONGODB_URI=mongodb://localhost:27017/smartchat-ai
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
AI_SERVICE_URL=http://localhost:5001
```

### ai-service/.env
```
PORT=5001
FLASK_ENV=development
```

## Default Test Account

```
Email: admin@example.com
Password: admin123
Role: admin
```

(Create first via registration page)

## File Locations - Important

| What | Where |
|------|-------|
| Backend routes | `backend/routes/` |
| Database models | `backend/models/` |
| Auth logic | `backend/controllers/authController.js` |
| Chat logic | `backend/controllers/chatController.js` |
| Intents | `ai-service/intents.json` |
| React pages | `frontend/src/pages/` |
| React components | `frontend/src/components/` |

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in .env or kill process |
| MongoDB not found | mongod not running; start it |
| AI service errors | python/pip issue; recreate venv |
| CORS errors | Check FRONTEND_URL in backend .env |
| Module not found | npm install in that directory |
| JWT errors | Check JWT_SECRET matches |

## Database Collections

```javascript
// Users
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string (hashed),
  role: "user" | "admin",
  createdAt: Date
}

// Conversations
{
  _id: ObjectId,
  userId: ObjectId,
  title: string,
  messages: [{
    sender: "user" | "bot",
    text: string,
    timestamp: Date,
    intent: string
  }],
  createdAt: Date
}

// Analytics
{
  _id: ObjectId,
  totalUsers: number,
  totalMessages: number,
  intentsFrequency: {intent: count},
  updatedAt: Date
}
```

## Deployment Checklist

- [ ] Set prod environment variables
- [ ] Configure MongoDB Atlas
- [ ] Build frontend: `npm run build`
- [ ] Push Docker images
- [ ] Test in staging env
- [ ] Configure domain/SSL
- [ ] Set up monitoring
- [ ] Enable backups
- [ ] Document deployment process

## Interview Key Points

✅ Full-stack implementation (not mock)
✅ Real ML/NLP (TF-IDF + Logistic Regression)
✅ Microservices architecture
✅ Security (JWT, bcrypt, RBAC)
✅ Scalability considerations
✅ Production-ready code
✅ Comprehensive documentation
✅ Multiple deployment options

## Most Impactful Parts to Discuss

1. **Why microservices?** → Independent scaling, tech flexibility
2. **NLP approach?** → Practical vs theoretical
3. **Database design?** → Thought about normalization, indexing
4. **Security?** → Real password hashing, JWT, role-based access
5. **Scalability?** → Considered 1000+ users, load balancing
6. **Challenges?** → How you overcame real problems

## Performance Targets

| Metric | Target |
|--------|--------|
| Page load | < 3s |
| Message response | < 2s |
| AI inference | < 100ms |
| Database query | < 50ms |
| Concurrent users | 1000+ |

## URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- AI Service: http://localhost:5001
- MongoDB: localhost:27017

## Most Important Commands

```bash
# Start everything locally
docker-compose up -d

# Or start individually
cd backend && npm run dev
cd frontend && npm start
cd ai-service && python app.py

# View logs
docker-compose logs -f [service_name]

# Stop everything
docker-compose down
```

## Code Quality Highlights

✅ Modular code (separation of concerns)
✅ Error handling on all endpoints
✅ Input validation on all routes
✅ Secure password hashing
✅ JWT for stateless auth
✅ Protected routes with middleware
✅ Clean React components
✅ Reusable utility functions
✅ Comprehensive comments
✅ .env for configuration

## Next Steps for You

1. Setup locally with SETUP.md
2. Explore code in each directory
3. Read README.md for full understanding
4. Study INTERVIEW_GUIDE.md before interviews
5. Run tests to verify everything works
6. Practice explaining architecture clearly

---

**You're ready! Go build amazing things! 🚀**
