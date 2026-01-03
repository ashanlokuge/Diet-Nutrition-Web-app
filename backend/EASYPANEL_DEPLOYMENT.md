# Easypanel Deployment Guide for NutriTrack Backend

This guide will help you deploy the NutriTrack backend on your VM using Easypanel.

## Prerequisites

- Easypanel installed on your VM
- MongoDB database (MongoDB Atlas or self-hosted)
- Git repository with your backend code (optional, but recommended)

## Deployment Methods

### Method 1: Deploy from Git Repository (Recommended)

1. **Push your code to a Git repository** (GitHub, GitLab, Bitbucket, etc.)

2. **Log in to Easypanel** on your VM

3. **Create a new project:**
   - Click "Create Project"
   - Enter project name: `nutritrack` or your preferred name

4. **Add a new service:**
   - Click "Add Service"
   - Choose "App"
   - Select "From Source Code"

5. **Configure Git source:**
   - Repository URL: `your-git-repository-url`
   - Branch: `main` (or your default branch)
   - Root Path: `/backend`

6. **Configure build settings:**
   - Build Method: `nixpacks` (auto-detected for Node.js)
   - Or use Dockerfile (Easypanel will detect the Dockerfile automatically)

7. **Set environment variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret_key
   ```

8. **Configure port mapping:**
   - Container Port: `5000`
   - Public Port: Choose any available port or use automatic

9. **Deploy:**
   - Click "Deploy"
   - Wait for build and deployment to complete

### Method 2: Deploy using Dockerfile

1. **Ensure Dockerfile is present** (already created in your backend directory)

2. **Follow steps 1-5 from Method 1**

3. **Configure build settings:**
   - Build Method: `Dockerfile`
   - Dockerfile Path: `./Dockerfile`

4. **Continue with steps 7-9 from Method 1**

### Method 3: Manual Docker Deployment (Without Git)

If you prefer to deploy without Git:

1. **SSH into your VM:**
   ```bash
   ssh user@your-vm-ip
   ```

2. **Create a directory for your app:**
   ```bash
   mkdir -p /home/apps/nutritrack-backend
   cd /home/apps/nutritrack-backend
   ```

3. **Copy your backend files to the VM** (from your local machine):
   ```bash
   scp -r ./backend/* user@your-vm-ip:/home/apps/nutritrack-backend/
   ```

4. **Build the Docker image:**
   ```bash
   cd /home/apps/nutritrack-backend
   docker build -t nutritrack-backend:latest .
   ```

5. **Create and run container with Easypanel:**
   - In Easypanel, create a new service
   - Choose "Custom Docker Image"
   - Image: `nutritrack-backend:latest`
   - Configure environment variables and port as described above

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/nutritrack` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-change-this` |
| `PORT` | Application port (optional) | `5000` |
| `NODE_ENV` | Environment mode | `production` |

## Post-Deployment Configuration

### 1. Configure Domain (Optional)

In Easypanel:
- Go to your service settings
- Navigate to "Domains"
- Add your domain: `api.yourdomain.com`
- Enable HTTPS (Let's Encrypt is integrated)

### 2. Set Up MongoDB

If using MongoDB Atlas:
- Whitelist your VM's IP address in MongoDB Atlas Network Access
- Or use `0.0.0.0/0` for allow all (less secure)

If self-hosting MongoDB on the same VM:
- Use connection string: `mongodb://localhost:27017/nutritrack`

### 3. Health Check

After deployment, test your API:

```bash
curl http://your-vm-ip:port/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "Connected"
}
```

### 4. Configure CORS (if needed)

If your frontend is on a different domain, update CORS settings in `server.js`:

```javascript
app.use(cors({
  origin: ['https://yourfrontend.com', 'http://localhost:5173'],
  credentials: true
}));
```

## Monitoring & Logs

In Easypanel:
- View logs: Go to your service → "Logs" tab
- Monitor resources: Check "Metrics" tab for CPU, memory usage
- Restart service: Use "Actions" → "Restart"

## Updating Your Application

### For Git-based deployment:
1. Push changes to your Git repository
2. In Easypanel, click "Redeploy" or enable auto-deploy on push

### For Docker-based deployment:
1. Build new image with updated code
2. Update image tag or rebuild
3. Redeploy in Easypanel

## Troubleshooting

### Database connection issues:
- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure network connectivity from VM

### Port conflicts:
- Change the PORT environment variable
- Check if port is already in use: `netstat -tuln | grep 5000`

### Build failures:
- Check build logs in Easypanel
- Verify all dependencies in package.json
- Ensure Node.js version compatibility

## Security Best Practices

1. **Never commit `.env` files** - They're already in .gitignore
2. **Use strong JWT_SECRET** - Generate using: `openssl rand -base64 32`
3. **Enable HTTPS** - Use Easypanel's built-in Let's Encrypt
4. **Restrict MongoDB access** - Use IP whitelisting
5. **Regular updates** - Keep dependencies updated

## Backup & Recovery

- **Database backups**: Set up automated backups in MongoDB Atlas
- **Code backups**: Keep Git repository as source of truth
- **Environment variables**: Document all variables securely

## Support

For Easypanel-specific issues:
- Documentation: https://easypanel.io/docs
- Community: https://discord.gg/easypanel

For application issues:
- Check logs in Easypanel
- Review server.js configuration
- Verify environment variables

---

**Quick Start Command Summary:**

```bash
# 1. SSH to VM
ssh user@your-vm-ip

# 2. Navigate to Easypanel (usually at http://your-vm-ip:3000)
# 3. Create project and service
# 4. Configure environment variables
# 5. Deploy

# 6. Test
curl http://your-vm-ip:port/api/health
```

Happy deploying! 🚀
