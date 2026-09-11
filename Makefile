.DEFAULT_GOAL := help

.PHONY: help install dev build preview type-check ci clean clean-all deploy

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start Vite development server
	npm run dev

build: ## Build for production
	npm run build

preview: ## Preview production build locally
	npm run preview

type-check: ## Run TypeScript type check
	npm run type-check

ci: ## Run CI verification (type-check and build)
	npm run ci

clean: ## Remove build artifacts
	rm -rf dist

clean-all: clean ## Remove build artifacts and node_modules
	rm -rf node_modules

deploy: ## Deploy to GitHub Pages
	npm run deploy
