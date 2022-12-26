FROM amd64/node:16.16.0

WORKDIR /rootfolder
COPY package.json ./
RUN npm install
COPY . .