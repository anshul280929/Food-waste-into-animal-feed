from huggingface_hub import InferenceClient
from PIL import Image
import base64
import io
import requests
# Initialize client
client = InferenceClient(api_key="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")

def optimize_image(image_path, max_size=512, quality=85):
    """Resize image and compress to reduce payload size"""
    img = Image.open(image_path)
    
    # Resize maintaining aspect ratio
    img.thumbnail((max_size, max_size))
    
    # Convert to JPEG buffer
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=quality, optimize=True)
    buffer.seek(0)
    
    return base64.b64encode(buffer.read()).decode("utf-8")

response = requests.get('http://localhost:5000/api/get-image-path', params={'email': 'praty@gmail.com'})
if response.status_code == 200:
    image_path = response.json().get('image_path')
else:
    print("Failed to fetch image path:", response.json().get('error'))
    exit()

# Use the image path
base64_image = optimize_image(image_path)

messages = [
    {
        "role": "user",
        "content": [
            {"type": "text", "text": "Identify the breed of this cattle with threshold of 0.7:"},
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image}"
                }
            }
        ]
    }
]

try:
    completion = client.chat.completions.create(
        model="meta-llama/Llama-3.2-11B-Vision-Instruct", 
        messages=messages, 
        max_tokens=500
    )
    print(completion.choices[0].message.content)
except Exception as e:
    print(f"Error: {str(e)}")
