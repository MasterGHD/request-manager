# Order Manager - Symfony 7 Application

A modern Symfony 7 application for order management with Material Design Bootstrap, Redis caching, and RabbitMQ messaging.

## Features

- **Framework**: Symfony 7.3+ with PHP 8.4
- **Asset Management**: Webpack Encore with compression (Gzip & Brotli)
- **UI/UX**: Material Design Bootstrap (MDB) v5
- **Database**: MySQL 8.0 with Doctrine ORM
- **Caching**: Redis for sessions and application cache
- **Messaging**: RabbitMQ with Symfony Messenger
- **Authentication**: Symfony Security with form login
- **Development**: Docker Compose environment

## Requirements

- **PHP** 8.4 or higher
- **Node.js** 18.x or higher
- **Composer** 2.x
- **Docker** and **Docker Compose** (for local development)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd gestorpedidos_symfony

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 2. Environment Configuration

Copy the environment file and configure your local settings:

```bash
cp .env .env.local
```

Edit `.env.local` if you need to customize any settings. The default configuration works out of the box with Docker.

### 3. Start Docker Services

Start all required services (MySQL, Redis, RabbitMQ):

```bash
docker compose up -d
```

This will start:
- **MySQL 8.0** on port `33377`
- **Redis 7** on port `6379`
- **RabbitMQ 3.13** on ports `5672` (AMQP) and `15672` (Management UI)

### 4. Database Setup

Create the database and run migrations:

```bash
# Create database
php bin/console doctrine:database:create

# Run migrations
php bin/console doctrine:migrations:migrate
```

### 5. Build Assets

Build frontend assets with Webpack Encore:

```bash
# Development build
npm run dev

# Development with watch mode
npm run watch

# Production build (with compression)
npm run build
```

### 6. Create Admin User

Create your first user account:

```bash
php bin/console app:create-user
```

Follow the interactive prompts to create a user. Use the admin option for admin privileges.

### 7. Start Development Server

```bash
symfony serve
```

Or use PHP's built-in server:

```bash
php -S localhost:8000 -t public/
```

Your application will be available at: **http://localhost:8000**

## Docker Services

### Service URLs

- **Application**: http://localhost:8000
- **RabbitMQ Management**: http://localhost:15672 (user: `app`, password: `!ChangeMe!`)

### Docker Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f database
docker compose logs -f redis
docker compose logs -f rabbitmq

# Restart a service
docker compose restart redis

# Remove all containers and volumes
docker compose down -v
```

## Makefile Commands

Common development tasks:

```bash
# Start all services
make up

# Start services in detached mode
make up-d

# Stop all services
make down

# Rebuild containers
make build

# Install all dependencies
make install

# Run database migrations
make migrate

# Generate migration from entity changes
make migration

# Load fixtures
make fixtures

# Clear cache
make cache-clear

# Run all tests
make test

# Run specific test suite
make test-unit
make test-functional
make test-integration

# Code quality checks
make cs-fix        # Fix code style
make cs-check      # Check code style
make stan          # Run static analysis
make lint          # Run all linters
make rector        # Run automatic refactoring

# Assets
make assets-dev    # Build assets for development
make assets-watch  # Watch assets for changes
make assets-build  # Build assets for production

# Symfony console shortcuts
make console c="command" # Run any Symfony console command

# Docker commands
make logs          # View all logs
make logs-app      # View app logs
make logs-db       # View database logs
make logs-redis    # View redis logs
make logs-rabbitmq # View rabbitmq logs
```

## Application Structure

```
├── assets/              # Frontend assets (JS, CSS, images)
│   ├── app.js          # Main JavaScript entry point
│   └── styles/         # CSS/SCSS files
├── config/             # Symfony configuration
│   ├── packages/       # Bundle configurations
│   └── routes/         # Route definitions
├── migrations/         # Database migrations
├── public/             # Web root directory
│   └── build/          # Compiled assets (auto-generated)
├── src/
│   ├── Command/        # Console commands
│   ├── Controller/     # Application controllers
│   ├── Entity/         # Doctrine entities
│   └── Repository/     # Doctrine repositories
├── templates/          # Twig templates
│   ├── auth/           # Authentication templates
│   ├── layouts/        # Base layouts
│   └── partials/       # Reusable components
└── tests/              # PHPUnit tests
```

## Configuration Details

### Redis Configuration

- **Cache**: Used for application caching (production only, filesystem in dev)
- **Sessions**: Stores user sessions (production only, filesystem in dev)
- **URL**: `redis://127.0.0.1:6379`

### RabbitMQ Configuration

- **Messenger Transport**: Async message processing
- **Management UI**: Access at http://localhost:15672
- **Default credentials**: user `app`, password `!ChangeMe!`
- **Retry Strategy**: 3 retries with exponential backoff

### Database Configuration

- **Type**: MySQL 8.0
- **Host**: 127.0.0.1
- **Port**: 33377
- **Database**: app
- **User**: app
- **Password**: !ChangeMe!

## Authentication

The application uses Symfony Security with form-based authentication:

- **Login Route**: `/auth/login`
- **Dashboard**: `/` (requires authentication)
- **Logout**: `/logout`

All routes except `/auth/login` require `ROLE_USER` authentication.

## Asset Management

Assets are managed with Webpack Encore:

- **Entry Point**: `assets/app.js` imports all CSS and JS
- **Compression**: Automatic Gzip and Brotli compression in production
- **Versioning**: Asset versioning for cache busting
- **Source Maps**: Enabled in development

### Available Scripts

```bash
npm run dev          # Build for development
npm run watch        # Build and watch for changes
npm run build        # Build for production with compression
```

## Symfony Messenger

Process async messages with workers:

```bash
# Start a worker for async transport
php bin/console messenger:consume async -vv

# Check failed messages
php bin/console messenger:failed:show

# Retry failed messages
php bin/console messenger:failed:retry
```

## Development Tools

### Code Quality

```bash
# PHP CS Fixer
vendor/bin/php-cs-fixer fix

# PHPStan
vendor/bin/phpstan analyse

# Rector (for automatic refactoring)
vendor/bin/rector process
```

### Testing

```bash
# Run all tests
php bin/phpunit

# Run with coverage
php bin/phpunit --coverage-html coverage/
```

## Troubleshooting

### Port Already in Use

If you get port conflicts, edit `.env.local`:

```bash
MYSQL_PORT=33378
REDIS_PORT=6380
RABBITMQ_PORT=5673
RABBITMQ_MANAGEMENT_PORT=15673
```

### Clear Cache

```bash
php bin/console cache:clear
```

### Reset Database

```bash
php bin/console doctrine:database:drop --force
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

## Production Deployment

1. Set `APP_ENV=prod` in `.env.local`
2. Update database credentials and service URLs
3. Build assets: `npm run build`
4. Clear and warm up cache: `php bin/console cache:clear`
5. Run migrations: `php bin/console doctrine:migrations:migrate --no-interaction`
6. Configure your web server (Nginx/Apache) to point to `public/`

## License

This project is licensed under the MIT License.

---
Built with Symfony 7.3, Material Design Bootstrap, and modern best practices.
