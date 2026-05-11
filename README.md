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

![Screenshot](docs/Project-Showcase/1.png)

![Screenshot](docs/Project-Showcase/2.png)

![Screenshot](docs/Project-Showcase/3.png)


|Order Table                          |FIELD2                     |FIELD3    |FIELD4                                        |FIELD5    |FIELD6 |FIELD7                     |FIELD8            |FIELD9                                       |FIELD10                                                  |FIELD11|FIELD12|FIELD13|FIELD14|
|-------------------------------------|---------------------------|----------|----------------------------------------------|----------|-------|---------------------------|------------------|---------------------------------------------|---------------------------------------------------------|-------|-------|-------|-------|
|No.                                  |FieldName                  |DataType  |DataSize                                      |Allow null|Key    |Foreign Key                |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |Primary|                           |Auto              |Auto Increment                               |Primary key                                              |       |       |       |       |
|2                                    |status                     |VARCHAR   |30                                            |Yes       |       |                           |                  |                                             |Order status                                             |       |       |       |       |
|3                                    |order_date                 |TIMESTAMP |                                              |Yes       |       |                           |                  |                                             |Date order was placed                                    |       |       |       |       |
|4                                    |user_id                    |BIGINT    |20                                            |Yes       |Index  |users(id)                  |NULL              |ON DELETE SET NULL                           |References users table                                   |       |       |       |       |
|5                                    |tracking_number            |VARCHAR   |100                                           |Yes       |Unique |                           |NULL              |UNIQUE                                       |Shipment tracking number                                 |       |       |       |       |
|6                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Auto-managed by Laravel                                  |       |       |       |       |
|7                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |ON UPDATE CURRENT_TIMESTAMP                  |Auto-managed by Laravel                                  |       |       |       |       |
|8                                    |total_amount               |INTEGER   |                                              |Yes       |       |                           |                  |                                             |Total order value                                        |       |       |       |       |
|USER Table                           |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |Primary|                           |Auto Increment    |PK                                           |Auto-generated user ID                                   |       |       |       |       |
|2                                    |first_name                 |VARCHAR   |100                                           |Yes       |       |                           |NULL              |                                             |User first name                                          |       |       |       |       |
|3                                    |last_name                  |VARCHAR   |100                                           |Yes       |       |                           |NULL              |                                             |User last name                                           |       |       |       |       |
|4                                    |phone_number               |VARCHAR   |50                                            |Yes       |       |                           |NULL              |                                             |Contact number                                           |       |       |       |       |
|5                                    |ip_address                 |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Last known IP                                            |       |       |       |       |
|6                                    |email                      |VARCHAR   |255                                           |Yes       |Unique |                           |NULL              |UNIQUE                                       |User email                                               |       |       |       |       |
|7                                    |password                   |VARCHAR   |255                                           |Yes       |       |                           |NULL              |                                             |Hashed password                                          |       |       |       |       |
|8                                    |two_factor_enabled         |BOOLEAN   |                                              |No        |       |                           |FALSE             |                                             |2FA status                                               |       |       |       |       |
|9                                    |last_login                 |TIMESTAMP |                                              |Yes       |       |                           |NULL              |                                             |Last login time                                          |       |       |       |       |
|10                                   |language                   |VARCHAR   |20                                            |Yes       |       |                           |NULL              |                                             |Preferred language                                       |       |       |       |       |
|11                                   |is_admin                   |BOOLEAN   |                                              |No        |       |                           |FALSE             |                                             |Admin flag                                               |       |       |       |       |
|12                                   |created_at                 |TIMESTAMP |                                              |No        |       |                           |Auto              |                                             |Record creation time                                     |       |       |       |       |
|13                                   |updated_at                 |TIMESTAMP |                                              |No        |       |                           |Auto              |                                             |Record update time                                       |       |       |       |       |
|14                                   |last_password_change       |TIMESTAMP |                                              |Yes       |       |                           |NULL              |                                             |Password update time                                     |       |       |       |       |
|15                                   |profile_picture            |VARCHAR   |1000                                          |No        |       |                           |'                 |                                             |Profile image path                                       |       |       |       |       |
|16                                   |banner_img                 |VARCHAR   |1000                                          |No        |       |                           |'                 |                                             |Banner image path                                        |       |       |       |       |
|17                                   |headline                   |VARCHAR   |255                                           |No        |       |                           |Linkedin User     |                                             |Default headline                                         |       |       |       |       |
|18                                   |about                      |TEXT      |                                              |Yes       |       |                           |NULL              |                                             |About user                                               |       |       |       |       |
|19                                   |two_factor_code            |VARCHAR   |255                                           |Yes       |       |                           |NULL              |                                             |Temporary 2FA code                                       |       |       |       |       |
|20                                   |two_factor_code_created_at |TIMESTAMP |                                              |Yes       |       |                           |NULL              |                                             |2FA code timestamp                                       |       |       |       |       |
|PASSWORD_RESET_TOKENS Table          |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |email                      |VARCHAR   |255                                           |No        |Primary|                           |                  |PK                                           |User email                                               |       |       |       |       |
|2                                    |token                      |VARCHAR   |255                                           |No        |       |                           |                  |                                             |Reset token                                              |       |       |       |       |
|3                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |                           |NULL              |                                             |Token creation time                                      |       |       |       |       |
|SESSIONS Table                       |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |VARCHAR   |255                                           |No        |Primary|                           |                  |PK                                           |Session ID                                               |       |       |       |       |
|2                                    |user_id                    |BIGINT    |                                              |Yes       |Index  |users.id                   |NULL              |FK                                           |Linked user                                              |       |       |       |       |
|3                                    |ip_address                 |VARCHAR   |45                                            |Yes       |       |                           |NULL              |                                             |IPv4 / IPv6                                              |       |       |       |       |
|4                                    |user_agent                 |TEXT      |                                              |Yes       |       |                           |NULL              |                                             |Browser details                                          |       |       |       |       |
|5                                    |payload                    |LONGTEXT  |                                              |No        |       |                           |                  |                                             |Session data                                             |       |       |       |       |
|6                                    |last_activity              |INTEGER   |                                              |No        |Index  |                           |                  |                                             |Last activity timestamp                                  |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|CACHE Table                          |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |key                        |VARCHAR   |255                                           |No        |Primary|                           |                  |PK                                           |Cache key                                                |       |       |       |       |
|2                                    |value                      |MEDIUMTEXT|                                              |No        |       |                           |                  |                                             |Stored cache value                                       |       |       |       |       |
|3                                    |expiration                 |INTEGER   |                                              |No        |       |                           |                  |                                             |Expiration timestamp (seconds)                           |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|CACHE_LOCKS Table                    |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |key                        |VARCHAR   |255                                           |No        |Primary|                           |                  |PK                                           |Lock key                                                 |       |       |       |       |
|2                                    |owner                      |VARCHAR   |255                                           |No        |       |                           |                  |                                             |Lock owner identifier                                    |       |       |       |       |
|3                                    |expiration                 |INTEGER   |                                              |No        |       |                           |                  |                                             |Lock expiration timestamp                                |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|FEEDBACK_FORMS Table                 |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |Primary|                           |Auto Increment    |PK                                           |Auto-generated ID                                        |       |       |       |       |
|2                                    |user_id                    |BIGINT    |                                              |No        |Index  |users.id                   |                  |FK                                           |References users table                                   |       |       |       |       |
|3                                    |order_id                   |BIGINT    |                                              |Yes       |Index  |orders.id                  |NULL              |FK                                           |References orders table (nullable)                       |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |Auto              |                                             |Record creation time                                     |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |Auto              |                                             |Record update time                                       |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|FEEDBACK_FORMS_QUESTIONS Table       |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |Primary|                           |Auto Increment    |PK                                           |Auto-generated ID                                        |       |       |       |       |
|2                                    |type                       |VARCHAR   |45                                            |No        |       |                           |TEXT              |                                             |                                                         |       |       |       |       |
|3                                    |question                   |VARCHAR   |2000                                          |No        |       |                           |TEXT              |                                             |                                                         |       |       |       |       |
|4                                    |description                |LONGTEXT  |                                              |Yes       |       |                           |NULL              |                                             |Additional description                                   |       |       |       |       |
|5                                    |data                       |LONGTEXT  |                                              |Yes       |       |                           |NULL              |                                             |Extra configuration / metadata                           |       |       |       |       |
|6                                    |feedback_form_id           |BIGINT    |                                              |No        |Index  |feedback_forms.id          |                  |FK                                           |References feedback_forms table                          |       |       |       |       |
|7                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |Auto              |                                             |Record creation time                                     |       |       |       |       |
|8                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |Auto              |                                             |Record update time                                       |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|FEEDBACK_FORMS_ANSWERS Table         |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Auto-generated ID                                        |       |       |       |       |
|2                                    |feedback_form_id           |BIGINT    |20                                            |No        |FK     |feedback_forms.id          |                  |Foreign Key                                  |References feedback_forms table                          |       |       |       |       |
|3                                    |start_date                 |TIMESTAMP |                                              |Yes       |       |                           |                  |NULL                                         |Start date of feedback                                   |       |       |       |       |
|4                                    |end_date                   |TIMESTAMP |                                              |Yes       |       |                           |                  |NULL                                         |End date of feedback                                     |       |       |       |       |
|FEEDBACK_FORM_QUESTION_ANSWERS Table |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Auto-generated ID                                        |       |       |       |       |
|2                                    |feedback_form_question_id  |BIGINT    |20                                            |No        |FK     |feedback_form_questions.id |                  |Foreign Key                                  |References feedback_form_questions                       |       |       |       |       |
|3                                    |feedback_form_answer_id    |BIGINT    |20                                            |No        |FK     |feedback_form_answers.id   |                  |Foreign Key                                  |References feedback_form_answers                         |       |       |       |       |
|4                                    |answer                     |TEXT      |                                              |No        |       |                           |                  |                                             |Text answer content                                      |       |       |       |       |
|5                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Auto-managed by Laravel                                  |       |       |       |       |
|6                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Auto-managed by Laravel                                  |       |       |       |       |
|ROUTE_CONDITIONS Table               |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Unique route condition ID                                |       |       |       |       |
|2                                    |weather                    |ENUM      |Clear &#124; Rainy &#124; Snowy &#124; Foggy &#124; Windy &#124; Stormy|No        |       |                           |Clear             |ENUM                                         |Weather condition                                        |       |       |       |       |
|3                                    |road_condition             |ENUM      |Dry &#124; Wet &#124; Under Construction &#124; Icy &#124; Flooded|No        |       |                           |Dry               |ENUM                                         |Road condition                                           |       |       |       |       |
|4                                    |traffic_condition          |ENUM      |Light &#124; Moderate &#124; Heavy                      |No        |       |                           |Light             |ENUM                                         |Traffic condition                                        |       |       |       |       |
|5                                    |has_accident               |BOOLEAN   |1                                             |No        |       |                           |FALSE             |Default false                                |Accident indicator                                       |       |       |       |       |
|6                                    |accident_description       |TEXT      |                                              |Yes       |       |                           |NULL              |                                             |Accident details                                         |       |       |       |       |
|7                                    |road_closure_description   |TEXT      |                                              |Yes       |       |                           |NULL              |                                             |Road closure details                                     |       |       |       |       |
|8                                    |reported_at                |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |useCurrent()                                 |Reported time                                            |       |       |       |       |
|9                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |Laravel timestamps                           |Created time                                             |       |       |       |       |
|10                                   |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |Laravel timestamps                           |Updated time                                             |       |       |       |       |
|GROUPS Table                         |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Group ID                                                 |       |       |       |       |
|2                                    |name                       |VARCHAR   |255                                           |No        |       |                           |String            |                                             |Group name                                               |       |       |       |       |
|3                                    |description                |LONGTEXT  |                                              |Yes       |       |                           |NULL              |Nullable                                     |Description of group                                     |       |       |       |       |
|4                                    |owner_id                   |BIGINT    |20                                            |No        |FK     |users.id                   |CASCADE           |Foreign Key                                  |Group owner (user)                                       |       |       |       |       |
|5                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|6                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|GROUP_USERS Table                    |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Record ID                                                |       |       |       |       |
|2                                    |group_id                   |BIGINT    |20                                            |No        |FK     |groups.id                  |CASCADE           |Foreign Key                                  |Group reference                                          |       |       |       |       |
|3                                    |user_id                    |BIGINT    |20                                            |No        |FK     |users.id                   |CASCADE           |Foreign Key                                  |User reference                                           |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|CONVERSATIONS Table                  |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Conversation ID                                          |       |       |       |       |
|2                                    |user_id1                   |BIGINT    |20                                            |No        |FK     |users.id                   |                  |Foreign Key                                  |First participant user                                   |       |       |       |       |
|3                                    |user_id2                   |BIGINT    |20                                            |No        |FK     |users.id                   |                  |Foreign Key                                  |Second participant user                                  |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|MESSAGES Table                       |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Message ID                                               |       |       |       |       |
|2                                    |message                    |LONGTEXT  |                                              |Yes       |       |                           |NULL              |Nullable                                     |Message content                                          |       |       |       |       |
|3                                    |sender_id                  |BIGINT    |20                                            |No        |FK     |users.id                   |                  |Foreign Key                                  |Sender user                                              |       |       |       |       |
|4                                    |receiver_id                |BIGINT    |20                                            |Yes       |FK     |users.id                   |NULL              |Foreign Key                                  |Receiver user (optional)                                 |       |       |       |       |
|5                                    |group_id                   |BIGINT    |20                                            |Yes       |FK     |groups.id                  |NULL              |Foreign Key                                  |Group message (optional)                                 |       |       |       |       |
|6                                    |conversation_id            |BIGINT    |20                                            |Yes       |FK     |conversations.id           |NULL              |Foreign Key                                  |Private conversation (optional)                          |       |       |       |       |
|7                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|8                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|MESSAGE_ATTACHMENTS Table            |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Attachment ID                                            |       |       |       |       |
|2                                    |message_id                 |BIGINT    |20                                            |No        |FK     |messages.id                |                  |Foreign Key                                  |Associated message                                       |       |       |       |       |
|3                                    |name                       |VARCHAR   |255                                           |No        |       |                           |                  |                                             |File name (e.g., test.png)                               |       |       |       |       |
|4                                    |path                       |VARCHAR   |1024                                          |No        |       |                           |                  |                                             |File path                                                |       |       |       |       |
|5                                    |mime                       |VARCHAR   |255                                           |No        |       |                           |                  |                                             |MIME type (e.g., image/png)                              |       |       |       |       |
|6                                    |size                       |INT       |11                                            |No        |       |                           |                  |                                             |File size in bytes                                       |       |       |       |       |
|7                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|8                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|POSTS Table                          |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Post ID                                                  |       |       |       |       |
|2                                    |author_id                  |BIGINT    |20                                            |No        |FK     |users.id                   |CASCADE           |Foreign Key                                  |Author of the post                                       |       |       |       |       |
|3                                    |content                    |TEXT      |                                              |Yes       |       |                           |NULL              |                                             |Post content (optional)                                  |       |       |       |       |
|4                                    |image                      |VARCHAR   |1000                                          |Yes       |       |                           |NULL              |                                             |Optional image URL or path                               |       |       |       |       |
|5                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|6                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|NOTIFICATIONS Table                  |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Notification ID                                          |       |       |       |       |
|2                                    |recipient_id               |BIGINT    |20                                            |No        |FK     |users.id                   |CASCADE           |Foreign Key                                  |Recipient user                                           |       |       |       |       |
|3                                    |type                       |VARCHAR   |255                                           |No        |       |                           |                  |                                             |Notification type (e.g., comment, like)                  |       |       |       |       |
|4                                    |related_user               |BIGINT    |20                                            |Yes       |FK     |users.id                   |NULL              |SET NULL                                     |Related user (optional)                                  |       |       |       |       |
|5                                    |related_post               |BIGINT    |20                                            |Yes       |FK     |posts.id                   |NULL              |SET NULL                                     |Related post (optional)                                  |       |       |       |       |
|6                                    |read                       |BOOLEAN   |1                                             |No        |       |                           |FALSE             |Default = false                              |Whether notification is read                             |       |       |       |       |
|7                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|8                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|CONNECTION_REQUESTS Table            |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Connection request ID                                    |       |       |       |       |
|2                                    |sender_id                  |BIGINT    |20                                            |No        |FK     |users.id                   |CASCADE           |Foreign Key                                  |Sender user                                              |       |       |       |       |
|3                                    |recipient_id               |BIGINT    |20                                            |No        |FK     |users.id                   |CASCADE           |Foreign Key                                  |Recipient user                                           |       |       |       |       |
|4                                    |status                     |ENUM      |pending &#124; accepted &#124; rejected                 |No        |       |                           |pending           |ENUM                                         |Request status                                           |       |       |       |       |
|5                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|6                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|COMMENTS Table                       |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Comment ID                                               |       |       |       |       |
|2                                    |post_id                    |BIGINT    |20                                            |No        |FK     |posts.id                   |CASCADE           |Foreign Key                                  |Post associated with the comment                         |       |       |       |       |
|3                                    |user_id                    |BIGINT    |20                                            |No        |FK     |users.id                   |CASCADE           |Foreign Key                                  |User who made the comment                                |       |       |       |       |
|4                                    |content                    |TEXT      |                                              |No        |       |                           |Comment text      |                                             |                                                         |       |       |       |       |
|5                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|6                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|LIKE Table                           |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Like ID                                                  |       |       |       |       |
|2                                    |post_id                    |BIGINT    |20                                            |No        |FK     |posts.id                   |CASCADE           |Foreign Key                                  |Post that is liked                                       |       |       |       |       |
|3                                    |user_id                    |BIGINT    |20                                            |No        |FK     |users.id                   |CASCADE           |Foreign Key                                  |User who liked the post                                  |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|USER_CONNECTIONS Table               |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Connection ID                                            |       |       |       |       |
|2                                    |user_id                    |BIGINT    |20                                            |No        |FK     |users.id                   |CASCADE           |Foreign Key                                  |User                                                     |       |       |       |       |
|3                                    |connection_id              |BIGINT    |20                                            |No        |FK     |users.id                   |CASCADE           |Foreign Key                                  |Connected user                                           |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|6                                    |user_connection_unique     |BIGINT    |                                              |No        |       |Composite                  |UNIQUE            |Unique constraint on (user_id, connection_id)|Prevents duplicate connections                           |       |       |       |       |
|VEHICLE_MANAGEMENT Table             |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Vehicle record ID                                        |       |       |       |       |
|2                                    |fuel_consumption           |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Fuel consumption (nullable)                              |       |       |       |       |
|3                                    |distance_traveled          |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Distance traveled (nullable)                             |       |       |       |       |
|4                                    |maintenance_status         |VARCHAR   |100                                           |Yes       |       |                           |NULL              |                                             |Maintenance status (nullable)                            |       |       |       |       |
|5                                    |last_maintenance_date      |TIMESTAMP |                                              |Yes       |       |                           |NULL              |                                             |Last maintenance date (nullable)                         |       |       |       |       |
|6                                    |maintenance_schedule       |TIMESTAMP |                                              |Yes       |       |                           |NULL              |                                             |Maintenance schedule (nullable)                          |       |       |       |       |
|7                                    |maintenance_cost           |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Maintenance cost (nullable)                              |       |       |       |       |
|8                                    |users_id                   |BIGINT    |20                                            |No        |FK     |users.id                   |RESTRICT + CASCADE|Foreign Key                                  |User associated with vehicle                             |       |       |       |       |
|9                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|10                                   |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|PRODUCTS Table                       |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Product ID                                               |       |       |       |       |
|2                                    |name                       |VARCHAR   |100                                           |Yes       |       |                           |NULL              |                                             |Product name (nullable)                                  |       |       |       |       |
|3                                    |price                      |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Product price (nullable)                                 |       |       |       |       |
|4                                    |description                |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Product description (nullable)                           |       |       |       |       |
|5                                    |supplier_id                |BIGINT    |20                                            |Yes       |FK     |users.id                   |NULL              |NULL ON DELETE                               |Foreign key to supplier (nullable)                       |       |       |       |       |
|6                                    |isFeatured                 |BOOLEAN   |1                                             |No        |       |                           |FALSE             |                                             |Indicates if product is featured                         |       |       |       |       |
|7                                    |image                      |VARCHAR   |1000                                          |Yes       |       |                           |NULL              |                                             |Product image path (nullable)                            |       |       |       |       |
|8                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|9                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|WAREHOUSES Table                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Warehouse ID                                             |       |       |       |       |
|2                                    |warehouse_name             |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Warehouse name (nullable)                                |       |       |       |       |
|3                                    |location                   |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Warehouse location (nullable)                            |       |       |       |       |
|4                                    |capacity                   |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Total capacity of warehouse (nullable)                   |       |       |       |       |
|5                                    |available_space            |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Available space in warehouse (nullable)                  |       |       |       |       |
|6                                    |users_id                   |BIGINT    |20                                            |No        |FK     |users.id                   |RESTRICT + CASCADE|Foreign Key                                  |User associated with warehouse                           |       |       |       |       |
|7                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|8                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|INVENTORY Table                      |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Inventory record ID                                      |       |       |       |       |
|2                                    |stock                      |INT       |11                                            |Yes       |       |                           |NULL              |                                             |Quantity in stock (nullable)                             |       |       |       |       |
|3                                    |last_updated               |TIMESTAMP |                                              |Yes       |       |                           |NULL              |                                             |Last updated timestamp (nullable)                        |       |       |       |       |
|4                                    |weight_per_unit            |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Weight per unit (nullable)                               |       |       |       |       |
|5                                    |products_id                |BIGINT    |20                                            |No        |FK     |products.id                |RESTRICT + CASCADE|Foreign Key                                  |Product                                                  |       |       |       |       |
|6                                    |warehouses_id              |BIGINT    |20                                            |No        |FK     |warehouses.id              |RESTRICT + CASCADE|Foreign Key                                  |Warehouse                                                |       |       |       |       |
|7                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|8                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|PROVIDERS Table                      |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Provider ID                                              |       |       |       |       |
|2                                    |type                       |VARCHAR   |45                                            |Yes       |       |                           |NULL              |                                             |Type of provider (nullable)                              |       |       |       |       |
|3                                    |terms_of_service           |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Terms of service (nullable)                              |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|PAYMENTS Table                       |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Payment ID                                               |       |       |       |       |
|2                                    |total_amount               |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Total amount of the payment (nullable)                   |       |       |       |       |
|3                                    |paid_amount                |DECIMAL   |18,2                                          |Yes       |       |                           |0                 |                                             |Amount already paid                                      |       |       |       |       |
|4                                    |due_amount                 |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Remaining amount to be paid (nullable)                   |       |       |       |       |
|5                                    |payment_method             |VARCHAR   |50                                            |Yes       |       |                           |NULL              |                                             |Method of payment (nullable)                             |       |       |       |       |
|6                                    |payment_status             |VARCHAR   |50                                            |Yes       |       |                           |NULL              |                                             |Status of the payment (nullable)                         |       |       |       |       |
|7                                    |payment_date               |TIMESTAMP |                                              |Yes       |       |                           |NULL              |                                             |Date and time of payment (nullable)                      |       |       |       |       |
|8                                    |gateway                    |VARCHAR   |100                                           |Yes       |       |                           |NULL              |                                             |Payment gateway (nullable)                               |       |       |       |       |
|9                                    |currency                   |VARCHAR   |10                                            |Yes       |       |                           |NULL              |                                             |Currency type (nullable)                                 |       |       |       |       |
|10                                   |order_id                   |BIGINT    |20                                            |Yes       |FK     |orders.id                  |NULL              |NULL ON DELETE                               |Foreign key to order (nullable)                          |       |       |       |       |
|11                                   |providers_id               |BIGINT    |20                                            |No        |FK     |providers.id               |RESTRICT + CASCADE|Foreign key to provider                      |                                                         |       |       |       |       |
|12                                   |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|13                                   |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|PERMISSIONS Table                    |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Permission ID                                            |       |       |       |       |
|2                                    |permission_name            |VARCHAR   |50                                            |Yes       |       |                           |NULL              |                                             |Name of the permission (nullable)                        |       |       |       |       |
|3                                    |description                |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Description of the permission (nullable)                 |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|CATEGORIES Table                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Category ID                                              |       |       |       |       |
|2                                    |category_name              |VARCHAR   |100                                           |Yes       |       |                           |NULL              |                                             |Name of the category (nullable)                          |       |       |       |       |
|3                                    |description                |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Description of the category (nullable)                   |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|SHIPMENTS Table                      |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Shipment ID                                              |       |       |       |       |
|2                                    |status                     |VARCHAR   |50                                            |Yes       |       |                           |NULL              |                                             |Status of the shipment (nullable)                        |       |       |       |       |
|3                                    |estimated_arrival          |DATETIME  |                                              |Yes       |       |                           |NULL              |                                             |Estimated arrival date/time (nullable)                   |       |       |       |       |
|4                                    |actual_arrival             |DATETIME  |                                              |Yes       |       |                           |NULL              |                                             |Actual arrival date/time (nullable)                      |       |       |       |       |
|5                                    |origin                     |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Origin location (nullable)                               |       |       |       |       |
|6                                    |destination                |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Destination location (nullable)                          |       |       |       |       |
|7                                    |shipment_method            |VARCHAR   |50                                            |Yes       |       |                           |NULL              |                                             |Method of shipment (nullable)                            |       |       |       |       |
|8                                    |tracking_number            |VARCHAR   |100                                           |Yes       |       |Unique                     |NULL              |                                             |Unique tracking number (nullable)                        |       |       |       |       |
|9                                    |last_updated               |DATETIME  |                                              |Yes       |       |                           |NULL              |                                             |Last updated date/time (nullable)                        |       |       |       |       |
|10                                   |total_amount               |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Total shipment amount (nullable)                         |       |       |       |       |
|11                                   |providers_id               |BIGINT    |20                                            |No        |FK     |providers.id               |                  |RESTRICT + CASCADE                           |Foreign key to providers                                 |       |       |       |       |
|12                                   |orders_id                  |BIGINT    |20                                            |No        |FK     |orders.id                  |                  |RESTRICT + CASCADE                           |Foreign key to orders                                    |       |       |       |       |
|13                                   |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|14                                   |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|RATINGS Table                        |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Rating ID                                                |       |       |       |       |
|2                                    |rating_value               |INT       |11                                            |Yes       |       |                           |NULL              |                                             |Rating value (nullable)                                  |       |       |       |       |
|3                                    |feedback                   |VARCHAR   |1000                                          |Yes       |       |                           |                  |No feedback provided'                        |Feedback text (nullable, default)                        |       |       |       |       |
|4                                    |date_created               |DATETIME  |                                              |Yes       |       |                           |NULL              |                                             |Date of rating creation (nullable)                       |       |       |       |       |
|5                                    |shipments_id               |BIGINT    |20                                            |No        |FK     |shipments.id               |                  |RESTRICT + CASCADE                           |Foreign key to shipments                                 |       |       |       |       |
|6                                    |products_id                |BIGINT    |20                                            |No        |FK     |products.id                |                  |RESTRICT + CASCADE                           |Foreign key to products                                  |       |       |       |       |
|7                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|8                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|ROLES Table                          |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Role ID                                                  |       |       |       |       |
|2                                    |role_name                  |VARCHAR   |50                                            |Yes       |       |                           |NULL              |                                             |Name of the role (nullable)                              |       |       |       |       |
|3                                    |description                |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Description of the role (nullable)                       |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|VEHICLES Table                       |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Vehicle ID                                               |       |       |       |       |
|2                                    |license_plate              |VARCHAR   |50                                            |Yes       |       |                           |NULL              |                                             |License plate (nullable)                                 |       |       |       |       |
|3                                    |type                       |VARCHAR   |50                                            |Yes       |       |                           |NULL              |                                             |Type of vehicle (nullable)                               |       |       |       |       |
|4                                    |driver_id                  |BIGINT    |20                                            |Yes       |FK     |users.id                   |NULL              |                                             |Foreign key to Users table for driver                    |       |       |       |       |
|5                                    |capacity                   |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Capacity of the vehicle (nullable)                       |       |       |       |       |
|6                                    |fuel_capacity              |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Fuel capacity (nullable)                                 |       |       |       |       |
|7                                    |current_location           |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Current location (nullable)                              |       |       |       |       |
|8                                    |last_serviced              |DATETIME  |                                              |Yes       |       |                           |NULL              |                                             |Last serviced date (nullable)                            |       |       |       |       |
|9                                    |status                     |VARCHAR   |100                                           |Yes       |       |                           |NULL              |                                             |Status (nullable)                                        |       |       |       |       |
|10                                   |last_fuel_refill           |DATETIME  |                                              |Yes       |       |                           |NULL              |                                             |Last fuel refill date (nullable)                         |       |       |       |       |
|11                                   |last_location_update       |DATETIME  |                                              |Yes       |       |                           |NULL              |NULL                                         |Last location update (nullable)                          |       |       |       |       |
|12                                   |mileage                    |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Mileage of the vehicle (nullable)                        |       |       |       |       |
|13                                   |maintenance_logs           |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Maintenance logs (nullable)                              |       |       |       |       |
|14                                   |vehicle_management_id      |BIGINT    |20                                            |No        |FK     |vehicle_management.id      |                  |RESTRICT + CASCADE                           |Foreign key to VehicleManagement table                   |       |       |       |       |
|15                                   |fuel_interval              |INT       |11                                            |No        |       |                           |0                 |                                             |Fuel interval (default 0)                                |       |       |       |       |
|16                                   |fuel_type                  |VARCHAR   |50                                            |Yes       |       |                           |NULL              |                                             |Fuel type (nullable)                                     |       |       |       |       |
|17                                   |vin                        |VARCHAR   |50                                            |Yes       |       |                           |NULL              |                                             |Vehicle Identification Number (nullable)                 |       |       |       |       |
|18                                   |brand                      |VARCHAR   |100                                           |Yes       |       |                           |NULL              |                                             |Vehicle brand (nullable)                                 |       |       |       |       |
|19                                   |model                      |VARCHAR   |100                                           |Yes       |       |                           |NULL              |                                             |Vehicle model (nullable)                                 |       |       |       |       |
|20                                   |year_of_manufacture        |INT       |11                                            |Yes       |       |                           |NULL              |                                             |Year of manufacture (nullable)                           |       |       |       |       |
|21                                   |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|22                                   |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|INVOICES Table                       |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |Auto Increment    |Primary Key                                  |Invoice ID                                               |       |       |       |       |
|2                                    |customer_name              |VARCHAR   |45                                            |Yes       |       |                           |NULL              |                                             |Customer name (nullable)                                 |       |       |       |       |
|3                                    |created_date               |DATETIME  |                                              |Yes       |       |                           |NULL              |                                             |Date when invoice was created (nullable)                 |       |       |       |       |
|4                                    |payment_status             |VARCHAR   |45                                            |Yes       |       |                           |NULL              |                                             |Payment status (nullable)                                |       |       |       |       |
|5                                    |payment_method             |VARCHAR   |45                                            |Yes       |       |                           |NULL              |                                             |Payment method (nullable)                                |       |       |       |       |
|6                                    |description                |VARCHAR   |500                                           |Yes       |       |                           |NULL              |                                             |Description of invoice (nullable)                        |       |       |       |       |
|7                                    |shipping_cost              |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Shipping cost (nullable)                                 |       |       |       |       |
|8                                    |total_amount               |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Total amount (nullable)                                  |       |       |       |       |
|9                                    |paid_amount                |DECIMAL   |18,2                                          |Yes       |       |                           |0                 |                                             |Paid amount (default 0)                                  |       |       |       |       |
|10                                   |due_amount                 |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Remaining due amount (nullable)                          |       |       |       |       |
|11                                   |currency                   |VARCHAR   |10                                            |Yes       |       |                           |NULL              |                                             |Currency (nullable)                                      |       |       |       |       |
|12                                   |discount                   |DECIMAL   |18,2                                          |Yes       |       |                           |NULL              |                                             |Discount applied (nullable)                              |       |       |       |       |
|13                                   |payments_id                |BIGINT    |20                                            |No        |FK     |payments.id                |RESTRICT + CASCADE|Foreign key to Payments table                |                                                         |       |       |       |       |
|14                                   |created_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|15                                   |updated_at                 |TIMESTAMP |                                              |No        |       |                           |CURRENT_TIMESTAMP |                                             |Laravel timestamps                                       |       |       |       |       |
|PRODUCTS_CATEGORIES Table            |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |products_id                |BIGINT    |20                                            |No        |PK,Fk  |products.id                |                  |CASCADE on delete & update                   |Foreign key to Products table                            |       |       |       |       |
|2                                    |categories_id              |BIGINT    |20                                            |No        |PK,Fk  |categories.id              |                  |CASCADE on delete & update                   |Foreign key to Categories table                          |       |       |       |       |
|USERS_ROLES Table                    |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |roles_id                   |BIGINT    |20                                            |No        |PK,Fk  |roles.id                   |                  |CASCADE on delete & update                   |Foreign key to Roles table                               |       |       |       |       |
|2                                    |users_id                   |BIGINT    |20                                            |No        |PK,Fk  |users.id                   |                  |CASCADE on delete & update                   |Foreign key to Users table                               |       |       |       |       |
|3                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |-                          |-                 |                                             |Automatically managed by Laravel                         |       |       |       |       |
|4                                    |updated_at                 |TIMESTAMP |                                              |Yes       |       |-                          |-                 |                                             |Automatically managed by Laravel                         |       |       |       |       |
|ROLES_PERMISSIONS Table              |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |permissions_id             |BIGINT    |20                                            |No        |PK,Fk  |permissions.id             |                  |CASCADE on delete & update                   |Foreign key to Permissions table                         |       |       |       |       |
|2                                    |roles_id                   |BIGINT    |20                                            |No        |PK,Fk  |roles.id                   |                  |CASCADE on delete & update                   |Foreign key to Roles table                               |       |       |       |       |
|ORDER_ITEMS Table                    |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |20                                            |No        |PK     |                           |                  |                                             |Auto-incrementing primary key                            |       |       |       |       |
|2                                    |orders_id                  |BIGINT    |20                                            |No        |Fk     |orders.id                  |                  |NO ACTION on delete & update                 |Foreign key to Orders table                              |       |       |       |       |
|3                                    |products_id                |BIGINT    |20                                            |No        |Fk     |products.id                |                  |NO ACTION on delete & update                 |Foreign key to Products table                            |       |       |       |       |
|4                                    |quantity                   |INT       |11                                            |Yes       |       |                           |0                 |                                             |Quantity of the product in the order                     |       |       |       |       |
|5                                    |total_amount               |INT       |11                                            |Yes       |       |                           |0                 |                                             |Total amount for this order item                         |       |       |       |       |
|6                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |                           |Current timestamp |                                             |Automatically managed by Laravel                         |       |       |       |       |
|7                                    |updated_at                 |TIMESTAMP |                                              |Yes       |       |                           |Current timestamp |                                             |Automatically managed by Laravel                         |       |       |       |       |
|COUPONS Table                        |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |PK     |No                         |Auto Increment    |Primary Key                                  |Unique identifier for coupon                             |       |       |       |       |
|2                                    |discount                   |VARCHAR   |45                                            |Yes       |       |No                         |NULL              |                                             |Discount value (percentage or fixed amount)              |       |       |       |       |
|3                                    |expiration_date            |DATETIME  |                                              |Yes       |       |No                         |NULL              |                                             |Coupon expiration date                                   |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record creation time                                     |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record last update time                                  |       |       |       |       |
|USERS_COUPONS Table                  |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |users_id                   |BIGINT    |                                              |No        |PK     |FK (users.id)              |NULL              |Composite Primary Key, Foreign Key           |References users table                                   |       |       |       |       |
|2                                    |coupons_id                 |BIGINT    |                                              |No        |PK     |FK (coupons.id)            |NULL              |Composite Primary Key, Foreign Key           |References coupons table                                 |       |       |       |       |
|3                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |                           |CURRENT_TIMESTAMP |                                             |Record creation time                                     |       |       |       |       |
|4                                    |updated_at                 |TIMESTAMP |                                              |Yes       |       |                           |CURRENT_TIMESTAMP |                                             |Record last update time                                  |       |       |       |       |
|PRODUCTS_COUPONS Table               |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |products_id                |BIGINT    |                                              |No        |PK     |FK (products.id)           |NULL              |Composite Primary Key, Foreign Key           |References products table                                |       |       |       |       |
|2                                    |coupons_id                 |BIGINT    |                                              |No        |PK     |FK (coupons.id)            |NULL              |Composite Primary Key, Foreign Key           |References coupons table                                 |       |       |       |       |
|3                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |                           |CURRENT_TIMESTAMP |                                             |Record creation time                                     |       |       |       |       |
|4                                    |updated_at                 |TIMESTAMP |                                              |Yes       |       |                           |CURRENT_TIMESTAMP |                                             |Record last update time                                  |       |       |       |       |
|LOCATION_HISTORIES Table             |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |PK     |No                         |Auto Increment    |Primary Key                                  |Unique identifier                                        |       |       |       |       |
|2                                    |vehicle_id                 |BIGINT    |                                              |No        |FK     |FK (vehicles.id)           |NULL              |ON DELETE CASCADE                            |References vehicles table                                |       |       |       |       |
|3                                    |location                   |VARCHAR   |255                                           |No        |       |No                         |NULL              |                                             |Location description or address                          |       |       |       |       |
|4                                    |latitude                   |DECIMAL   |10,7                                          |No        |       |No                         |NULL              |                                             |Latitude coordinate                                      |       |       |       |       |
|5                                    |longitude                  |DECIMAL   |10,7                                          |No        |       |No                         |NULL              |                                             |Longitude coordinate                                     |       |       |       |       |
|6                                    |timestamp                  |TIMESTAMP |                                              |Yes       |       |No                         |NULL              |                                             |Location logged time                                     |       |       |       |       |
|7                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record creation time                                     |       |       |       |       |
|8                                    |updated_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record last update time                                  |       |       |       |       |
|USER_ADDRESSES Table                 |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |PK     |No                         |Auto Increment    |Primary Key                                  |Unique identifier                                        |       |       |       |       |
|2                                    |users_id                   |BIGINT    |                                              |No        |FK     |FK (users.id)              |NULL              |ON DELETE CASCADE                            |References users table                                   |       |       |       |       |
|3                                    |address_line1              |VARCHAR   |255                                           |No        |       |No                         |NULL              |                                             |Primary address line                                     |       |       |       |       |
|4                                    |address_line2              |VARCHAR   |255                                           |Yes       |       |No                         |NULL              |                                             |Optional address line                                    |       |       |       |       |
|5                                    |city                       |VARCHAR   |255                                           |No        |       |No                         |NULL              |                                             |City name                                                |       |       |       |       |
|6                                    |state                      |VARCHAR   |255                                           |No        |       |No                         |NULL              |                                             |State or province                                        |       |       |       |       |
|7                                    |postal_code                |VARCHAR   |255                                           |No        |       |No                         |NULL              |                                             |Postal or ZIP code                                       |       |       |       |       |
|8                                    |country                    |VARCHAR   |255                                           |No        |       |No                         |NULL              |                                             |Country name                                             |       |       |       |       |
|9                                    |is_primary                 |BOOLEAN   |                                              |No        |       |No                         |FALSE             |                                             |Indicates primary address                                |       |       |       |       |
|10                                   |created_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record creation time                                     |       |       |       |       |
|11                                   |updated_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record last update time                                  |       |       |       |       |
|ROUTE_OPTIMIZATIONS Table            |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |PK     |No                         |Auto Increment    |Primary Key                                  |Unique identifier                                        |       |       |       |       |
|2                                    |shipments_id               |BIGINT    |                                              |No        |FK     |FK (shipments.id)          |NULL              |ON DELETE CASCADE                            |References shipments table                               |       |       |       |       |
|3                                    |total_distance             |FLOAT     |                                              |No        |       |No                         |NULL              |                                             |Total distance for the route                             |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record creation time                                     |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record last update time                                  |       |       |       |       |
|ROUTE_DETAILS Table                  |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |PK     |No                         |Auto Increment    |Primary Key                                  |Unique identifier                                        |       |       |       |       |
|2                                    |route_optimization_id      |BIGINT    |                                              |Yes       |FK     |FK (route_optimizations.id)|NULL              |ON DELETE SET NULL                           |References route_optimizations table                     |       |       |       |       |
|3                                    |route_condition_id         |BIGINT    |                                              |Yes       |FK     |FK (route_conditions.id)   |NULL              |ON DELETE SET NULL                           |References route_conditions table                        |       |       |       |       |
|4                                    |vehicle_id                 |BIGINT    |                                              |Yes       |FK     |FK (vehicles.id)           |NULL              |ON DELETE SET NULL                           |References vehicles table                                |       |       |       |       |
|5                                    |route_name                 |VARCHAR   |255                                           |No        |       |No                         |NULL              |                                             |Name of the route                                        |       |       |       |       |
|6                                    |supplier_name              |VARCHAR   |255                                           |Yes       |       |No                         |NULL              |                                             |Supplier associated with the route                       |       |       |       |       |
|7                                    |warehouse_name_1           |VARCHAR   |255                                           |No        |       |No                         |NULL              |                                             |First warehouse name                                     |       |       |       |       |
|8                                    |warehouse_name_2           |VARCHAR   |255                                           |Yes       |       |No                         |NULL              |                                             |Second warehouse name (optional)                         |       |       |       |       |
|9                                    |start_location             |VARCHAR   |255                                           |No        |       |No                         |NULL              |                                             |Route starting point                                     |       |       |       |       |
|10                                   |end_location               |VARCHAR   |255                                           |No        |       |No                         |NULL              |                                             |Route ending point                                       |       |       |       |       |
|11                                   |estimated_time             |DATETIME  |                                              |No        |       |No                         |NULL              |                                             |Estimated time for the route                             |       |       |       |       |
|12                                   |start_latitude             |DECIMAL   |10,7                                          |No        |       |No                         |NULL              |                                             |Latitude of start location                               |       |       |       |       |
|13                                   |start_longitude            |DECIMAL   |10,7                                          |No        |       |No                         |NULL              |                                             |Longitude of start location                              |       |       |       |       |
|14                                   |end_latitude               |DECIMAL   |10,7                                          |No        |       |No                         |NULL              |                                             |Latitude of end location                                 |       |       |       |       |
|15                                   |end_longitude              |DECIMAL   |10,7                                          |No        |       |No                         |NULL              |                                             |Longitude of end location                                |       |       |       |       |
|16                                   |distance                   |FLOAT     |                                              |No        |       |No                         |NULL              |                                             |Total distance of the route                              |       |       |       |       |
|17                                   |created_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record creation time                                     |       |       |       |       |
|18                                   |updated_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record last update time                                  |       |       |       |       |
|CHATBOTS Table                       |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |PK     |No                         |Auto Increment    |Primary Key                                  |Unique identifier                                        |       |       |       |       |
|2                                    |user_id                    |VARCHAR   |255                                           |No        |       |No                         |NULL              |                                             |User ID associated with the chatbot                      |       |       |       |       |
|3                                    |history                    |JSON      |                                              |No        |       |No                         |NULL              |                                             |Stores chat history as JSON                              |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record creation time                                     |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record last update time                                  |       |       |       |       |
|FOLLOWS Table                        |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |PK     |No                         |Auto Increment    |Primary Key                                  |Unique identifier for follow record                      |       |       |       |       |
|2                                    |follower_id                |BIGINT    |                                              |No        |FK     |FK (users.id)              |NULL              |ON DELETE CASCADE                            |References the user who follows                          |       |       |       |       |
|3                                    |following_id               |BIGINT    |                                              |No        |FK     |FK (users.id)              |NULL              |ON DELETE CASCADE                            |References the user being followed                       |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |Record creation time                         |                                                         |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |Record last update time                      |                                                         |       |       |       |       |
|6                                    |(follower_id, following_id)|�         |�                                             |No        |       |No                         |�                 |Unique                                       |Ensures one follow relationship between two users        |       |       |       |       |
|BLOCK Table                          |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |PK     |No                         |Auto Increment    |Primary Key                                  |Unique identifier for block record                       |       |       |       |       |
|2                                    |blocker_id                 |BIGINT    |                                              |No        |FK     |FK (users.id)              |NULL              |ON DELETE CASCADE                            |References the user who blocks                           |       |       |       |       |
|3                                    |blocked_id                 |BIGINT    |                                              |No        |FK     |FK (users.id)              |NULL              |ON DELETE CASCADE                            |References the user being blocked                        |       |       |       |       |
|4                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |Record creation time                         |                                                         |       |       |       |       |
|5                                    |updated_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |Record last update time                      |                                                         |       |       |       |       |
|6                                    |(blocker_id, blocked_id)   |�         |�                                             |No        |       |No                         |�                 |Unique                                       |Ensures no duplicate block relationship between two users|       |       |       |       |
|STREAMS Table                        |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |PK     |No                         |Auto Increment    |Primary Key                                  |Unique identifier for stream record                      |       |       |       |       |
|2                                    |title                      |VARCHAR   |255                                           |No        |       |No                         |NULL              |                                             |Stream title                                             |       |       |       |       |
|3                                    |thumbnail                  |VARCHAR   |255                                           |Yes       |       |No                         |NULL              |                                             |Optional thumbnail image URL                             |       |       |       |       |
|4                                    |ingressId                  |VARCHAR   |255                                           |Yes       |       |No                         |NULL              |Unique                                       |Optional unique ingress ID                               |       |       |       |       |
|5                                    |serverUrl                  |VARCHAR   |255                                           |Yes       |       |No                         |NULL              |                                             |Server URL for streaming                                 |       |       |       |       |
|6                                    |streamKey                  |VARCHAR   |255                                           |Yes       |       |No                         |NULL              |                                             |Stream key for broadcast                                 |       |       |       |       |
|7                                    |isLive                     |BOOLEAN   |                                              |No        |       |No                         |FALSE             |                                             |Indicates if stream is live                              |       |       |       |       |
|8                                    |isChatEnabled              |BOOLEAN   |                                              |No        |       |No                         |TRUE              |                                             |Indicates if chat is enabled                             |       |       |       |       |
|9                                    |isChatDelayed              |BOOLEAN   |                                              |No        |       |No                         |FALSE             |                                             |Indicates if chat is delayed                             |       |       |       |       |
|10                                   |isChatFollowersOnly        |BOOLEAN   |                                              |No        |       |No                         |FALSE             |                                             |Indicates if chat is followers-only                      |       |       |       |       |
|11                                   |user_id                    |BIGINT    |                                              |No        |FK     |FK (users.id)              |NULL              |ON DELETE CASCADE                            |References the user who owns the stream                  |       |       |       |       |
|12                                   |created_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record creation time                                     |       |       |       |       |
|13                                   |updated_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record last update time                                  |       |       |       |       |
|STREAM_MESSAGES Table                |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |PK     |No                         |Auto Increment    |Primary Key                                  |Unique identifier for message                            |       |       |       |       |
|2                                    |message                    |TEXT      |                                              |No        |       |No                         |NULL              |                                             |Message content                                          |       |       |       |       |
|3                                    |creator_id                 |BIGINT    |                                              |No        |FK     |FK (users.id)              |NULL              |                                             |References the creator of the message                    |       |       |       |       |
|4                                    |viewer_id                  |BIGINT    |                                              |No        |FK     |FK (users.id)              |NULL              |                                             |References the viewer of the message                     |       |       |       |       |
|5                                    |stream_id                  |BIGINT    |                                              |No        |FK     |FK (streams.id)            |NULL              |                                             |References the related stream                            |       |       |       |       |
|6                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record creation time                                     |       |       |       |       |
|7                                    |updated_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record last update time                                  |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|STREAM_GIFTS Table                   |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|                                     |                           |          |                                              |          |       |                           |                  |                                             |                                                         |       |       |       |       |
|No                                   |FieldName                  |DataType  |DataSize                                      |AllowNull |Key    |ForeignKey                 |DefaultValue      |Constraint                                   |Notes                                                    |       |       |       |       |
|1                                    |id                         |BIGINT    |                                              |No        |PK     |No                         |Auto Increment    |Primary Key                                  |Unique identifier for gift record                        |       |       |       |       |
|2                                    |owner_id                   |BIGINT    |                                              |Yes       |FK     |FK (users.id)              |NULL              |                                             |References the user who owns the gift                    |       |       |       |       |
|3                                    |stream_id                  |BIGINT    |                                              |Yes       |FK     |FK (streams.id)            |NULL              |                                             |References the related stream                            |       |       |       |       |
|4                                    |gift_type                  |ENUM      |['lion','flower','star','heart']              |No        |       |No                         |NULL              |                                             |Type of gift (lion, flower, star, heart)                 |       |       |       |       |
|5                                    |price                      |DECIMAL   |8,2                                           |No        |       |No                         |NULL              |                                             |Price of the gift                                        |       |       |       |       |
|6                                    |created_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record creation time                                     |       |       |       |       |
|7                                    |updated_at                 |TIMESTAMP |                                              |Yes       |       |No                         |CURRENT_TIMESTAMP |                                             |Record last update time                                  |       |       |       |       |


