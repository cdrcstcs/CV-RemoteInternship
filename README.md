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

# System User Flows & Access Control

## Overview

This system supports multiple user roles with different permissions and dashboards, including:

- Customer
- ProductSaler
- Administration
- Warehouse Manager
- Vehicle Manager
- Delivery Man / Delivery Driver
- Customer Support Staff
- Finance Manager
- Shipment Manager

---

# User Flows

---

## 1. Customer

### Entry Point
- Login / Sign Up

### Features

#### Profile Management
- View profile
- Update profile
- Change password

#### Product Browsing
- View single products
- View featured products
- Browse products by category
- View recommended products
- Rate products
- View product ratings

#### Shopping Management
- Add products to cart
- Update cart quantities
- Remove items from cart
- Apply coupons
- View available coupons
- Make payments
- Track order status

#### Address Management
- Add address
- Edit address
- View delivery addresses

#### Social & Interaction
- Create posts
- View posts
- Comment on posts
- Like posts
- Send connection requests
- Accept/reject requests
- Follow/unfollow users
- View notifications
- Mark notifications as read
- Block/unblock users
- Check block status

#### Chat & Communication
- View conversations
- Send messages
- Send attachments
- Send icons/emojis
- Send voice messages
- Delete messages
- Load older messages
- Create/manage groups
- Interact with chatbot

#### Feedback
- Submit feedback forms
- Fill checkboxes
- Short answers
- Multiple-choice responses

#### Streaming & Media
- View streams
- Create streams
- Search streams
- Watch recommended streams
- View stream messages

---

## 2. ProductSaler

### Entry Point
- Login
- Access sales dashboard

### Features

Includes all **Customer** features plus:

#### Product Management
- Create products
- Update products
- Delete products
- Mark products as featured

#### Coupon Management
- Create coupons
- Apply coupons

#### Feedback Management
- Create feedback forms
- Update feedback forms
- View feedback forms

#### Streaming & Media
- Create streams
- Stop streams
- Update streams
- Send stream messages
- View stream messages

---

## 3. Administration

### Entry Point
- Login
- Access admin dashboard

### Features

Includes all system permissions.

#### User Management
- Manage users
- Manage roles
- Update profiles
- Change passwords
- Manage language preferences
- Two-factor authentication management

#### Product Management
- Create products
- Update products
- Delete products
- Manage featured products

#### Warehouse Management
- View inventories
- Create inventory items
- Update inventories
- Track warehouse capacity
- Track warehouse orders
- Filter warehouse expenses
- Generate warehouse charts

#### Vehicle & Delivery Management
- View vehicles
- Update vehicles
- Track shipments
- Assign vehicles to routes

#### Coupon & Payment Management
- Create coupons
- Manage coupons
- Process payments
- Prepare deliveries

#### Social & Messaging
- Manage connections
- Manage notifications
- Manage posts
- Manage groups
- Manage chat
- Manage chatbot
- Manage emails

#### Streaming & LiveKit
- Create streams
- Manage streams
- Manage viewer tokens
- Manage LiveKit ingress

#### Media & Editor Tools
- Upload media
- Remove backgrounds
- Replace backgrounds
- Recolor images
- Extract images
- Crop videos
- Generate fills/removals
- Transcription tools

---

## 4. Warehouse Manager

### Entry Point
- Login
- Access warehouse dashboard

### Features

#### Inventory Management
- View inventories
- Create inventory items
- Update inventories
- Check warehouse capacity
- Track warehouse geography
- Track warehouse orders
- Track warehouse expenses
- Process license plates

#### Shipment Management
- Update warehouse shipment statuses

#### Limited Access
- Basic profile management only

---

## 5. Vehicle Manager

### Entry Point
- Login
- Access vehicle dashboard

### Features
- View vehicles
- Update vehicle information
- Manage vehicle details

---

## 6. Delivery Man

### Entry Point
- Login
- Access delivery dashboard

### Features
- View assigned shipments
- View route details
- Assign vehicles to route details (if permitted)
- View assigned vehicle

---

## 7. Customer Support Staff

### Entry Point
- Login
- Access support dashboard

### Features

Includes partial customer capabilities:

- View profiles
- View products
- View orders
- View interactions

#### Support Operations
- Manage customer queries
- Support tickets
- Chat support
- Notification support

---

## 8. Finance Manager

### Entry Point
- Login
- Access finance dashboard

### Features
- View payments
- View order details
- Track coupon usage
- Track discounts
- Generate financial reports

---

## 9. Shipment Manager

### Entry Point
- Login
- Access shipment dashboard

### Features
- Track shipments
- Monitor delivery progress
- Assign delivery drivers
- Monitor route details
- View warehouse logistics
- View vehicle logistics

---

## 10. Delivery Driver

### Entry Point
- Login
- Access delivery driver dashboard

### Features
- View assigned shipments
- Update delivery progress
- Confirm completed deliveries
- View assigned vehicle

---

# Role-Based Access Control (RBAC)

---

## Administration

### Permissions
- Full system access
- Full user management
- Full warehouse management
- Full vehicle management
- Full delivery management
- Full payment management
- Full social management
- Full messaging management
- Full streaming management
- Full media editor access
- Full chatbot access
- Full LiveKit management
- Two-factor authentication management

