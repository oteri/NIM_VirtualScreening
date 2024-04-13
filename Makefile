SHELL := /bin/bash

.PHONY: bash_frontend
bash_frontend:
	docker  run --rm --user "$(shell id -u):$(shell id -g)" -p 5173:5173 -v ./src/vs-app/:/app -w /app -it  node:18  bash

.PHONY: run_frontend
run_frontend:
	docker  run --rm --user "$(shell id -u):$(shell id -g)" -p 5173:5173 -v ./src/vs-app/:/app -w /app -it  node:18  bash -c "npm run dev -- --host"

.PHONY: init
init:
	docker  run --rm --user "$(shell id -u):$(shell id -g)"  -v .:/app -w /app -it  node:18  bash -c "mkdir src && cd src && npm create --yes vite@latest vs-app -- --template vue-ts && cd  vs-app && npm install -D tailwindcss autoprefixer"
