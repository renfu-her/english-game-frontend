# Deployment Guide - English Learning Game Frontend

## 🚀 Quick Deployment

### Prerequisites
- Node.js 18+ installed
- Access to your Laravel backend API
- A hosting platform (Vercel, Netlify, AWS, etc.)

### Local Development

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd english-game-frontend
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy and edit environment variables
   cp .env.example .env
   ```
   
   Update `.env` with your API endpoints:
   ```env
   REACT_APP_API_URL=https://your-backend-domain.com/api
   REACT_APP_WS_URL=wss://your-backend-domain.com
   REACT_APP_APP_NAME="English Learning Game"
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   
   The app will be available at `http://localhost:3000`

### Production Build

1. **Build the Application**
   ```bash
   npm run build
   ```
   
   This creates a `build/` folder with optimized production files.

2. **Test Production Build Locally**
   ```bash
   npx serve -s build
   ```

## 🌐 Deployment Options

### Vercel (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub/GitLab repository
   - Import the project

2. **Environment Variables**
   - Add environment variables in Vercel dashboard:
     - `REACT_APP_API_URL`
     - `REACT_APP_WS_URL`
     - `REACT_APP_APP_NAME`

3. **Deploy**
   - Vercel will automatically deploy on every push to main branch
   - Custom domain can be configured in settings

### Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Connect your repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

2. **Environment Variables**
   - Add environment variables in Netlify dashboard

3. **Deploy**
   - Netlify will build and deploy automatically

### AWS S3 + CloudFront

1. **Upload to S3**
   ```bash
   npm run build
   aws s3 sync build/ s3://your-bucket-name
   ```

2. **Configure CloudFront**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom domain and SSL

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and Run**
   ```bash
   docker build -t english-game-frontend .
   docker run -p 80:80 english-game-frontend
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Laravel backend API URL | Yes |
| `REACT_APP_WS_URL` | WebSocket server URL | Yes |
| `REACT_APP_APP_NAME` | Application name | No |
| `REACT_APP_VERSION` | App version | No |
| `REACT_APP_ENVIRONMENT` | Environment (dev/prod) | No |

### CORS Configuration

Ensure your Laravel backend has CORS configured for your frontend domain:

```php
// config/cors.php
return [
    'paths' => ['api/*', 'broadcasting/auth'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://your-frontend-domain.com'],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## 📱 PWA Configuration

The app is configured as a Progressive Web App:

1. **Manifest**: `public/manifest.json`
2. **Service Worker**: `src/serviceWorker.ts`
3. **Icons**: Various sizes in `public/`

## 🔒 Security Considerations

1. **HTTPS Only**: Always use HTTPS in production
2. **Environment Variables**: Never commit sensitive data
3. **API Security**: Ensure backend has proper authentication
4. **CORS**: Configure CORS properly on backend

## 📊 Monitoring

### Performance Monitoring
- Use Lighthouse for performance audits
- Monitor Core Web Vitals
- Set up error tracking (Sentry, LogRocket)

### Analytics
- Google Analytics 4
- Custom event tracking for game metrics

## 🚨 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check CORS configuration
   - Verify API URL in environment variables
   - Ensure backend is running

2. **Build Failures**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all dependencies are installed

3. **WebSocket Issues**
   - Check WebSocket URL configuration
   - Ensure backend WebSocket server is running
   - Verify SSL certificates for WSS

### Support

For issues:
1. Check the browser console for errors
2. Verify environment variables
3. Test API endpoints directly
4. Check backend logs

## 📈 Performance Optimization

1. **Code Splitting**: Routes are lazy-loaded
2. **Bundle Analysis**: Use `npm run build --analyze`
3. **Image Optimization**: Use WebP format
4. **Caching**: Configure proper cache headers

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

**Happy Deploying! 🎉**
