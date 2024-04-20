# stage1 as builder
FROM node:18-alpine as builder
# Copy the package.json and install dependencies
COPY ./app/package*.json ./
RUN npm install
# Copy rest of the files
COPY ./app .
# Build the project
RUN npm run build


FROM nginx:alpine as production-build
COPY ./conf/nginx.conf  /etc/nginx/nginx.conf
## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*
# Copy from the stage 1
COPY --from=builder /dist /usr/share/nginx/html/vs-nmi
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]