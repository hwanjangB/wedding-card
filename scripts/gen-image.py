"""
나노바나나 (Gemini) 이미지 생성 스크립트
사용법: python3 scripts/gen-image.py "프롬프트" output_filename.png
"""

import sys
import os
import base64
from google import genai
from google.genai import types

client = genai.Client(api_key="REDACTED")

def generate(prompt: str, output_path: str, reference_image: str = None):
    contents = []

    if reference_image and os.path.exists(reference_image):
        with open(reference_image, "rb") as f:
            img_data = f.read()

        mime = "image/png" if reference_image.endswith(".png") else "image/jpeg"
        contents.append(types.Content(
            role="user",
            parts=[
                types.Part(inline_data=types.Blob(mime_type=mime, data=img_data)),
                types.Part(text=prompt),
            ]
        ))
    else:
        contents.append(types.Content(
            role="user",
            parts=[types.Part(text=prompt)]
        ))

    response = client.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
        )
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data:
            with open(output_path, "wb") as f:
                f.write(part.inline_data.data)
            print(f"saved: {output_path}")
            return
        elif part.text:
            print(f"text: {part.text}")

    print("no image generated")

if __name__ == "__main__":
    prompt = sys.argv[1]
    output = sys.argv[2]
    ref = sys.argv[3] if len(sys.argv) > 3 else None
    generate(prompt, output, ref)
