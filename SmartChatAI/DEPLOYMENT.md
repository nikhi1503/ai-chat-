# Deployment Guide

## Local Development Deployment

### Using npm scripts

1. **Backend**
```bash
cd backend
npm install
npm run dev  # Starts with nodemon for auto-reload
```

2. **Frontend**
```bash
cd frontend
npm install
npm start  # Starts on http://localhost:3000
```

3. **AI Service**
```bash
cd ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py  # Starts on http://localhost:5001
```

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose installed

### Quick Start with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# Check services status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application at `http://localhost`

## Production Deployment

### Platform: Heroku

#### Deploy Backend
1. Create Heroku account and install CLI
2. Login: `heroku login`
3. Create app: `heroku create smartchat-backend`
4. Add MongoDB Atlas: 
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_secret
   ```
5. Deploy: `git push heroku main`

#### Deploy AI Service
1. Create another Heroku app: `heroku create smartchat-ai`
2. Deploy: `git push heroku main`

#### Deploy Frontend
1. Build: `npm run build`
2. Deploy to Vercel or Netlify
3. Set env: `REACT_APP_API_URL=https://smartchat-backend.herokuapp.com/api`

### Platform: AWS

#### Using ECS (Elastic Container Service)
1. Push Docker images to ECR (Elastic Container Registry)
2. Create ECS cluster
3. Create task definitions
4. Create services for each service
5. Configure load balancer (ALB)
6. Set environment variables in Parameter Store

#### Using Elastic Beanstalk
1. Deploy backend: `eb deploy`
2. Set environment variables in EB console
3. Configure RDS for MongoDB (or use Atlas)

### Platform: DigitalOcean

#### Using App Platform
1. Connect GitHub repository
2. Create new app:
   - Set root directory (e.g., `backend`)
   - Set build and run commands
   - Add environment variables
3. Deploy

#### Using App Spec
```yaml
name: smartchat-ai
services:
- name: backend
  github:
    repo: your-repo
    branch: main
  build_command: npm install
  run_command: npm start
  environment_slug: node-js
  source_dir: backend
  envs:
  - key: MONGODB_URI
    value: ${DB_CONNECTION_STRING}

- name: ai-service
  github:
    repo: your-repo
  source_dir: ai-service
  build_command: pip install -r requirements.txt
  run_command: python app.py
  environment_slug: python
```

### Platform: Google Cloud Run

#### Deploy Backend
```bash
# Build image
docker build -t smartchat-backend:latest ./backend

# Tag for GCR
docker tag smartchat-backend:latest gcr.io/PROJECT_ID/smartchat-backend

# Push to GCR
docker push gcr.io/PROJECT_ID/smartchat-backend

# Deploy
gcloud run deploy smartchat-backend \
  --image gcr.io/PROJECT_ID/smartchat-backend \
  --region us-central1 \
  --set-env-vars MONGODB_URI=your_uri,JWT_SECRET=your_secret
```

## Database Setup

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create free M0 cluster
3. Add IP whitelist (0.0.0.0 for development)
4. Copy connection string
5. Use as MONGODB_URI

### MongoDB Self-Hosted
1. Install MongoDB Community Edition
2. Start mongod service
3. Use: `mongodb://localhost:27017/smartchat-ai`

## Environment Variables

### Backend
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartchat-ai
JWT_SECRET=strong_random_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com
AI_SERVICE_URL=https://ai.yourdomain.com
BCRYPT_ROUNDS=12
```

### Frontend
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### AI Service
```env
FLASK_ENV=production
PORT=5001
```

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          cd backend
          npm test
          cd ../ai-service
          python -m pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "smartchat-backend"
          appdir: "backend"
```

## Monitoring & Logging

### Backend Logging
Use Morgan for HTTP request logging
```javascript
app.use(morgan('combined', { stream: fs.createWriteStream('access.log') }));
```

### Error Tracking
Integrate Sentry for error monitoring:
```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### Performance Monitoring
Use tools:
- New Relic
- DataDog
- Prometheus + Grafana

## Scaling Strategies

### Vertical Scaling
- Increase machine resources (RAM, CPU)
- Upgrade database tier

### Horizontal Scaling
- Use load balancer (ALB, nginx)
- Run multiple backend instances
- Use auto-scaling groups
- Implement session persistence (Redis)

### Database Scaling
- Enable MongoDB sharding
- Use read replicas
- Implement caching (Redis)

## Backup & Recovery

### MongoDB Backups
```bash
# Full backup
mongodump --uri "mongodb+srv://..." --out backup/

# Restore
mongorestore --uri "mongodb+srv://..." backup/

# Enable automated backups in MongoDB Atlas
# (Available in Atlas admin console)
```

### Application Backups
- Backup environment variables
- Keep Git history
- Archive Docker image layers

## SSL/TLS Certificates

### Using Let's Encrypt with nginx
```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://backend:5000;
    }
}
```

## SSL/TLS with CloudFlare
1. Point domain to Cloudflare nameservers
2. Enable SSL in Cloudflare dashboard
3. Configure CNAME records for subdomains

## Security Checklist

- [ ] Change all default secrets
- [ ] Enable HTTPS/SSL
- [ ] Set secure CORS origins
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Database backups enabled
- [ ] Environment variables secured
- [ ] API keys rotated regularly
- [ ] Input validation enabled
- [ ] IP whitelisting configured

## Performance Optimization

### Frontend
- Enable gzip compression
- Optimize images
- Code splitting
- Lazy loading
- CDN for static files

### Backend
- Enable caching (Redis)
- Database query optimization
- Connection pooling
- Compression middleware

### AI Service
- Model quantization
- GPU acceleration
- Response caching
- Batch processing

## Troubleshooting Deployment

### Service Won't Start
1. Check logs: `heroku logs --tail`
2. Verify environment variables
3. Test locally first

### High Memory Usage
1. Check for memory leaks
2. Optimize database queries
3. Implement pagination

### Slow Responses
1. Add monitoring/APM
2. Profile code
3. Optimize critical paths
4. Use caching

---

**Last Updated**: March 2026
