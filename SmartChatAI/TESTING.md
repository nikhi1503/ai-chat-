# Testing Guide

## Unit Testing

### Backend Tests

Create `backend/tests/auth.test.js`:
```javascript
const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Authentication API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@test.com',
          password: 'password123',
          confirmPassword: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
    });

    it('should not register with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John',
          email: 'invalid-email',
          password: 'password123',
          confirmPassword: 'password123',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'John Doe',
        email: 'john@test.com',
        password: 'password123',
      });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@test.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('should not login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@test.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
    });
  });
});
```

### Run Backend Tests
```bash
cd backend
npm install --save-dev jest supertest
npm test
```

### AI Service Tests

Create `ai-service/test_model.py`:
```python
import unittest
from train import ChatbotModel

class TestChatbotModel(unittest.TestCase):
    def setUp(self):
        self.model = ChatbotModel()
        self.model.train('intents.json')

    def test_greeting_intent(self):
        result = self.model.predict("Hello!")
        self.assertEqual(result['intent'], 'greeting')
        self.assertGreater(result['confidence'], 0.3)

    def test_education_intent(self):
        result = self.model.predict("Tell me about Python")
        self.assertEqual(result['intent'], 'education')

    def test_unknown_intent(self):
        result = self.model.predict("xyz abc 123 unknown")
        self.assertLess(result['confidence'], 0.5)

if __name__ == '__main__':
    unittest.main()
```

### Run AI Tests
```bash
cd ai-service
python -m pytest test_model.py -v
```

## Integration Testing

### API Integration Tests

```javascript
// backend/tests/integration.test.js
describe('Chat API Integration', () => {
  let userId;
  let token;
  let conversationId;

  beforeAll(async () => {
    // Register and login
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

    token = registerRes.body.token;
    userId = registerRes.body.user.id;
  });

  it('should create a conversation', async () => {
    const res = await request(app)
      .post('/api/chat/conversations')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Chat' });

    expect(res.status).toBe(201);
    conversationId = res.body._id;
  });

  it('should send message and get response', async () => {
    const res = await request(app)
      .post('/api/chat/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({
        conversationId,
        message: 'Hello!',
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
    expect(res.body.intent).toBeDefined();
  });

  it('should get conversation history', async () => {
    const res = await request(app)
      .get(`/api/chat/conversations/${conversationId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.messages.length).toBeGreaterThan(0);
  });
});
```

## E2E (End-to-End) Testing

### Using Cypress

Create `frontend/cypress/e2e/auth.cy.js`:
```javascript
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should register new user', () => {
    cy.contains('Register').click();
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/chat');
  });

  it('should login user', () => {
    cy.contains('Login').click();
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/chat');
  });
});
```

### Chat Flow E2E Test

```javascript
describe('Chat Flow', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
    cy.visit('http://localhost:3000/chat');
  });

  it('should send message and receive response', () => {
    cy.get('input[placeholder="Type your message..."]').type('Hello!');
    cy.get('button:contains("Send")').click();

    cy.contains('Hello!').should('exist');
    cy.get('.text-gray-200', { timeout: 10000 }).should('exist');
  });

  it('should create new conversation', () => {
    cy.contains('New Chat').click();
    cy.get('input[placeholder="Type your message..."]').type('Test');
    cy.get('button:contains("Send")').click();
    cy.contains('Test').should('exist');
  });
});
```

### Run Cypress Tests
```bash
cd frontend
npm install --save-dev cypress
npx cypress open
# Or run headless
npx cypress run
```

## Load Testing

### Using Artillery

Create `load-test.yml`:
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: 'Chat Flow'
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'test@test.com'
            password: 'password123'
          capture:
            json: '$.token'
            as: 'authToken'
      - post:
          url: '/api/chat/conversations'
          headers:
            Authorization: 'Bearer {{ authToken }}'
          json:
            title: 'Load Test Chat'
          capture:
            json: '$._id'
            as: 'convId'
      - post:
          url: '/api/chat/messages'
          headers:
            Authorization: 'Bearer {{ authToken }}'
          json:
            conversationId: '{{ convId }}'
            message: 'Hello from load test'
```

### Run Load Test
```bash
npm install --save-dev artillery
artillery run load-test.yml
```

## Manual Testing Checklist

### User Flow
- [ ] Register new account
- [ ] Login with credentials
- [ ] View dashboard
- [ ] Create new conversation
- [ ] Send message and receive response
- [ ] View conversation history
- [ ] Delete conversation
- [ ] Logout

### Admin Flow
- [ ] Login as admin
- [ ] Access admin panel
- [ ] View all users
- [ ] View analytics
- [ ] View user statistics
- [ ] Delete user account

### Edge Cases
- [ ] Empty message submission
- [ ] Very long message (5000+ characters)
- [ ] Special characters in message
- [ ] Rapid message sending
- [ ] Network disconnection and reconnection
- [ ] Expired JWT token
- [ ] Invalid conversation ID

### Browser Compatibility
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest
- [ ] Mobile browsers

### Performance
- [ ] Page load < 3 seconds
- [ ] Message response < 2 seconds
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] No console errors

## API Testing with Postman

1. **Import Collection** from `SmartChatAI.postman_collection.json`
2. **Set Variables**:
   - `base_url`: http://localhost:5000/api
   - `token`: (from login response)
   - `user_id`: (from profile response)

3. **Test Endpoints**:
```
POST /auth/register
POST /auth/login
GET  /auth/profile
POST /chat/conversations
GET  /chat/conversations
POST /chat/messages
DELETE /chat/conversations/:id
GET  /admin/users
GET  /admin/analytics
```

## Continuous Testing

### Pre-commit Hooks
Add to `.git/hooks/pre-commit`:
```bash
#!/bin/bash
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

## Test Coverage

### Generate Coverage Report
```bash
# Backend
npm test -- --coverage

# AI Service
python -m coverage run -m pytest
python -m coverage report
python -m coverage html  # View in htmlcov/index.html
```

### Target Coverage
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

## Debugging

### Backend Debugging
```bash
# With inspector
node --inspect server.js

# Or with VS Code debugger
```

### Frontend Debugging
- Use React DevTools
- Use Redux DevTools
- Use Network tab in DevTools
- Console for logs

### AI Service Debugging
```python
import pdb; pdb.set_trace()
# Or use debugger in IDE
```

---

**Last Updated**: March 2026