# Core E-Commerce System (Database Design & Normalization)

---

## 1. ORDERS and USERS
**Relationship type:** One-to-Many (optional on Orders side)

- One User can place many Orders  
- An Order may belong to one User or none (guest order)

**Normalization applied:**
- User information is stored only in USERS
- Orders store only `user_id` as a foreign key
- Removes duplicated user data in Orders

**Normal form achieved:** 3NF  
All non-key attributes depend only on `order.id`

---

## 2. ORDERS and ORDER_ITEMS
**Relationship type:** One-to-Many

- One Order contains many Order Items  
- Each Order Item belongs to exactly one Order  

**Why this exists:**
- Prevents repeating product data inside Orders
- Each row represents one product in an order

**Normalization applied:**
- Eliminates repeating groups
- Attributes depend fully on primary key

**Normal form achieved:** 1NF, 2NF, 3NF

---

## 3. PRODUCTS and ORDER_ITEMS
**Relationship type:** One-to-Many

- One Product can appear in many Order Items  
- Each Order Item references one Product  

**Normalization applied:**
- Product details stored once in PRODUCTS
- Only references stored in ORDER_ITEMS

**Benefit:**
- No duplication of product info

**Normal form achieved:** 3NF

---

## 4. ORDERS and PRODUCTS (Resolved Many-to-Many)
**Relationship type:** Many-to-Many (via ORDER_ITEMS)

