from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
import shutil
from spellchecker import SpellChecker

app = Flask(__name__)
CORS(app)

# Initialize spell checker
spell = SpellChecker()

# Directory for custom dictionaries
CUSTOM_DICT_DIR = 'custom_dictionaries'
os.makedirs(CUSTOM_DICT_DIR, exist_ok=True)

# In-memory cache for user custom dictionaries
user_custom_dictionaries = {}

@app.route('/')
def home():
    return "SayWell API is running!"

@app.route('/api/add-custom-word', methods=['POST'])
def add_custom_word():
    data = request.json
    word = data.get('word', '').strip().lower()
    user_id = data.get('userId', 'default')
    
    if not word:
        return jsonify({"success": False, "message": "No word provided"}), 400
    
    try:
        # Initialize user dictionary if not exists
        if user_id not in user_custom_dictionaries:
            user_custom_dictionaries[user_id] = {}
            
            # Check if user has a saved dictionary file
            user_dict_path = os.path.join(CUSTOM_DICT_DIR, f"{user_id}_custom_dict.json")
            if os.path.exists(user_dict_path):
                try:
                    with open(user_dict_path, 'r') as f:
                        user_custom_dictionaries[user_id] = json.load(f)
                except Exception as e:
                    print(f"Error loading custom dictionary for {user_id}: {str(e)}")
        
        # Check if word already exists in the dictionary
        if word in user_custom_dictionaries[user_id]:
            return jsonify({"success": True, "duplicate": True, "message": f"'{word}' is already in your dictionary"})
        
        # Add word to user's custom dictionary
        user_custom_dictionaries[user_id][word] = True
        
        # Save user's dictionary to file
        user_dict_path = os.path.join(CUSTOM_DICT_DIR, f"{user_id}_custom_dict.json")
        with open(user_dict_path, 'w') as f:
            json.dump(user_custom_dictionaries[user_id], f)
        
        # Add word to spell checker
        spell.word_frequency.add(word)
        
        return jsonify({"success": True, "message": f"Added '{word}' to your dictionary"})
    except Exception as e:
        error_message = str(e)
        print(f"Error adding custom word: {error_message}")
        return jsonify({"success": False, "message": f"Error: {error_message}"}), 500

@app.route('/api/get-custom-words', methods=['GET'])
def get_custom_words():
    user_id = request.args.get('userId', 'default')
    
    try:
        # Initialize user dictionary if not exists
        if user_id not in user_custom_dictionaries:
            user_custom_dictionaries[user_id] = {}
            
            # Check if user has a saved dictionary file
            user_dict_path = os.path.join(CUSTOM_DICT_DIR, f"{user_id}_custom_dict.json")
            if os.path.exists(user_dict_path):
                try:
                    with open(user_dict_path, 'r') as f:
                        user_custom_dictionaries[user_id] = json.load(f)
                except Exception as e:
                    print(f"Error loading custom dictionary for {user_id}: {str(e)}")
        
        # Get list of words from user's dictionary
        words = list(user_custom_dictionaries[user_id].keys())
        
        return jsonify({"success": True, "words": words})
    except Exception as e:
        error_message = str(e)
        print(f"Error getting custom words: {error_message}")
        return jsonify({"success": False, "message": f"Error: {error_message}"}), 500

@app.route('/api/delete-custom-word', methods=['DELETE'])
def delete_custom_word():
    user_id = request.args.get('userId', 'default')
    word = request.args.get('word', '').strip().lower()
    
    if not word:
        return jsonify({"success": False, "message": "No word provided"}), 400
    
    try:
        # Initialize user dictionary if not exists
        if user_id not in user_custom_dictionaries:
            user_custom_dictionaries[user_id] = {}
            
            # Check if user has a saved dictionary file
            user_dict_path = os.path.join(CUSTOM_DICT_DIR, f"{user_id}_custom_dict.json")
            if os.path.exists(user_dict_path):
                try:
                    with open(user_dict_path, 'r') as f:
                        user_custom_dictionaries[user_id] = json.load(f)
                except Exception as e:
                    print(f"Error loading custom dictionary for {user_id}: {str(e)}")
        
        # Check if word exists in the dictionary
        if word not in user_custom_dictionaries[user_id]:
            return jsonify({"success": False, "message": f"'{word}' is not in your dictionary"}), 404
        
        # Remove word from user's custom dictionary
        del user_custom_dictionaries[user_id][word]
        
        # Save user's dictionary to file
        user_dict_path = os.path.join(CUSTOM_DICT_DIR, f"{user_id}_custom_dict.json")
        with open(user_dict_path, 'w') as f:
            json.dump(user_custom_dictionaries[user_id], f)
        
        # Remove word from spell checker (if possible)
        # Note: This is not a perfect solution as the spell checker doesn't have a direct method to remove words
        # In a production environment, you might want to reinitialize the spell checker with the updated dictionary
        
        return jsonify({"success": True, "message": f"Removed '{word}' from your dictionary"})
    except Exception as e:
        error_message = str(e)
        print(f"Error deleting custom word: {error_message}")
        return jsonify({"success": False, "message": f"Error: {error_message}"}), 500

