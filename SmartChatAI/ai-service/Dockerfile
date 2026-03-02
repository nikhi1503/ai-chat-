FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt && \
    python -m nltk.downloader -d /usr/local/share/nltk_data punkt stopwords wordnet

COPY . .

EXPOSE 5001

CMD ["python", "app.py"]
