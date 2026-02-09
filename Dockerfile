FROM node:20

# folder kerja di dalam container
WORKDIR /usr/src/app

# copy package dulu biar cache dependency
COPY package*.json ./

# install dependency
RUN npm install

# copy semua source
COPY . .

# expose port express
EXPOSE 3000

# jalankan dev mode (nodemon)
CMD ["npm", "run", "dev"]
