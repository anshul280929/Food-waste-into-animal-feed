from groq import Groq

groq_client = Groq(api_key="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")

breed_name = "Jersey Cow"  # Change this to any breed you want

prompt = f"""Act as a livestock nutrition expert. Given the breed: {breed_name}, 
provide the daily macro requirements including:

- Calories (kcal)
- Protein (g)
- total lumpsum amount of vitamins
- total lumpsum amount of minerals

example value 
Calories: 2000 kcal
Protein : 100g
Vitamins : 50 g
Minerals: 59 g

no other out put except the specified format no more than 4 lines given """

messages = [{"role": "user", "content": prompt}]

# Use Groq API for calculation
chat_completion = groq_client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=messages,
    max_tokens=500,
    temperature=0.3
)

analysis = chat_completion.choices[0].message.content
print(analysis)
