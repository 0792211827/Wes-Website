# Wesley Nyamosi website — local dev shortcuts.
#
#   make dev        backend (H2, :8087) + frontend (:4200) together; Ctrl+C stops both
#   make backend    Spring Boot only, local profile (in-memory H2, admin password "local-admin")
#   make frontend   Angular dev server only (falls back to bundled data if the API is down)
#   make build      production build of both apps
#   make help       list targets

BACKEND_DIR  := backend
FRONTEND_DIR := frontend
BACKEND_PORT := 8087
FRONTEND_PORT := 4200

.DEFAULT_GOAL := help
.PHONY: help install dev backend frontend build build-frontend build-backend test clean check-java check-node stop

help: ## List targets
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[32m%-16s\033[0m %s\n", $$1, $$2}'

check-java:
	@java -version >/dev/null 2>&1 || { \
	  echo "Java 17+ is not installed. Install it (e.g. 'brew install openjdk@21') or run 'make frontend' alone."; \
	  exit 1; }

check-node:
	@command -v npm >/dev/null 2>&1 || { echo "Node/npm is not installed (need Node >= 20.19)."; exit 1; }

install: check-node ## Install frontend dependencies
	cd $(FRONTEND_DIR) && npm install

$(FRONTEND_DIR)/node_modules: $(FRONTEND_DIR)/package.json
	cd $(FRONTEND_DIR) && npm install
	@touch $@

backend: check-java ## Run the backend (local profile, H2 in-memory, port 8087)
	cd $(BACKEND_DIR) && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local

frontend: check-node $(FRONTEND_DIR)/node_modules ## Run the frontend dev server (port 4200, proxies /api to 8087)
	cd $(FRONTEND_DIR) && npm start -- --port $(FRONTEND_PORT)

dev: check-node $(FRONTEND_DIR)/node_modules ## Run backend + frontend together (Ctrl+C stops both)
	@if java -version >/dev/null 2>&1; then \
	  echo ">> backend  http://localhost:$(BACKEND_PORT)   (admin: admin / local-admin)"; \
	  echo ">> frontend http://localhost:$(FRONTEND_PORT)"; \
	  trap 'kill 0' INT TERM EXIT; \
	  (cd $(BACKEND_DIR) && ./mvnw -q spring-boot:run -Dspring-boot.run.profiles=local) & \
	  (cd $(FRONTEND_DIR) && npm start -- --port $(FRONTEND_PORT)) & \
	  wait; \
	else \
	  echo ">> Java not found: starting the frontend only (content falls back to bundled data)."; \
	  echo ">> frontend http://localhost:$(FRONTEND_PORT)"; \
	  cd $(FRONTEND_DIR) && npm start -- --port $(FRONTEND_PORT); \
	fi

build: build-frontend build-backend ## Production build of both apps

build-frontend: check-node $(FRONTEND_DIR)/node_modules ## Production build of the frontend (must pass before done)
	cd $(FRONTEND_DIR) && npm run build

build-backend: check-java ## Package the backend jar (skips tests)
	cd $(BACKEND_DIR) && ./mvnw -q -DskipTests package

test: check-java ## Run backend tests
	cd $(BACKEND_DIR) && ./mvnw test

stop: ## Kill anything left listening on ports 8087 and 4200
	@for p in $(BACKEND_PORT) $(FRONTEND_PORT); do \
	  pids=$$(lsof -ti tcp:$$p); \
	  if [ -n "$$pids" ]; then echo "stopping port $$p ($$pids)"; kill $$pids; fi; \
	done

clean: ## Remove build output (frontend dist, backend target)
	rm -rf $(FRONTEND_DIR)/dist $(FRONTEND_DIR)/.angular
	rm -rf $(BACKEND_DIR)/target
