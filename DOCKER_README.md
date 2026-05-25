# DDV Store Frontend

Ứng dụng Next.js với Docker và GitLab CI/CD pipeline.

## 🚀 Cài đặt và chạy local

### Yêu cầu

- Node.js 18+
- Docker và Docker Compose
- npm

### Chạy với Docker

1. **Clone repository:**

```bash
git clone <repository-url>
cd ddv-store-fe
```

2. **Tạo file environment:**

```bash
cp .env.example .env
# Chỉnh sửa các biến môi trường trong .env
```

3. **Build và chạy với Docker Compose:**

```bash
docker-compose up --build
```

4. **Truy cập ứng dụng:**

- URL: http://localhost:3008

### Chạy development mode

```bash
npm install
npm run dev
```

## 🐳 Docker

### Build Docker image

```bash
docker build -t ddv-store-fe .
```

### Chạy container

```bash
docker run -p 3008:3008 ddv-store-fe
```

### Docker Compose

```bash
# Chạy trong background
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng services
docker-compose down
```

## 🔄 GitLab CI/CD

Pipeline bao gồm các stages:

1. **Build**: Install dependencies và build ứng dụng
2. **Test**: Chạy linting và tests
3. **Docker Build**: Build và push Docker image lên GitLab Container Registry
4. **Deploy**: Deploy lên staging/production

### Cấu hình GitLab CI

1. **Enable Container Registry** trong GitLab project settings
2. **Set up environment variables** (nếu cần):
   - `STAGING_DEPLOY_WEBHOOK`: URL webhook để deploy staging
   - `PRODUCTION_DEPLOY_WEBHOOK`: URL webhook để deploy production

### Manual deployment

Deploy production cần manual approval:

- Vào GitLab CI/CD → Pipelines
- Click "Deploy to production" job
- Click "Run job"

## 📁 Cấu trúc project

```
├── src/
│   ├── app/                 # Next.js App Router
│   ├── lib/                 # Utilities và services
│   ├── store/               # State management (Zustand)
│   └── types/               # TypeScript types
├── public/                  # Static files
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose configuration
├── .gitlab-ci.yml          # GitLab CI/CD pipeline
└── .dockerignore           # Docker ignore file
```

## 🛠️ Scripts

- `npm run dev`: Chạy development server
- `npm run build`: Build production
- `npm run start`: Chạy production server
- `npm run lint`: Chạy ESLint

## 🔧 Environment Variables

Tạo file `.env` với các biến sau:

```env
# Next.js
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=DDV Store

# Database (nếu có)
DATABASE_URL=postgresql://...

# External APIs (nếu có)
EXTERNAL_API_KEY=your-api-key
```

## 📝 Notes

- Docker image sử dụng Node.js 20 Alpine để tối ưu kích thước
- Next.js được cấu hình với `output: 'standalone'` để tối ưu Docker image
- GitLab CI tự động build và push image lên Container Registry
- Pipeline hỗ trợ cache để tăng tốc độ build
- Health check endpoint tại `/api/health` để monitor container
- Sử dụng port 3008 và timezone Asia/Ho_Chi_Minh

## 🐛 Troubleshooting

### Docker build fails

- Kiểm tra file `.dockerignore`
- Đảm bảo `package-lock.json` tồn tại
- Chạy `npm ci` local để kiểm tra dependencies

### GitLab CI fails

- Kiểm tra GitLab Container Registry được enable
- Verify GitLab CI/CD variables
- Kiểm tra Docker-in-Docker service configuration

### Application không start

- Kiểm tra port 3000 không bị conflict
- Verify environment variables trong `.env`
- Kiểm tra logs: `docker-compose logs`
