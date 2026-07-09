FROM nginx:alpline

COPY . /user/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]