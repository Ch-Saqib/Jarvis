FROM python:3.12-slim

LABEL maintainer="chsaqib11223@gmail.com"

# Update the package list
RUN apt-get update \
    && apt-get install -y libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# Change directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app/

# Install Poetry
RUN pip install poetry

# Configure Poetry to not create virtual environments
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install

# Set environment variables
ENV DG_API_KEY=Provide Here Deepgram Api
ENV GROQ_API_KEY=Provide Here GROQ Api

# Run the application
CMD [ "poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]
