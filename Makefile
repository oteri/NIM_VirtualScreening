SHELL := /bin/bash

.PHONY: run
run:
	docker compose up

.PHONY: stop
stop:
	docker compose down

.PHONY: init
init:
	docker  run --rm --user "$(shell id -u):$(shell id -g)"  -v .:/app -w /app -it  node:18  bash -c "mkdir src && cd src && npm create --yes vite@latest vs-app -- --template vue-ts && npm install -D tailwindcss autoprefixer"

.PHONY: frontend
frontend:
	docker compose up -d frontend