- Order → many Products  
- Product → many Orders  

**Normalization applied:**
- Junction table resolves relationship
- Prevents duplication and update anomalies

**Normal form achieved:** 3NF / BCNF

---

## 5. PRODUCTS and CATEGORIES
**Relationship type:** Many-to-Many (via PRODUCTS_CATEGORIES)

- Product can belong to multiple categories  
- Category can contain multiple products  

**Normalization applied:**
- Categories stored once
- No multi-value fields in PRODUCTS

**Normal form achieved:** 3NF

---

## 6. USERS and ROLES
**Relationship type:** Many-to-Many

- User can have multiple roles  
- Role can belong to multiple users  

**Normalization applied:**
- Roles separated from USERS
- Junction table used

**Normal form achieved:** 3NF

---

## 7. USERS and COUPONS
**Relationship type:** Many-to-Many

- User can have multiple coupons  
- Coupon can be assigned to multiple users  

**Normalization applied:**
- Coupon stored once
- Assignment handled via junction table

**Normal form achieved:** 3NF

---

## 8. PRODUCTS and COUPONS
**Relationship type:** Many-to-Many

- Product can have multiple coupons  
- Coupon can apply to multiple products  

**Normalization applied:**
- Avoids repeating coupon data

**Normal form achieved:** 3NF