@app.route('/api/update-nickname', methods=['POST'])
def update_nickname():
    data = request.json
    old_nickname = data.get('oldNickname', '')
    new_nickname = data.get('newNickname', '')
    
    if not old_nickname or not new_nickname:
        return jsonify({"success": False, "message": "Both old and new nicknames are required"}), 400
    
    try:
        # Check if old nickname has a dictionary
        old_dict_path = os.path.join(CUSTOM_DICT_DIR, f"{old_nickname}_custom_dict.json")
        new_dict_path = os.path.join(CUSTOM_DICT_DIR, f"{new_nickname}_custom_dict.json")
        
        # If old nickname has a dictionary, transfer it to new nickname
        if os.path.exists(old_dict_path):
            # Copy dictionary to new nickname
            shutil.copy2(old_dict_path, new_dict_path)
            
            # Update in-memory cache
            if old_nickname in user_custom_dictionaries:
                user_custom_dictionaries[new_nickname] = user_custom_dictionaries[old_nickname]
                del user_custom_dictionaries[old_nickname]
        
        return jsonify({"success": True, "message": "Nickname updated successfully"})
    except Exception as e:
        error_message = str(e)
        print(f"Error updating nickname: {error_message}")
        return jsonify({"success": False, "message": f"Error: {error_message}"}), 500

@app.route('/api/check-spelling', methods=['POST'])
def check_spelling():
    input_text = request.json.get("text","")
    user_id = request.json.get("userId", "default")
    prefTeachStyle = request.json.get("prefTeachStyle",)
    age = request.json.get("age",)
    struggleSyllable = request.json.get("struggleSyllable",)
    nickname = request.json.get("nickname")
    
    try:
        # Ensure user dictionary is loaded
        if user_id not in user_custom_dictionaries:
            user_custom_dictionaries[user_id] = {}
            
            # Check if user has a saved dictionary file
            user_dict_path = os.path.join(CUSTOM_DICT_DIR, f"{user_id}_custom_dict.json")
            if os.path.exists(user_dict_path):
                try:
                    with open(user_dict_path, 'r') as f:
                        user_dict = json.load(f)
                        user_custom_dictionaries[user_id] = user_dict
                        
                        # Make sure all words are in the spell checker
                        for word in user_dict.keys():
                            spell.word_frequency.add(word)
                except Exception as e:
                    print(f"Error loading custom dictionary for {user_id}: {str(e)}")
        
        # Call OpenAI API for text correction
        api_response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": "Bearer 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",
                "Content-Type": "application/json",
                # "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
                # "X-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
            },
            data=json.dumps({
                "model": "deepseek/deepseek-chat",
                "messages": [
                    { "role": "system", "content": f"You are SayWell, an AI assistant built to help with reading and writing."
                    f" Your job is to correct mistakes, simplify text, and improve pronunciation. "
                    f"You must:"
                    f"1. Fix spelling and grammar mistakes in the user's text."
                    f"2. Simplify long or difficult sentences."
                    f"3. Convert misspelled words into syllables and show pronunciation (example: 'necessary' → 'nes-uh-ser-ee')."
                    f"4. Do NOT define words. Only correct and simplify text."
                    f"5. Keep responses clear, short, and encouraging."
                    f"6. Teach the user in this manner : {prefTeachStyle} "
                    f"7. Age is : {age} and struggles such as remember- {struggleSyllable}" 
                    f"8. Call user as {nickname} "
                    },
                    { "role": "user", "content": input_text }
                ],
            })
        )
        
        response_data = api_response.json()
        corrected_text = response_data['choices'][0]['message']['content']
        
        # Use safe print to avoid encoding issues
        try:
            print("Corrected text received")
        except UnicodeEncodeError:
            print("Corrected text received (contains non-ASCII characters)")
        
        return jsonify({"corrected_text": corrected_text})
    except Exception as error:
        error_message = str(error)
        print(f"Error in check_spelling: {error_message}")
        return jsonify({"error": error_message, "corrected_text": f"Sorry, I couldn't process your message. Error: {error_message[:100]}..."}), 500

if __name__ == '__main__':
    app.run(debug=True)
