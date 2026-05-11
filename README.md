## Full-Stack Developer (Part-time Remote Internship)
**Softech Corp — Da Nang, Vietnam**  
**Nov 2024 – Dec 2025 (1 yr 1 mo)**

### Overview
Built a full-scale e-commerce and social commerce platform from scratch using modern full-stack technologies, AI/ML systems, real-time communication, logistics optimization, livestreaming, and cloud-based media processing.

### Technologies
`PHP` `Python` `Golang` `Laravel` `React.js` `Three.js` `TailwindCSS` `Axios` `Zustand` `MySQL` `WebSockets` `Stripe` `Twilio` `LiveKit` `Cloudinary` `YOLOv5` `OpenCV` `Tesseract OCR` `Scikit-learn` `Pandas` `Flask`

---

## Key Features & Contributions

### Full-Stack E-Commerce Platform
- Built a scalable e-commerce platform supporting:
  - Real-time shopping
  - Payments
  - Logistics
  - Livestreaming
  - Social interactions
- Developed responsive frontend interfaces using React.js, TailwindCSS, Zustand, Axios, and Three.js.
- Built backend APIs and services using Laravel and Python integrations.

### Authentication & Security
- Implemented JWT-based authentication and role-based access control (RBAC).
- Added OTP-based two-factor authentication using Twilio.
- Built secure password management, profile systems, and user activity tracking.

### Shopping & Commerce System
- Developed:
  - Product catalog management
  - Categories
  - Ratings & reviews
  - Inventory management
  - Shopping cart
  - Coupons & discounts
  - Order processing workflows
- Integrated Stripe payment processing.
- Implemented MailTrap email workflows for order confirmations.
- Built real-time order tracking with WebSocket-based status updates.

### Recommendation & Sentiment Analysis System
- Built a recommendation engine using:
  - Collaborative filtering
  - Content-based filtering
- Utilized Pandas and Scikit-learn for recommendation processing.
- Developed a review sentiment analysis pipeline using:
  - Web scraping
  - Logistic Regression
- Improved recommendation relevance through sentiment-aware scoring.

### URL Shortener Service
- Designed and implemented a URL shortener with:
  - Unique short-code generation
  - Collision handling
  - Optimized database indexing
- Improved link retrieval and creation performance.

### Smart Logistics & Delivery Optimization
- Built a VRPTW-based delivery routing system.
- Leveraged Mapbox cost graphs including:
  - Traffic density
  - Road complexity
  - Routing costs
- Developed constraint-aware shortest-path optimization for:
  - Suppliers → Warehouses → Customers
  - Direct delivery handling
- Created warehouse dashboards with:
  - Inventory monitoring
  - Simulated location maps
  - Expense analytics

### Automatic Number Plate Recognition (ANPR)
- Built an ANPR system using:
  - YOLOv5
  - OpenCV
  - Tesseract OCR
- Enabled license plate detection and extraction from:
  - Images
  - Real-time video streams

### Livestreaming Platform
- Developed a LiveKit-powered livestreaming system supporting:
  - Real-time chat
  - Gifting
  - User engagement features
- Added OBS-compatible:
  - Stream key generation
  - Server URL generation
- Implemented scalable messaging using:
  - Reverb
  - Queues
  - Broadcast architecture

### Social Platform Features
- Built:
  - User connections
  - Posts
  - Product sharing
  - Notifications
- Integrated recursive translation using Google Translate API.

### AI-Powered 3D Avatar Generation
- Developed a 3D avatar generation pipeline using:
  - Python
  - OpenCV preprocessing
  - Cartoonization techniques
  - Edge detection
  - Smoothing & stylization
- Integrated Tripo3D for:
  - Text/image-to-3D
  - Multi-view-to-3D generation
  - Rigged animation-ready models
- Built rendering workflows using:
  - Flask
  - Three.js
  - Cloudinary

### Real-Time Messaging System
- Built a real-time messaging platform supporting:
  - Multimedia messages
  - Group chat automation
  - Spam and malicious URL detection
- Applied Logistic Regression for message filtering.
- Used WebSockets and event-driven architecture for:
  - Real-time updates
  - Chat lifecycle management
  - Background cleanup workers

### AI Media Editing Tools
- Developed an AI-powered image & video editor using Cloudinary:
  - Layer handling
  - Upload management
  - Transformations

### AI Chatbot System
- Engineered a context-aware AI chatbot using the Gemini API.
- Used scenario-based dataset seeding for:
  - Contextual accuracy
  - Adaptive interactions
  - Improved response relevance

### Software Engineering Practices
- Applied Git-based version control workflows.
- Implemented:
  - Unit testing
  - Integration testing
  - Endpoint testing
  - Interface mocking
  - Request validation
- Utilized design patterns including:
  - Singleton
  - Factory
  - Builder
  - Strategy
  - Command

### Database Architecture
- Designed and developed a 48-entity relational database.
- Applied normalization principles:
  - 2NF
  - 3NF
- Optimized relational integrity and scalability.

# Setup & Development Guide

## Clone Repository

```bash
git clone <your-repository-url>
cd CV-Logistics
```

---

## Laravel Backend Setup

### Create Laravel Project

```bash
composer create-project laravel/laravel CV-Logistics
```

### Install Breeze Authentication

```bash
composer require laravel/breeze --dev

php artisan breeze:install
```

### Install Broadcasting

```bash
php artisan install:broadcasting
```

### Install Frontend Dependencies

```bash
npm install

# or

yarn install
```

---

## Database Setup

### Run Migrations & Seeders

```bash
php artisan migrate --seed
```

### Refresh Database

```bash
php artisan migrate:refresh --seed
```

---

## Start Development Servers

### Laravel Server

```bash
php artisan serve
```

### Vite Development Server

```bash
npm run dev

# or

yarn dev
```

---

## Queue & Real-Time Services

### Start Laravel Reverb

```bash
php artisan reverb:start --port=8081 --debug
```

### Start Queue Worker

```bash
php artisan queue:work
```

### Start Horizon

```bash
php artisan horizon
```

---

## Artisan Utilities

### Open Laravel Tinker

```bash
php artisan tinker
```

### Example Queries

```php
\App\Models\Shipment::count();

\App\Models\Shipment::query()->paginate(5)->all();
```

### Generate Model with Migration & Factory

```bash
php artisan make:model Endorsement -fm
```

### Generate Resource Controller

```bash
php artisan make:controller TodoController --model=Todo --requests --resource
```

### List Application Routes

```bash
php artisan route:list
```

---

# Python Microservice Setup

## Create Virtual Environment

```bash
python3 -m venv venv
```

## Activate Virtual Environment

### Linux / macOS

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

---

## Install Python Dependencies

```bash
pip3 install -r requirements.txt
```

## Run FastAPI/Uvicorn Server

```bash
python3 -m uvicorn main:app --reload --port 5000
```

---

# Full Development Commands

```bash
composer create-project laravel/laravel CV-Logistics

composer require laravel/breeze --dev

php artisan breeze:install

php artisan install:broadcasting

php artisan serve

npm run dev

php artisan tinker

php artisan make:model Endorsement -fm

php artisan migrate --seed

python3 -m venv venv

source venv/bin/activate

pip3 install -r requirements.txt

python3 -m uvicorn main:app --reload --port 5000

php artisan migrate:refresh --seed

php artisan make:controller TodoController --model=Todo --requests --resource

php artisan reverb:start --port=8081 --debug

php artisan queue:work

php artisan horizon

php artisan route:list

yarn install

yarn dev

php artisan serve
```