---

## 9. USERS and FEEDBACK_FORMS
**Relationship type:** One-to-Many

- One User can submit many Feedback Forms  

**Normalization applied:**
- User data not duplicated in feedback

**Normal form achieved:** 3NF

---

## 10. ORDERS and FEEDBACK_FORMS
**Relationship type:** One-to-Many (optional)

- Order may have multiple feedback entries  
- Feedback may exist without an order  

**Normalization applied:**
- Optional foreign key design

**Normal form achieved:** 3NF

---

## 11. FEEDBACK_FORMS and QUESTIONS
**Relationship type:** One-to-Many

- One Form contains many Questions  

**Normalization applied:**
- Questions separated for flexibility

**Normal form achieved:** 3NF

---

## 12. FEEDBACK_FORMS and ANSWERS
**Relationship type:** One-to-Many

- One Form has multiple Answer sets  

**Normalization applied:**
- Submission data separated from structure

**Normal form achieved:** 3NF

---

## 13. QUESTIONS and ANSWERS
**Relationship type:** Many-to-Many

- Questions can have multiple Answers  
- Answer sets contain multiple Questions  

**Implementation:**
- FEEDBACK_FORM_QUESTION_ANSWERS junction table

**Normalization applied:**
- Removes repeating answer columns

**Normal form achieved:** 3NF / BCNF

