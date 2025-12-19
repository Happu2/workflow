import os
from openai import OpenAI
from google import genai
from typing import Generator


openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key and openai_api_key != "your_openai_key":
    openai_client = OpenAI(api_key=openai_api_key)
else:
    openai_client = None

gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    gemini_client = genai.Client(api_key=gemini_api_key)
else:
    gemini_client = None


def stream_answer(prompt: str, model: str = "gemini") -> Generator[str, None, None]:
    if model == "openai" and openai_client:
        stream = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            stream=True
        )
        for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
    elif model == "gemini" and gemini_client:
        stream = gemini_client.models.generate_content_stream(
            model="models/gemini-2.5-flash",
            contents=prompt
        )
        for chunk in stream:
            if chunk.text:
                yield chunk.text
    else:
        # Fallback: return a simple response
        yield "API key not configured. Please set up your API keys in the .env file."
