import tempfile
from text_to_speech import text_to_speech
from speech_to_text import speech_to_text
from groq_service import execute
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.requests import Request
import os

app = FastAPI()

templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/process-audio")
async def process_audio_data(audio: UploadFile = File(...)):
    audio_data = await audio.read()

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        temp_audio.write(audio_data)
        temp_audio.flush()
        temp_audio_path = temp_audio.name

    text = speech_to_text(temp_audio_path)
    generated_answer = execute(f"Please answer to the question: {text}")

    # Convert the generated answer to audio
    audio_path = text_to_speech(generated_answer)

    if audio_path and os.path.exists(audio_path):
        return FileResponse(audio_path, media_type="audio/mpeg")
    else:
        return {"error": "Failed to generate audio response."}