---

## 14. PRODUCTS and RATINGS
**Relationship type:** One-to-Many

- One Product can receive many Ratings  

**Normalization applied:**
- Ratings stored separately

**Normal form achieved:** 3NF

---

## 15. SHIPMENTS and RATINGS
**Relationship type:** One-to-Many

- One Shipment can have multiple Ratings  

**Normalization applied:**
- Ensures only delivered products are rated

**Normal form achieved:** 3NF

---

## 16. ORDERS and PAYMENTS
**Relationship type:** One-to-Many (optional)

- One Order can have multiple Payments  
- Payment may exist without Order  

**Normalization applied:**
- Supports partial payments
- Financial separation

**Normal form achieved:** 3NF

---

## 17. PAYMENTS and INVOICES
**Relationship type:** One-to-One (mandatory on Invoice side)

- Each Invoice belongs to one Payment  
- Payment may generate one Invoice  

**Normalization applied:**
- Prevents duplication of financial records
- Clear separation of payment vs invoice

**Normal form achieved:** BCNF

# User & Role Management (RBAC System Design)

---

## 1. USERS Table (Core / Parent Entity)

### Role in the system
The `USERS` table is the central entity. Everything else extends user capabilities (roles, permissions) or stores related profile data.

### Normalization applied
- **1NF:** All fields are atomic (no repeating groups)
- **2NF:** All non-key attributes depend on primary key (`id`)
- **3NF:** No transitive dependencies

