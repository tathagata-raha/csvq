FROM python:3.8-slim-buster
COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt
# EXPOSE 5000
# ENTRYPOINT [ "python" ]
CMD [ "python3", "-m", "flask", "run", "--host=0.0.0.0"]
