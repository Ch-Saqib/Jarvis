FROM python:3.12-slim

RUN apt-get update \
    && apt-get install -y libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app/

RUN pip install poetry 

RUN poetry install

ENV DG_API_KEY=81e3cbbaa848269ace7cb464089061db13eb6fa0

ENV GROQ_API_KEY=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

CMD [ "poetry","run","uvicorn","main:app","--host","0.0.0.0","--reload"]