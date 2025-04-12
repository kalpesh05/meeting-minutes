import sys
import json
import whisper

model = whisper.load_model("base")
audio_path = sys.argv[1]

result = model.transcribe(audio_path)
output = {
    "language": result["language"],
    "text": result["text"]
}

print(json.dumps(output))