### Design notes
- Roles and permissions are NOT stored directly in USERS
- Prevents duplication of security-related data

### Why this is good
- Prevents duplication of role/permission data
- Keeps authentication and profile data cleanly separated

---

## 2. USERS ↔ ROLES (Many-to-Many via USERS_ROLES)

### Table: `USERS_ROLES` (Junction Table)

### Relationship type
- Many-to-Many  
  - One user → multiple roles  
  - One role → multiple users  

### Why a junction table is needed
Relational databases cannot store many-to-many relationships directly.

### Normalization applied
- **3NF:** Only foreign keys and timestamps
- No duplicated role or user data

### Composite Primary Key
- `(user_id, role_id)` ensures unique assignments

### Benefit
- Flexible role assignment
- Easy role updates without modifying USERS table

---

## 3. ROLES ↔ PERMISSIONS (Many-to-Many via ROLES_PERMISSIONS)

### Table: `ROLES_PERMISSIONS`

### Relationship type
- Many-to-Many  
  - One role → multiple permissions  
  - One permission → multiple roles  

### Normalization applied
- **3NF:** Permissions defined once and reused
- No duplication of permission data

### Composite Primary Key
- Ensures unique role–permission pairs

### Why this matters
- Enables scalable Role-Based Access Control (RBAC)
- Avoids hardcoding permissions into users

