FROM python:3.12-slim

RUN apt-get update \
    && apt-get install -y libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app/

RUN pip install poetry 

RUN poetry install

ENV DG_API_KEY=Provide Here Deepgram Api

ENV GROQ_API_KEY=Provide Here GROQ Api

CMD [ "poetry","run","uvicorn","main:app","--host","0.0.0.0","--reload"]
