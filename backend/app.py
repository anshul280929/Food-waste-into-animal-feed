from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient
import base64
from groq import Groq
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import bcrypt
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from huggingface_hub import InferenceClient
from PIL import Image
import base64
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Hugging Face Inference Client
client = InferenceClient(api_key="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")
groq_client = Groq(api_key="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")
# Global variable to store intermediate results
stored_results = None
email=None
current_nutritional_values = None
# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Database setup
def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL
        )
    ''')
    # Create animals table with foreign key
    cursor.execute('''

        CREATE TABLE IF NOT EXISTS animals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            animal_name TEXT NOT NULL,
            protein REAL NOT NULL,
            calories REAL NOT NULL,
            vitamins TEXT NOT NULL,
            minerals TEXT NOT NULL,
            FOREIGN KEY (email) REFERENCES users(email)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

# Helper function to hash passwords
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Helper function to verify passwords
def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

def optimize_image(image_path, max_size=512, quality=85):
    """Resize image and compress to reduce payload size"""
    img = Image.open(image_path)
    img.thumbnail((max_size, max_size))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=quality, optimize=True)
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")

# Signup route
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({"error": "Email, password, and name are required"}), 400

    hashed_password = hash_password(password)

    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', (email, hashed_password, name))
        conn.commit()
        conn.close()
        return jsonify({"message": "Signup successful", "email": email}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 400

# Animal upload route
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Get animals route
@app.route('/api/upload-animal', methods=['POST'])
def upload_animal():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file'}), 400
        
        file = request.files['image']
        email = request.form.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        # Save the image
        UPLOAD_FOLDER = 'D:\\testing weird ass codes\\uploads'
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
            
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Get breed prediction using Hugging Face
        base64_image = optimize_image(filepath)  # Assuming this function exists
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Identify the breed of this cattle with threshold of 0.7: return the name in two words not more than that just the name nothing else."},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
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
        
        breed_result = completion.choices[0].message.content.strip()
        
        # Get nutritional requirements using Groq
        groq_prompt = f"""Act as a livestock nutrition expert. Given the breed: {breed_result}, 
        provide the daily macro requirements including:
        - Calories (kcal)
        - Protein (g)
        - Total lumpsum amount of vitamins
        - Total lumpsum amount of minerals
        Format:
        Calories: [value] kcal
        Protein: [value] g
        Vitamins: [value] g
        Minerals: [value] g
        
        make sure the output is a single number and not a range please """

        print(breed_result)
        
        groq_messages = [{"role": "user", "content": groq_prompt}]
        groq_response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=groq_messages,
            max_tokens=500,
            temperature=0.3
        )
        
        # Parse Groq response
        nutritional_data = groq_response.choices[0].message.content

