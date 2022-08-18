FROM node:14-alpine AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install
# Copy app files
COPY . .
# Expose port
EXPOSE 3000
# Start the app
CMD [ "npm", "start" ]



# sudo docker run --name enduser_backend -p 5000:5000 enduser_backend
# sudo docker build --tag enduser_backend .
# sudo docker run --name enduser_frontend -p 5000:5000 enduser_frontend
# sudo docker build --tag enduser_frontend .