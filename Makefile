# Makefile for Symfony 7 Project (WSL2 Compatible)
# Usage: make [target]

.PHONY: help install update serve stop build watch dev clear cache-clear db-create db-migrate db-fixtures test lint fix check deploy

# Default target - show help
.DEFAULT_GOAL := help

## —— 🎯 Symfony Makefile ——————————————————————————————————————
help: ## Show this help message
	@echo "Symfony 7 + Tailwind CSS + DaisyUI Project"
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— 🔧 Setup & Installation ——————————————————————————————————
install: ## Install dependencies (PHP + Node.js)
	@echo "📦 Installing PHP dependencies..."
	symfony composer install
	@echo "📦 Installing Node.js dependencies..."
	npm install
	@echo "✅ Dependencies installed!"

update: ## Update dependencies
	@echo "📦 Updating PHP dependencies..."
	symfony composer update
	@echo "📦 Updating Node.js dependencies..."
	npm update
	@echo "✅ Dependencies updated!"

## —— 🚀 Development Server —————————————————————————————————————
serve: ## Start Symfony development server
	@echo "🚀 Starting Symfony server..."
	symfony server:start -d
	@echo "✅ Server started at https://127.0.0.1:8000"

serve-log: ## Start server and follow logs
	@echo "🚀 Starting Symfony server with logs..."
	symfony server:start

stop: ## Stop Symfony development server
	@echo "🛑 Stopping Symfony server..."
	symfony server:stop
	@echo "✅ Server stopped!"

status: ## Show server status
	symfony server:status

open: ## Open application in browser
	symfony open:local

## —— 🎨 Assets & Build ————————————————————————————————————————
build: ## Build production assets (with compression)
	@echo "🔨 Building production assets..."
	npm run build
	@echo "✅ Assets built successfully!"

watch: ## Watch assets for changes (development)
	@echo "👀 Watching assets..."
	npm run watch

dev: ## Build development assets
	@echo "🔨 Building development assets..."
	npm run dev

dev-server: ## Start Webpack dev server
	@echo "🚀 Starting Webpack dev server..."
	npm run dev-server

## —— 🧹 Cache & Cleanup ———————————————————————————————————————
clear: cache-clear ## Clear all caches (alias)

cache-clear: ## Clear Symfony cache
	@echo "🧹 Clearing cache..."
	symfony console cache:clear
	@echo "✅ Cache cleared!"

cache-warmup: ## Warmup cache
	@echo "🔥 Warming up cache..."
	symfony console cache:warmup
	@echo "✅ Cache warmed up!"

## —— 🗄️  Database ——————————————————————————————————————————————
db-create: ## Create database
	@echo "🗄️  Creating database..."
	symfony console doctrine:database:create --if-not-exists
	@echo "✅ Database created!"

db-drop: ## Drop database (⚠️  destructive)
	@echo "⚠️  Dropping database..."
	symfony console doctrine:database:drop --force --if-exists
	@echo "✅ Database dropped!"

db-migrate: ## Run database migrations
	@echo "🔄 Running migrations..."
	symfony console doctrine:migrations:migrate --no-interaction
	@echo "✅ Migrations completed!"

db-migration-create: ## Create new migration
	@echo "📝 Creating migration..."
	symfony console make:migration
	@echo "✅ Migration created!"

db-fixtures: ## Load fixtures (⚠️  overwrites data)
	@echo "📊 Loading fixtures..."
	symfony console doctrine:fixtures:load --no-interaction
	@echo "✅ Fixtures loaded!"

db-reset: db-drop db-create db-migrate db-fixtures ## Reset database (drop, create, migrate, fixtures)

db-validate: ## Validate database schema
	symfony console doctrine:schema:validate

## —— 🧪 Testing ————————————————————————————————————————————————
test: ## Run tests
	@echo "🧪 Running tests..."
	symfony php bin/phpunit
	@echo "✅ Tests completed!"

test-coverage: ## Run tests with coverage
	@echo "🧪 Running tests with coverage..."
	XDEBUG_MODE=coverage symfony php bin/phpunit --coverage-html var/coverage
	@echo "✅ Coverage report generated in var/coverage/"

## —— 📊 Code Quality ———————————————————————————————————————————
lint: lint-twig lint-js ## Run all linters

lint-twig: ## Lint Twig templates
	@echo "🔍 Linting Twig templates..."
	symfony console lint:twig templates/
	@echo "✅ Templates are valid!"

lint-js: ## Lint JavaScript files
	@echo "🔍 Linting JavaScript files..."
	npx eslint assets/**/*.js
	@echo "✅ JavaScript files are valid!"

lint-js-fix: ## Fix JavaScript files
	@echo "🔧 Fixing JavaScript files..."
	npx eslint assets/**/*.js --fix
	@echo "✅ JavaScript files fixed!"

phpstan: ## Run PHPStan static analysis
	@echo "🔍 Running PHPStan..."
	symfony php vendor/bin/phpstan analyse src tests
	@echo "✅ PHPStan analysis completed!"

cs-fix: ## Fix coding standards
	@echo "🔧 Fixing coding standards..."
	symfony php vendor/bin/php-cs-fixer fix src/
	@echo "✅ Coding standards fixed!"

