FROM node:10.23.1-alpine3.11 as builder

WORKDIR /project

COPY ./package*.json ./
RUN npm install

COPY . ./

RUN npm run build

# =========================

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html
# COPY dist/ .
COPY --from=builder /project/dist/ .

EXPOSE 4200

COPY ./entryPoint.sh /
RUN chmod +x /entryPoint.sh
ENTRYPOINT ["sh","/entryPoint.sh"]

CMD ["nginx", "-g", "daemon off;"]


# ---------------------
# Original

# FROM nginx:alpine

# COPY nginx.conf /etc/nginx/nginx.conf

# WORKDIR /usr/share/nginx/html
# COPY dist/ .

# EXPOSE 4200

# COPY ./entryPoint.sh /
# RUN chmod +x /entryPoint.sh
# ENTRYPOINT ["sh","/entryPoint.sh"]

# CMD ["nginx", "-g", "daemon off;"]
