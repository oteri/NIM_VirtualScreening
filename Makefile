SHELL := /bin/bash

.PHONY: bash_frontend
bash_frontend:
	docker  run --rm --user "$(shell id -u):$(shell id -g)" -v ./app/:/app -w /app -it  node:18  bash

.PHONY: run_frontend
run_frontend:
	docker  run --rm --user "$(shell id -u):$(shell id -g)" -p 5173:5173 -v ./app/:/app -w /app -it  node:18  bash -c "npm run dev -- --host"

.PHONY: init
init:
	docker  run --rm --user "$(shell id -u):$(shell id -g)"  -v .:/app -w /app -it  node:18  bash -c "mkdir src && cd src && npm create --yes vite@latest vs-app -- --template vue-ts && cd  vs-app && npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p"

.PHONY: build
build:	
	docker  build -t nmi-vs .

.PHONY: run
run:	
	docker  run --rm -d -p 8080:80 -t nmi-vs 