---

## 4. ROLES Table (Lookup / Authority Entity)

### Role in system
Defines what a role is (not who has it)

### Normalization applied
- **3NF:** Role data stored once
- No dependency beyond pivot tables

### Benefit
- Roles can evolve without affecting user assignments

---

## 5. PERMISSIONS Table (Capability Definition)

### Role in system
Represents actions or rights (e.g., `edit_user`, `delete_post`)

### Normalization applied
- **3NF:** Permissions stored once and reused

### Benefit
- Fine-grained access control
- No duplication across roles

---

## 6. USERS ↔ USER_ADDRESSES (One-to-Many)

### Table: `USER_ADDRESSES`

### Relationship type
- One-to-Many  
  - One user → multiple addresses  
  - One address → one user  

### Normalization applied
- **1NF:** Each address stored as a separate row
- **2NF:** Attributes depend on `address_id`
- **3NF:** Address data separated from USERS

### Why this is important
- Avoids repeating address fields in USERS
- Supports multiple addresses per user

### Extra note
- `is_primary` allows selecting default address without breaking normalization

---

## 7. Cascading Rules & Referential Integrity

### Foreign key constraints
- `ON DELETE CASCADE` ensures:
  - Deleting a user removes related roles and addresses
  - Deleting roles/permissions cleans up mappings

### Normalization impact
- Maintains referential integrity
- Prevents orphan records
- Keeps database consistent automatically

# Logistics, Supply Chain & Warehousing Module (Database Design & Normalization)

---

## 1. WAREHOUSES ↔ USERS (One-to-Many)

### Relationship
- One user can manage multiple warehouses  
- Each warehouse belongs to one user  

### Implementation
- `warehouses.user_id` → foreign key to `users.id`

### Normalization
- **3NF**
  - User data is not duplicated in WAREHOUSES
  - Warehouse attributes stored only once
  - Eliminates redundancy in ownership data

### Design benefit
- Warehouses can be reassigned without schema changes
- Clear ownership and access control

---

## 2. WAREHOUSES ↔ INVENTORY ↔ PRODUCTS (Many-to-Many resolved)

### Associative entity: INVENTORY

### Relationship
- One warehouse stores many products  
- One product exists in many warehouses  

### Normalization
- **3NF**
  - Product data remains in PRODUCTS
  - Warehouse data remains in WAREHOUSES
  - Inventory-specific data (stock, weight, etc.) stored only in INVENTORY

### Why this is normalized
- Prevents duplication of product stock data
- Avoids repeating warehouse/product attributes

---

## 3. VEHICLES ↔ USERS (Optional One-to-Many)

### Relationship
- One user (driver) may operate multiple vehicles  
- Each vehicle may have one or no driver  

### Normalization
- **3NF**
  - Driver data not embedded in VEHICLES
  - Nullable foreign key supports flexibility

### Benefit
- Vehicles exist independently of drivers
- Drivers can be reassigned easily

---

## 4. VEHICLES ↔ VEHICLE_MANAGEMENT (One-to-One / One-to-Many)

### Relationship
- Each vehicle has a management record
- Tracks operational and maintenance metrics

### Normalization
- **3NF**
  - Static vehicle data separated from operational data

### Why this matters
- Reduces update load on VEHICLES
- Enables historical tracking

---

## 5. VEHICLE_MANAGEMENT ↔ USERS (One-to-Many)

### Relationship
- One user manages multiple vehicle records  
- Each record belongs to one user  

### Normalization
- **3NF**
  - Ownership stored once
  - USERS remain source of truth

---

## 6. VEHICLES ↔ LOCATION_HISTORIES (One-to-Many)

### Relationship
- One vehicle has many location records  
- Each record belongs to one vehicle  

### Normalization
- **1NF:** Each location entry is atomic
- **3NF:** Vehicle data not duplicated per record

### Benefit
- Enables time-series tracking
- Efficient GPS history storage

---

## 7. SHIPMENTS ↔ PROVIDERS (One-to-Many)

### Relationship
- One provider handles many shipments  
- Each shipment has one provider  

### Normalization
- **3NF**
  - Provider data stored once
  - Referenced via foreign key

---

## 8. SHIPMENTS ↔ ORDERS (One-to-Many / One-to-One)

### Relationship
- One order may create multiple shipments  
- Each shipment belongs to one order  

### Normalization
- **3NF**
  - Order data stays in ORDERS
  - Shipment lifecycle separated

### Benefit
- Supports partial fulfillment
- Avoids duplication of order data

---

## 9. SHIPMENTS ↔ ROUTE_OPTIMIZATIONS (One-to-Many)

### Relationship
- One shipment can have multiple route optimizations  
- Each optimization belongs to one shipment  

### Normalization
- **3NF**
  - Optimization results stored separately

### Benefit
- Supports route history and comparisons

---

## 10. ROUTE_OPTIMIZATIONS ↔ ROUTE_DETAILS (One-to-Many)

### Relationship
- One optimization generates multiple route details  
- Each detail belongs to one optimization  

### Normalization
- **3NF**
  - Route metadata separated from results

---

## 11. ROUTE_DETAILS ↔ ROUTE_CONDITIONS (Many-to-One)

### Relationship
- Many route details reference one condition set  

### Normalization
- **3NF**
  - Weather/traffic data stored once

### Benefit
- Consistent condition tracking
- Easier updates and reuse

---

## 12. ROUTE_DETAILS ↔ VEHICLES (Many-to-One)

### Relationship
- One vehicle can appear in many route details  
- Each route detail references one vehicle (optional)

### Normalization
- **3NF**
  - Vehicle specs not duplicated in routes

### Benefit
- Supports vehicle reassignment

---

## 13. ENUM Usage & Normalization Note

### ENUM in ROUTE_CONDITIONS

- Controlled denormalization for performance

### Trade-offs
- Faster reads  
- Less flexible than lookup tables  

### Why it’s acceptable
- Improves query performance
- Simplifies condition classification

# Livestream Shopping System (Database Design & Normalization)

---

## 1. USERS ↔ STREAMS (One-to-Many)

### Relationship
- One user can create and own many streams  
- Each stream belongs to exactly one user  

### Implementation
- `streams.user_id` → references `users.id`

### Normalization
- **3NF**
  - User data is not duplicated in STREAMS
  - Stream-specific attributes (live state, keys, config) stored only in STREAMS

### Why this is normalized
- Prevents duplication of ownership data
- Supports unlimited streams per user

---

## 2. STREAMS ↔ STREAM_MESSAGES ↔ USERS

### Relationship
- One stream has many messages  
- One user can send many messages  
- Messages reference users in roles:
  - sender (creator)
  - participant (viewer context)

### Normalization
- **1NF:** Each message is atomic
- **3NF:** No duplication of user or stream data

### Design benefit
- Clean separation of:
  - message content
  - user identity
  - stream context

- Supports chat history, moderation, analytics

---

## 3. USERS ↔ STREAM_GIFTS ↔ STREAMS (Many-to-Many resolved)

### Associative entity: STREAM_GIFTS

### Relationship
- Users can send many gifts  
- Streams can receive many gifts  

