FROM node:18 as base
WORKDIR /app

FROM base as initializer
WORKDIR /app
RUN npm create --yes vite@latest my-vue-app -- --template vue-ts -y 
RUN npm install -D tailwindcss autoprefixer

FROM base as development
WORKDIR /app
# Continue with development setup
CMD ["npm", "run", "dev"]