# Extracting and cleaning values safely
        nutritional_values = {
            "calories": float(nutritional_data.split("Calories: ")[1].split(" kcal")[0].replace(",", "")),
            "protein": float(nutritional_data.split("Protein: ")[1].split(" g")[0].replace(",", "")),
            "vitamins": nutritional_data.split("Vitamins: ")[1].split("\n")[0].strip(),
            "minerals": nutritional_data.split("Minerals: ")[1].split("\n")[0].strip()
        }

        
        # Store in database
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        cursor.execute(
            '''INSERT INTO animals (email, animal_name, protein, calories, vitamins, minerals)
               VALUES (?, ?, ?, ?, ?, ?)''',
            (email, breed_result, nutritional_values['protein'], nutritional_values['calories'],
             nutritional_values['vitamins'], nutritional_values['minerals'])
        )
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Upload successful',
            'breed': breed_result,
            'nutritional_data': nutritional_values
        }), 201
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

    
@app.route('/api/login', methods=['POST'])
def login():
    global user_email  # Declare global to modify it
    data = request.json
    email = data.get('email')
    password = data.get('password')
    print(email)

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        cursor.execute('SELECT id, email, password FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        conn.close()

        if not user or not verify_password(password, user[2]):
            return jsonify({"error": "Invalid credentials"}), 401

        # Store the email in the global variable after successful login
        user_email = email
        
        # Generate a dummy token (replace with JWT in production)
        token = "dummy_token_123"
        return jsonify({"token": token, "message": "Login successful", "email": email}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/get-image-path', methods=['GET'])
def get_image_path():
    email = request.args.get('email')  # Get email from query parameters

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        cursor.execute('SELECT image_path FROM animals WHERE email = ?', (email,))
        image_path = cursor.fetchone()
        conn.close()

        if not image_path:
            return jsonify({"error": "No image found for this user"}), 404

        return jsonify({"image_path": image_path[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/foodwaste", methods=["POST"])
def foodwaste():
    """
    Endpoint to process food waste image and detect surface items.
    """
    global stored_results

    try:
        print("✅ Received request to /foodwaste")

        data = request.json
        
        # Validate request
        if not data or "image" not in data:
            print("❌ No image in request")
            return jsonify({"error": "No image provided"}), 400

        base64_image = data["image"]
        print("📸 Image data received, length:", len(base64_image))

        # Prepare messages for Hugging Face API
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe every single item you see in this image with the quantity or the count you see them / frequency of them in a single line like apple - 5, tomato -4 etc. Take a threshold of 0.6. Only give the item - quantity, nothing else and don't show any other output or give any output line",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        },
                    },
                ],
            }
        ]

        print("🔄 Sending request to Hugging Face")
        completion = client.chat.completions.create(
            model="meta-llama/Llama-3.2-11B-Vision-Instruct",
            messages=messages,
            max_tokens=500,
        )

        # Store and return results
        stored_results = completion.choices[0].message.content 
        print("✅ Results stored:", stored_results)
        
        return jsonify({"results": stored_results})

    except Exception as e:
        print("❌ Error occurred:", str(e))
        return jsonify({"error": str(e)}), 500


@app.route("/foodwaste-depth", methods=["POST"])
def foodwaste_depth():
    """
    Endpoint to receive depth value and store it temporarily.
    """
    global stored_results

    try:
        print("\n✅ Received request to /foodwaste-depth")

        data = request.json
        
        # Validate request
        if not data or "depth" not in data:
            print("❌ Invalid request: Missing 'depth'")
            return jsonify({"error": "Invalid request. Provide 'depth'."}), 400

        depth_value = data["depth"]
        print(f"📏 Depth value received: {depth_value}")

        if stored_results:
            print("📝 Stored Results from /foodwaste:", stored_results)
        else:
            print("⚠️ No stored results available yet!")

        # Return success response
        return jsonify({
            "message": "Depth received successfully",
            "depth": depth_value,
            "previous_results": stored_results
        })

    except Exception as e:
        print("❌ Error occurred:", str(e))
        return jsonify({"error": str(e)}), 500

def clean_nutritional_value(value):
    """Clean and convert nutritional values to float"""
    if isinstance(value, (int, float)):
        return float(value)
    
    if isinstance(value, str):
        # Remove 'g', 'kcal' and whitespace
        value = value.replace('g', '').replace('kcal', '').strip()
        # Handle possible comma in numbers like '1,000'
        value = value.replace(',', '')
        try:
            return float(value)
        except ValueError:
            return 0.0
    return 0.0

def get_latest_animal_data(email):
    """Get the latest animal data from database"""
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    try:
        cursor.execute('''
            SELECT animal_name, protein, calories, vitamins, minerals 
            FROM animals 
            WHERE email = ? 
            ORDER BY id DESC LIMIT 1
        ''', (email,))
        return cursor.fetchone()
    finally:
        conn.close()

@app.route("/nutrition-comparison", methods=["GET"])
def get_nutrition_comparison():
    """Endpoint to compare required vs available nutritional values"""
    if not user_email:
        return jsonify({"error": "No user logged in"}), 401
    
    try:
        # Get latest animal data
        result = get_latest_animal_data(user_email)
        if not result:
            return jsonify({"error": "No animal data found"}), 404
        
        # Unpack database result
        animal_name, req_protein, req_calories, req_vitamins, req_minerals = result
        
        # Clean required values
        required = {
            "protein": clean_nutritional_value(req_protein),
            "calories": clean_nutritional_value(req_calories),
            "vitamins": clean_nutritional_value(req_vitamins),
            "minerals": clean_nutritional_value(req_minerals)
        }
        
        # Handle available values
        available = {
            "protein": 0.0,
            "calories": 0.0,
            "vitamins": 0.0,
            "minerals": 0.0
        }
        
        if current_nutritional_values:
            available = {
                "protein": clean_nutritional_value(current_nutritional_values.get('protein', 0)),
                "calories": clean_nutritional_value(current_nutritional_values.get('calories', 0)),
                "vitamins": clean_nutritional_value(current_nutritional_values.get('vitamins', 0)),
                "minerals": clean_nutritional_value(current_nutritional_values.get('minerals', 0))
            }
        
        # Calculate percentages
        percentages = {
            "protein": (available["protein"] / required["protein"] * 100) if required["protein"] else 0,
            "calories": (available["calories"] / required["calories"] * 100) if required["calories"] else 0,
            "vitamins": (available["vitamins"] / required["vitamins"] * 100) if required["vitamins"] else 0,
            "minerals": (available["minerals"] / required["minerals"] * 100) if required["minerals"] else 0
        }
        
        # Round percentages to 2 decimal places
        percentages = {k: round(v, 2) for k, v in percentages.items()}
        
        response_data = {
            "animal_name": animal_name,
            "required": required,
            "available": available,
            "percentages": percentages,
            "status": {
                "protein": "Sufficient" if percentages["protein"] >= 100 else "Insufficient",
                "calories": "Sufficient" if percentages["calories"] >= 100 else "Insufficient",
                "vitamins": "Sufficient" if percentages["vitamins"] >= 100 else "Insufficient",
                "minerals": "Sufficient" if percentages["minerals"] >= 100 else "Insufficient"
            }
        }
        
        return jsonify(response_data)
        
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500
    
def parse_nutritional_values(text):
    """Parse nutritional values from the analysis text."""
    nutritional_values = {
        'protein': 0,
        'calories': 0,
        'vitamins': 0,
        'minerals': 0
    }
    
    lines = text.split('\n')
    for line in lines:
        line = line.lower().strip()
        
        # More robust pattern matching
        if 'protein' in line and ':' in line:
            try:
                value = line.split(':')[1].split('g')[0].strip()
                nutritional_values['protein'] = float(value)
            except (ValueError, IndexError):
                pass
        elif 'calories' in line and ':' in line:
            try:
                value = line.split(':')[1].split('kcal')[0].strip()
                nutritional_values['calories'] = float(value)
            except (ValueError, IndexError):
                pass
        elif 'vitamins' in line and ':' in line:
            try:
                value = line.split(':')[1].split('g')[0].strip()
                nutritional_values['vitamins'] = float(value)
            except (ValueError, IndexError):
                pass
        elif 'minerals' in line and ':' in line:
            try:
                value = line.split(':')[1].split('g')[0].strip()
                nutritional_values['minerals'] = float(value)
            except (ValueError, IndexError):
                pass
    
    return nutritional_values

def parse_analysis_sections(analysis):
    """Parse the analysis text into organized sections."""
    sections = {
        'recipe': [],
        'nutritional_content': [],
        'recommendations': [],
        'feeding_capacity': [],
        'nutritional_per_animal': []
    }
    
    current_section = None
    lines = analysis.split('\n')
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Section detection
        if '**Recipe for' in line or '**Recipe Steps' in line:
            current_section = 'recipe'
        elif '**Nutritional Content**' in line:
            current_section = 'nutritional_content'
        elif '**Recommendations' in line:
            current_section = 'recommendations'
        elif '**Number of Animals' in line:
            current_section = 'feeding_capacity'
        elif '**Nutritional Content per Animal**' in line:
            current_section = 'nutritional_per_animal'
        elif line.startswith('---'):
            continue
        elif current_section and line:
            sections[current_section].append(line)
    
    # Convert lists to formatted strings
    return {
        'recipe': '\n'.join(sections['recipe']),
        'nutritional_content': '\n'.join(sections['nutritional_content']),
        'recommendations': '\n'.join(sections['recommendations']),
        'feeding_capacity': '\n'.join(sections['feeding_capacity']),
        'nutritional_per_animal': '\n'.join(sections['nutritional_per_animal'])
    }

@app.route("/finale", methods=["POST"])
def final_calculation():
    """
    Endpoint to perform final 3D estimation using depth and stored surface results.
    """
    global stored_results
    global user_email
    global current_nutritional_values

    try:
        print("\n✅ Received request to /finale")

        data = request.json
        if not data or "depth" not in data:
            return jsonify({"error": "Missing depth parameter"}), 400

        depth = float(data["depth"])
        
        if not user_email:
            return jsonify({"error": "No user is logged in"}), 401

        if not stored_results:
            return jsonify({"error": "No stored results available"}), 400

        # Fetch animal_name from the database using the logged-in user's email
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        cursor.execute(
            'SELECT animal_name FROM animals WHERE email = ? ORDER BY id DESC LIMIT 1',
            (user_email,)
        )
        result = cursor.fetchone()
        conn.close()

        if not result:
            return jsonify({"error": "No animal found for this user"}), 404

        animal_name = result[0]
        print(f"Using email: {user_email} for animal: {animal_name}")

        prompt = f"""Act as a food density estimation and animal feed formulation expert. Given surface items: {stored_results} and container depth: {depth} cm, estimate the total 3D quantity using the following formula:

[Calculation Method]
1. For each item, calculate:
   Total = Surface_Count × (Depth / Item_Height) × Packing_Efficiency
2. Item_Height assumptions:
   - Fruits: Depending on the fruit
   - Vegetables: Depending on the vegetable
   - Grains: 1cm
3. Packing Efficiency: 0.7 (70% optimal packing)

Based on the above calculations and assumptions, create the best recipe for the breed {animal_name}. Use steps that are optimal for farmers. Ensure the output follows the exact format below:

---

### **Recipe for [Animal Breed: {animal_name}]**

#### **Recipe Steps (Bulk Preparation)**  
1. **[Step 1]**: [Detailed step for preparation, e.g., dehydration, silage, or liquid feeding].  
2. **[Step 2]**: [Detailed step for preparation].  
3. **[Step 3]**: [Detailed step for preparation].  

---

#### **Nutritional Content**  
- **Calories**: [Total calories] kcal  
- **Protein**: [Total protein] g  
- **Vitamins**: [Total vitamins] g  
- **Minerals**: [Total minerals] g  

---

#### **Recommendations to Improve Feed Quality**  
1. Add [ingredient/supplement] to enhance [specific nutrient, e.g., protein, vitamins].  
2. Include [ingredient/supplement] for better [specific benefit, e.g., digestion, energy].  
3. Use [ingredient/supplement] to improve [specific benefit, e.g., coat health, immunity].  

---

#### **Number of Animals That Can Be Fed**  
- This recipe can feed how many of them.  

---

#### **Nutritional Content per Animal**  
- **Protein**: [Protein per animal from the feed] g  
- **Calories**: [Calories per animal from the feed] kcal  
- **Vitamins**: [Vitamins per animal from the feed] g  
- **Minerals**: [Minerals per animal from the feed] g  

---

Ensure the output is clear, concise, and follows the exact format above. Do not include any mathematical calculations or formulas in the output. Focus on providing actionable recommendations and structured information for farmers.
        """

        messages = [{"role": "user", "content": prompt}]

        # Use Groq API for calculation
        chat_completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=500,
            temperature=0.3
        )

        analysis = chat_completion.choices[0].message.content

        # Extract nutritional values
        try:
            sections = parse_analysis_sections(analysis)
            nutritional_values = parse_nutritional_values(analysis)
            current_nutritional_values = nutritional_values
            
            return jsonify({
                "surface_data": stored_results,
                "depth": depth,
                "animal_name": animal_name,
                "sections": sections,
                "nutritional_values": nutritional_values
            })
        except Exception as parse_error:
            print("Parsing error:", str(parse_error))
            return jsonify({"error": "Failed to parse analysis results"}), 500


    except Exception as e:
        print("❌ Final calculation error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/reset", methods=["POST"])
def reset():
    """
    Endpoint to reset stored results (optional, for testing purposes).
    """
    global stored_results
    stored_results = None
    return jsonify({"message": "Stored results reset successfully"})


if __name__ == "__main__":
    app.run(debug=True)