# 🐳 Docker Setup Guide — Personal Brand SaaS

This project is fully dockerized with production-grade multi-stage builds and Nginx SPA routing.

---

## 1. Complete Docker Desktop Installation
You have already downloaded the installer:
- **File location:** `C:\Users\admin\Downloads\Docker Desktop Installer.exe`

### Steps to Install:
1. Double-click **`Docker Desktop Installer.exe`** in your Downloads folder.
2. Ensure **"Use WSL 2 instead of Hyper-V"** is checked when prompted.
3. Click **OK** and allow the installation to finish.
4. Restart your computer if prompted by Windows.
5. Open **Docker Desktop** from the Start Menu and wait until the bottom-left whale icon turns green (**"Engine running"**).

---

## 2. Running with Docker Compose (Recommended)

To build and run the complete application in a production-ready container:

```bash
# Start container in detached mode
npm run docker:compose
# or directly:
docker compose up --build -d
```

- **Application URL:** [http://localhost:3000](http://localhost:3000)
- **Container Name:** `personal_brand_prod`
- **Features included:**
  - Fast multi-stage Node 20 build.
  - Ultra-lightweight Nginx 1.27 web server.
  - SPA routing rules (`try_files $uri $uri/ /index.html;`) so `/Pannel` and `/admin` reload seamlessly.
  - Automatic Gzip compression and static asset caching.

To stop the container:
```bash
npm run docker:compose:down
# or:
docker compose down
```

---

## 3. Running Development Mode with Docker

If you want hot-reloading active development inside a container:

```bash
npm run docker:dev
# or:
docker compose --profile dev up --build
```
- **Access:** [http://localhost:5173](http://localhost:5173)

---

## 4. Manual Docker CLI Commands

### Build Image:
```bash
npm run docker:build
# or:
docker build -t personal-brand:latest .
```

### Run Container:
```bash
npm run docker:run
# or:
docker run -d -p 3000:80 --name personal-brand-app personal-brand:latest
```

### Stop & Remove Container:
```bash
npm run docker:stop
# or:
docker stop personal-brand-app && docker rm personal-brand-app
```
