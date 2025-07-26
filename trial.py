from huggingface_hub import InferenceClient
import base64

client = InferenceClient(api_key="")

def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
    
image_path = "D:\\testing weird ass codes\\food.jpg"

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text", 
                "text": "Describe every single item you see in this image with the quantity or the count u see them / frequency of them in a single line like apple - 5, tomato -4 etc take a threshold of 0.6"
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{image_to_base64(image_path)}"
                }
            }
        ]
    }
]

completion = client.chat.completions.create(
    model="meta-llama/Llama-3.2-11B-Vision-Instruct", 
    messages=messages, 
    max_tokens=500
)

print(completion.choices[0].message.content)
