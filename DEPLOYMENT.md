# Deployment Guide - Employee Growth Intelligence

## Deployment Options

This guide covers multiple deployment strategies for the Employee Growth Intelligence System.

---

## Option 1: Docker Compose (Recommended for Quick Deploy)

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Steps

1. **Configure Environment**
```bash
# Edit docker-compose.yml with production values
# Change SECRET_KEY, database credentials, etc.
```

2. **Build and Start**
```bash
docker-compose up -d
```

3. **Initialize Database**
```bash
# Seed database (first time only)
docker-compose exec backend python scripts/seed_data.py
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

5. **View Logs**
```bash
docker-compose logs -f
```

6. **Stop Services**
```bash
docker-compose down
```

---

## Option 2: Traditional Server Deployment

### Server Requirements
- Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- 2 CPU cores minimum
- 4GB RAM minimum
- 20GB disk space
- PostgreSQL 13+
- Python 3.9+
- Node.js 16+
- Nginx

### Backend Deployment

1. **Install Dependencies**
```bash
sudo apt update
sudo apt install python3.9 python3-pip python3-venv postgresql nginx
```

2. **Setup Application**
```bash
cd /opt
sudo git clone <repository-url> employee-growth-intelligence
cd employee-growth-intelligence/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn
```

3. **Configure Database**
```bash
sudo -u postgres psql
CREATE DATABASE employee_growth_db;
CREATE USER empgrowth WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE employee_growth_db TO empgrowth;
\q
```

4. **Create Environment File**
```bash
cat > .env << EOF
DATABASE_URL=postgresql://empgrowth:secure_password_here@localhost:5432/employee_growth_db
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
DEBUG=False
ALLOWED_ORIGINS=https://yourdomain.com
EOF
```

5. **Seed Database**
```bash
python scripts/seed_data.py
```

6. **Create Systemd Service**
```bash
sudo nano /etc/systemd/system/empgrowth-backend.service
```

```ini
[Unit]
Description=Employee Growth Intelligence Backend
After=network.target postgresql.service

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/opt/employee-growth-intelligence/backend
Environment="PATH=/opt/employee-growth-intelligence/backend/venv/bin"
ExecStart=/opt/employee-growth-intelligence/backend/venv/bin/gunicorn app.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 127.0.0.1:8000 \
    --access-logfile /var/log/empgrowth/access.log \
    --error-logfile /var/log/empgrowth/error.log

[Install]
WantedBy=multi-user.target
```

7. **Start Backend**
```bash
sudo mkdir -p /var/log/empgrowth
sudo chown www-data:www-data /var/log/empgrowth
sudo systemctl daemon-reload
sudo systemctl enable empgrowth-backend
sudo systemctl start empgrowth-backend
sudo systemctl status empgrowth-backend
```

### Frontend Deployment

1. **Build Frontend**
```bash
cd /opt/employee-growth-intelligence/frontend

# Install dependencies
npm ci --production

# Build for production
npm run build
```

2. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/empgrowth
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Frontend
    root /opt/employee-growth-intelligence/frontend/dist;
    index index.html;
    
    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API Proxy
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # API Docs
    location /docs {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. **Enable Site and Restart Nginx**
```bash
sudo ln -s /etc/nginx/sites-available/empgrowth /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Option 3: Cloud Platform Deployment

### AWS Deployment

**Architecture:**
- EC2 for application
- RDS for PostgreSQL
- S3 + CloudFront for frontend
- Elastic Load Balancer
- Route 53 for DNS

**Steps:**

1. **RDS PostgreSQL**
```bash
# Create RDS instance via AWS Console
# Note the endpoint URL
# Update DATABASE_URL in backend
```

2. **EC2 Backend**
```bash
# Launch Ubuntu EC2 instance (t3.medium)
# Follow traditional deployment steps above
# Configure security groups (port 8000)
```

3. **S3 + CloudFront Frontend**
```bash
# Build frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://empgrowth-frontend/ --delete

# Create CloudFront distribution
# Point to S3 bucket
# Configure custom domain
```

### Heroku Deployment