### Normalization
- **3NF**
  - USERS store identity only
  - STREAMS store stream metadata only
  - STREAM_GIFTS stores transactional data only

### ENUM usage
- Gift type is constrained using ENUM (controlled denormalization)

### Why this works
- No duplication of gift data
- Enables analytics (total gifts per user/stream)

---

## 4. USERS ↔ FOLLOWS ↔ USERS (Self-referencing Many-to-Many)

### Table: FOLLOWS

### Relationship
- Users can follow many users  
- Users can be followed by many users  

### Normalization
- **3NF**
  - No profile duplication
  - Only relationship data stored

### Constraints
- Composite unique constraint:
  - prevents duplicate follow relationships

### Why this is normalized
- Prevents storing follower lists inside USERS
- Enables scalable social graph structure

---

## 5. STREAMS ↔ STREAM_GIFTS (One-to-Many)

### Relationship
- One stream receives many gifts  
- Each gift belongs to one stream  

### Normalization
- **3NF**
  - Stream metadata not duplicated
  - Gifts are independent records

### Benefit
- Enables revenue tracking per stream
- Full audit trail of gift activity

---

## 6. STREAMS ↔ STREAM_MESSAGES (One-to-Many)

### Relationship
- One stream has many messages  
- Each message belongs to one stream  

### Normalization
- **3NF**
  - Stream data not repeated in messages

### Why this matters
- Prevents large data bloating in STREAMS
- Supports pagination and moderation

---

## 7. USERS ↔ STREAM_MESSAGES (One-to-Many)

### Relationship
- One user can author many messages  
- Each message belongs to one user  

### Normalization
- **3NF**
  - User identity stored once
  - Messages remain independent of profile changes

---

## 8. Constraints & Data Integrity

### Unique constraints
- `ingressId` → ensures unique stream endpoints
- `(follower_id, following_id)` → prevents duplicate follows

### ON DELETE CASCADE
When a user is deleted:
- Streams are removed
- Follows are removed
- Messages are removed
- Gifts are removed

### Normalization benefit
- Maintains referential integrity
- Prevents orphan records
- No manual cleanup required

# Social Media & Chatting Features (Database Design & Normalization)

---

## 1. USERS ↔ GROUPS (One-to-Many: Ownership)

### Relationship
- One user can own multiple groups  
- Each group has exactly one owner  

### Normalization
- **3NF**
  - Ownership stored via foreign key
  - No duplication of user data in GROUPS

### Why this is normalized
- Prevents repeating owner information
- Supports ownership transfer without schema changes

---

## 2. USERS ↔ GROUPS (Many-to-Many via GROUP_USERS)

### Relationship
- Users can join many groups  
- Groups can have many users  

### Normalization
- **3NF**
  - GROUP_USERS stores only relationships
  - No duplication of user or group attributes

### Benefit
- Scales to large memberships
- Allows future extension (roles, permissions)

---

## 3. USERS ↔ CONVERSATIONS (Private Chat Model)

### Relationship
- Conversation represents a chat between two users  
- Users can have many conversations  

### Normalization
- **3NF**
  - Conversations are independent entities
  - No user data duplication

### Why this is correct
- Avoids embedding chat threads in USERS
- Centralized message history per conversation

---

## 4. CONVERSATIONS ↔ MESSAGES (One-to-Many)

### Relationship
- One conversation contains many messages  
- Each message belongs to one conversation  

### Normalization
- **1NF:** Atomic message records  
- **3NF:** No repetition of conversation data  

---

## 5. GROUPS ↔ MESSAGES (One-to-Many)

### Relationship
- Groups can have many messages  
- Messages may belong to a group  

### Normalization
- **3NF**
  - Group data not duplicated in messages
  - Nullable foreign key supports unified messaging

### Benefit
- Single messaging system for both group & private chats
- Avoids separate message tables

---

## 6. USERS ↔ MESSAGES (One-to-Many)

### Relationship
- One user sends many messages  
- Each message has one sender  

### Normalization
- **3NF**
  - User identity stored once
  - Messages reference users

---

## 7. MESSAGES ↔ MESSAGE_ATTACHMENTS (One-to-Many)

### Relationship
- One message can have many attachments  
- Each attachment belongs to one message  

### Normalization
- **3NF**
  - Attachment data separated from messages

### Benefit
- Supports unlimited attachments
- Keeps messages lightweight

---

## 8. USERS ↔ POSTS (One-to-Many)

### Relationship
- One user can create many posts  
- Each post has one author  

### Normalization
- **3NF**
  - Author referenced via foreign key
  - No duplication of user data

---

## 9. POSTS ↔ COMMENTS ↔ USERS

### Relationship
- One post → many comments  
- One user → many comments  
- Each comment belongs to one post and one user  

### Normalization
- **3NF**
  - Comment data stored once
  - Relationships referenced via foreign keys

### Benefit
- Clean moderation and analytics
- Efficient comment retrieval

---

## 10. POSTS ↔ LIKES ↔ USERS (Many-to-Many resolved)

### Relationship
- Users can like many posts  
- Posts can be liked by many users  

### Normalization
- **3NF**
  - LIKE table stores only relationships

### Why this is correct
- Prevents storing like arrays in POSTS
- Ensures unique user-post likes

---

## 11. USERS ↔ NOTIFICATIONS (One-to-Many)

### Relationship
- Users receive many notifications  
- Each notification belongs to one user  

### Normalization
- **3NF**
  - Notification data is isolated
  - References optional related entities

### Benefit
- Supports flexible notification types
- Works for system + user events

---

## 12. USERS ↔ CONNECTION_REQUESTS (Self-referencing with state)

### Relationship
- Users send and receive connection requests  

### Normalization
- **3NF**
  - Relationship state stored once (pending/accepted/rejected)
  - User references only

### Why this matters
- Separates request lifecycle from final connections
- Prevents ambiguous states

---

## 13. USERS ↔ USER_CONNECTIONS (Established Relationships)

### Relationship
- Represents accepted user connections  

### Normalization
- **3NF**
  - Stored independently of requests
  - Composite unique constraint prevents duplicates

### Benefit
- Clean social graph representation
- Efficient querying

---

## 14. USERS ↔ BLOCK (Self-referencing Many-to-Many)

### Relationship
- Users can block multiple users  
- Users can be blocked by multiple users  

### Normalization
- **3NF**
  - Block relations stored once
  - No duplication of user data

### Why this is important
- Enforces privacy rules
- Prevents duplicate block states

---

## 15. Overall Normalization Assessment

- **1NF:** All attributes are atomic  
- **2NF:** All non-key attributes depend on full primary key  
- **3NF:** No transitive dependencies  
- **Near BCNF:** Controlled ENUM usage is acceptable denormalization


# Sequence Diagrams
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%209.58.14%20PM.png)
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%209.58.38%20PM.png)
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%209.58.59%20PM.png)
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%209.59.21%20PM.png)
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%209.59.39%20PM.png)
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%209.59.56%20PM.png)
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%2010.00.27%20PM.png)
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%2010.09.14%20PM.png)
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%2010.09.39%20PM.png)
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%2010.10.00%20PM.png)
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%2010.10.15%20PM.png)
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%2010.10.38%20PM.png)
![Diagram](docs/Sequence-Diagram/Screenshot%202026-04-03%20at%2010.11.02%20PM.png)
![Diagram](docs/Sequence-Diagram/Untitled-2.png)
![Diagram](docs/Sequence-Diagram/Untitled-3.png)
![Diagram](docs/Sequence-Diagram/Untitled-4.png)
![Diagram](docs/Sequence-Diagram/Untitled-5.png)
![Diagram](docs/Sequence-Diagram/Untitled-6.png)
![Diagram](docs/Sequence-Diagram/Untitled-7.png)
![Diagram](docs/Sequence-Diagram/Untitled-8.png)
![Diagram](docs/Sequence-Diagram/Untitled-9.png)
![Diagram](docs/Sequence-Diagram/Untitled-10.png)
![Diagram](docs/Sequence-Diagram/Untitled-11.png)
![Diagram](docs/Sequence-Diagram/Untitled-12.png)
![Diagram](docs/Sequence-Diagram/Untitled-13.png)
![Diagram](docs/Sequence-Diagram/Untitled-14.png)
![Diagram](docs/Sequence-Diagram/Untitled-15.png)
![Diagram](docs/Sequence-Diagram/Untitled-16.png)
![Diagram](docs/Sequence-Diagram/Untitled-17.png)
![Diagram](docs/Sequence-Diagram/Untitled-18.png)
![Diagram](docs/Sequence-Diagram/Untitled-19.png)
![Diagram](docs/Sequence-Diagram/Untitled-20.png)



# Other Screenshots

![Screenshot](docs/Other/Screenshot%202026-05-11%20at%209.31.06%20PM.png)
![Screenshot](docs/Other/Screenshot%202026-05-11%20at%209.31.33%20PM.png)
![Screenshot](docs/Other/Screenshot%202026-05-11%20at%209.31.49%20PM.png)
![Screenshot](docs/Other/Screenshot%202026-05-11%20at%209.32.10%20PM.png)