check: lint lint-yaml lint-container lint-js ## Run all linting checks

## —— 🔐 Security ———————————————————————————————————————————————
security-check: ## Check for security vulnerabilities
	@echo "🔐 Checking security vulnerabilities..."
	symfony security:check
	@echo "✅ Security check completed!"

## —— 📝 Code Generation ————————————————————————————————————————
make-controller: ## Create a new controller
	@read -p "Controller name: " name; \
	symfony console make:controller $$name

make-entity: ## Create a new entity
	@read -p "Entity name: " name; \
	symfony console make:entity $$name

make-form: ## Create a new form
	@read -p "Form name: " name; \
	symfony console make:form $$name

make-crud: ## Generate CRUD
	@read -p "Entity name: " name; \
	symfony console make:crud $$name

make-command: ## Create a new command
	@read -p "Command name: " name; \
	symfony console make:command $$name

make-subscriber: ## Create an event subscriber
	@read -p "Subscriber name: " name; \
	symfony console make:subscriber $$name

make-fixture: ## Create a new fixture
	@read -p "Fixture name: " name; \
	symfony console make:fixtures $$name

## —— 📦 Composer ———————————————————————————————————————————————
composer-install: ## Install PHP dependencies
	symfony composer install

composer-update: ## Update PHP dependencies
	symfony composer update

composer-require: ## Require a package (usage: make composer-require package=vendor/package)
	symfony composer require $(package)

composer-remove: ## Remove a package (usage: make composer-remove package=vendor/package)
	symfony composer remove $(package)

composer-dump: ## Dump autoload
	symfony composer dump-autoload

## —— 🎨 Tailwind & Assets —————————————————————————————————————
npm-install: ## Install Node.js dependencies
	npm install

npm-update: ## Update Node.js dependencies
	npm update

tailwind-build: ## Build Tailwind CSS only
	npx tailwindcss -i ./assets/styles/app.css -o ./public/build/tailwind.css --minify

## —— 🐳 Docker (Optional) —————————————————————————————————————
docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-build: ## Build Docker containers
	docker-compose build

docker-logs: ## Show Docker logs
	docker-compose logs -f

## —— 🚀 Deployment ————————————————————————————————————————————
deploy-check: ## Pre-deployment checks
	@echo "🔍 Running pre-deployment checks..."
	@$(MAKE) check
	@$(MAKE) test
	@$(MAKE) security-check
	@echo "✅ All checks passed!"

deploy-build: ## Build for production
	@echo "🚀 Building for production..."
	symfony composer install --no-dev --optimize-autoloader
	npm ci
	npm run build
	symfony console cache:clear --env=prod
	symfony console cache:warmup --env=prod
	@echo "✅ Production build complete!"

deploy: deploy-check deploy-build ## Full deployment (checks + build)
	@echo "✅ Deployment complete!"

## —— 🛠️  Utilities ————————————————————————————————————————————
console: ## Open Symfony console (interactive)
	symfony console

routes: ## Show all routes
	symfony console debug:router

config: ## Show configuration
	symfony console debug:config

services: ## Show all services
	symfony console debug:container

env: ## Show environment variables
	symfony var:export

requirements: ## Check system requirements
	symfony check:requirements

php-version: ## Show PHP version
	@symfony php -v | head -n 1

symfony-version: ## Show Symfony version
	@symfony console --version

versions: php-version symfony-version ## Show all versions

## —— 🔄 Quick Commands ————————————————————————————————————————
fresh: ## Fresh start (install + build + db-reset + serve)
	@$(MAKE) install
	@$(MAKE) build
	@$(MAKE) db-reset
	@$(MAKE) serve
	@echo "✅ Fresh environment ready!"

restart: stop clear serve ## Restart server and clear cache

rebuild: clear build ## Clear cache and rebuild assets

## —— 📊 Stats & Info ———————————————————————————————————————————
stats: ## Show project statistics
	@echo "📊 Project Statistics:"
	@echo ""
	@echo "📦 PHP Dependencies:"
	@symfony composer show --installed | wc -l
	@echo ""
	@echo "📦 Node.js Dependencies:"
	@npm list --depth=0 2>/dev/null | grep -c "├\|└" || echo "0"
	@echo ""
	@echo "📁 Source Files:"
	@find src -name "*.php" | wc -l
	@echo ""
	@echo "🧪 Test Files:"
	@find tests -name "*.php" 2>/dev/null | wc -l || echo "0"
	@echo ""
	@echo "📄 Templates:"
	@find templates -name "*.twig" | wc -l

info: versions status stats ## Show all info

## —— 🧪 Development Helpers ———————————————————————————————————
dump-server: ## Start dump server for debugging
	symfony console server:dump

messenger-consume: ## Consume messenger messages
	symfony console messenger:consume async -vv

watch-logs: ## Watch Symfony logs
	tail -f var/log/dev.log

reset-permissions: ## Fix permissions (WSL2)
	@echo "🔧 Fixing permissions..."
	chmod -R 777 var/
	chmod -R 777 public/build/
	@echo "✅ Permissions fixed!"