**Backend:**
```bash
cd backend

# Create Procfile
echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
heroku create empgrowth-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main

# Seed database
heroku run python scripts/seed_data.py
```

**Frontend:**
```bash
cd frontend

# Build and deploy to Vercel/Netlify
# Or deploy as static site on Heroku
```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure services:
   - Backend: Python app (port 8000)
   - Database: PostgreSQL managed database
   - Frontend: Static site
3. Set environment variables
4. Deploy

---

## Production Checklist

### Security

- [ ] Change default SECRET_KEY
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure HTTP headers
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Disable DEBUG mode
- [ ] Remove demo credentials (or change passwords)
- [ ] Set up regular security updates

### Performance

- [ ] Configure caching (Redis optional)
- [ ] Enable Gzip compression
- [ ] Optimize database indexes
- [ ] Set up CDN for static assets
- [ ] Configure connection pooling
- [ ] Monitor memory usage
- [ ] Set up log rotation

### Monitoring

- [ ] Set up application monitoring (New Relic, DataDog)
- [ ] Configure error tracking (Sentry)
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up database monitoring
- [ ] Create alerting rules

### Backup

- [ ] Configure automated database backups
- [ ] Test backup restoration
- [ ] Set up offsite backup storage
- [ ] Document recovery procedures

### Documentation

- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document environment variables
- [ ] Create API documentation
- [ ] Document maintenance procedures

---

## Environment Variables

### Backend (.env)

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=your-secret-key-min-32-chars

# Optional
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=production
DEBUG=False
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MODEL_PATH=../ml/models
```

### Frontend

```bash
# For build time
VITE_API_URL=https://api.yourdomain.com
```

---

## Scaling Considerations

### Horizontal Scaling

**Backend:**
- Deploy multiple Gunicorn workers
- Use load balancer (Nginx, HAProxy, AWS ALB)
- Consider container orchestration (Kubernetes)

**Database:**
- Use read replicas for queries
- Implement connection pooling
- Consider sharding for large datasets

**Frontend:**
- Use CDN for global distribution
- Implement caching strategies
- Consider serverless functions for API

### Vertical Scaling

**Increase Resources:**
- CPU: For ML model training/inference
- RAM: For caching and data processing
- Disk: For database growth

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check system health
- Verify backups completed

**Weekly:**
- Review performance metrics
- Check database size
- Update dependencies (security patches)

**Monthly:**
- Full system audit
- Capacity planning review
- Test backup restoration
- Update documentation

### Database Maintenance

```sql
-- Vacuum and analyze
VACUUM ANALYZE;

-- Check database size
SELECT pg_size_pretty(pg_database_size('employee_growth_db'));

-- Reindex if needed
REINDEX DATABASE employee_growth_db;
```

---

## Troubleshooting

### Backend Issues

**Service won't start:**
```bash
sudo journalctl -u empgrowth-backend -n 100
```

**Database connection failed:**
```bash
# Test connection
psql -h localhost -U empgrowth -d employee_growth_db

# Check service
sudo systemctl status postgresql
```

**High memory usage:**
```bash
# Check Gunicorn workers
ps aux | grep gunicorn

# Restart service
sudo systemctl restart empgrowth-backend
```

### Frontend Issues

**404 errors:**
- Check Nginx configuration
- Verify build artifacts exist
- Check file permissions

**API calls failing:**
- Verify CORS configuration
- Check proxy settings
- Verify backend is running

---

## Rollback Procedure

1. **Stop current version**
```bash
sudo systemctl stop empgrowth-backend
```

2. **Restore previous code**
```bash
git checkout <previous-commit>
```

3. **Restore database if needed**
```bash
psql -U empgrowth employee_growth_db < backup.sql
```

4. **Restart services**
```bash
sudo systemctl start empgrowth-backend
sudo systemctl restart nginx
```

---

## Support & Resources

- GitHub Issues: <repository-url>/issues
- Documentation: See README.md and SETUP.md
- API Docs: https://yourdomain.com/docs

---

*Last Updated: Phase 1 Completion*
