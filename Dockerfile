FROM node:lts-alpine

ARG EXPO_USERNAME
ARG EXPO_PASSWORD

# Set timezone
ENV TZ=Asia/Seoul
RUN apk add tzdata && ln -s /usr/share/zoneinfo/Asia/Seoul /etc/localtime

# App setup & dependencies
WORKDIR /usr/fork
COPY ./fork/package.json ./
COPY ./fork .

# Install packages & run
RUN yarn install
EXPOSE 8081 19000 19001 19002
RUN npx expo login -u ${EXPO_USERNAME} -p ${EXPO_PASSWORD}