---

## Warehouse Manager

### Permissions
- Manage inventories
- Manage warehouse orders
- Manage warehouse expenses
- Process logistics license plates

### Restrictions
- No product management
- No vehicle management
- No delivery management

---

## Vehicle Manager

### Permissions
- View vehicles
- Update vehicles

### Restrictions
- No warehouse access
- No product management
- No user management

---

## Delivery Man / Delivery Driver

### Permissions
- Access shipment details
- Access assigned vehicles
- Manage delivery routes

### Restrictions
- No warehouse management
- No product management
- No financial access

---

## Customer

### Permissions
- Manage profile
- Manage addresses
- Manage cart
- Make payments
- Apply coupons
- View products
- Rate products
- Access messaging
- Access chatbot
- Access social features
- Access streaming features
- Basic media tools

---

## ProductSaler

### Permissions
Includes all Customer permissions plus:
- Manage products
- Manage coupons
- Manage feedback forms
- Manage streams

---

## Customer Support Staff

### Permissions
- Read-only product access
- Read-only social access
- Messaging management
- Chatbot management
- Customer support operations

### Restrictions
- No payment management
- No cart management
- No product CRUD

---

## Finance Manager

### Permissions
- Manage payments
- Track coupons
- View orders
- Generate reports

### Restrictions
- Limited social access
- Limited messaging access

---

## Shipment Manager

### Permissions
- Monitor shipments
- Track delivery progress
- Assign drivers
- Monitor logistics

### Restrictions
- No warehouse management
- No product management
- No financial management

---

# Core Modules

## Authentication
- Login
- Signup
- Password reset
- Two-factor authentication
- Role-based authorization

## Product System
- Product CRUD
- Categories
- Ratings
- Recommendations
- Featured products

## Shopping System
- Cart
- Coupons
- Payments
- Orders

## Social System
- Posts
- Comments
- Likes
- Connections
- Follow system
- Blocking system
- Notifications

## Messaging System
- Conversations
- Group chat
- Voice messages
- Attachments
- Chatbot integration

## Streaming System
- Live streams
- Viewer tokens
- Stream messaging
- LiveKit integration

## Warehouse & Logistics
- Inventory management
- Shipment tracking
- Route management
- Vehicle assignment
- Warehouse analytics

## Media Tools
- Image editor
- Video editor
- Background removal
- Recoloring
- Video cropping
- AI-generated fills

## Feedback System
- Dynamic forms
- Multiple-choice questions
- Checkbox questions
- Short-answer questions

---

# Project Showcase

## Screenshots

![Screenshot 2026-02-12 at 6.06.00 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%206.06.00%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 6.06.35 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%206.06.35%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 6.35.29 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%206.35.29%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 6.35.55 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%206.35.55%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 7.39.21 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%207.39.21%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.07.35 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.07.35%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.07.50 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.07.50%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.08.20 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.08.20%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.08.43 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.08.43%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.09.00 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.09.00%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.09.17 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.09.17%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.09.42 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.09.42%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.10.03 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.10.03%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.10.23 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.10.23%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.10.51 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.10.51%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.11.45 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.11.45%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.13.54 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.13.54%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.15.21 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.15.21%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.15.39 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.15.39%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.16.15 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.16.15%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.16.40 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.16.40%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.17.18 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.17.18%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.19.33 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.19.33%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.20.52 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.20.52%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.22.33 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.22.33%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.22.52 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.22.52%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.23.15 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.23.15%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.23.33 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.23.33%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.23.51 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.23.51%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.24.07 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.24.07%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.24.23 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.24.23%E2%80%AFPM.png)

![Screenshot 2026-02-12 at 8.24.51 PM](docs/Project-Showcase/Screenshot%202026-02-12%20at%208.24.51%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 1.17.31 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%201.17.31%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 1.17.45 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%201.17.45%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 1.19.03 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%201.19.03%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 1.19.41 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%201.19.41%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 1.20.09 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%201.20.09%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.37.18 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.37.18%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.37.58 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.37.58%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.38.25 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.38.25%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.38.46 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.38.46%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.41.35 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.41.35%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.43.35 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.43.35%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.43.48 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.43.48%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.44.33 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.44.33%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.45.03 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.45.03%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.45.25 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.45.25%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.45.58 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.45.58%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.46.22 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.46.22%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 3.47.03 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%203.47.03%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 4.16.52 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%204.16.52%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 4.18.01 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%204.18.01%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 4.53.39 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%204.53.39%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 4.53.59 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%204.53.59%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 4.55.24 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%204.55.24%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 4.55.42 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%204.55.42%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 4.59.09 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%204.59.09%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 5.02.31 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%205.02.31%E2%80%AFPM.png)

![Screenshot 2026-02-13 at 5.09.40 PM](docs/Project-Showcase/Screenshot%202026-02-13%20at%205.09.40%E2%80%AFPM.png)

![Screenshot](./docs/Project-Showcase/Screenshot%202026-04-01%20at%2011.14.27%20PM.png)

![Screenshot](./docs/Project-Showcase/Screenshot%202026-04-01%20at%2011.14.51%20PM.png)

![Screenshot](./docs/Project-Showcase/Screenshot%202026-04-01%20at%2011.15.05%20PM.png)

