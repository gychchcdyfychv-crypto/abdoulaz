from flask import Flask, render_template, request, jsonify
import requests
import json
import os

app = Flask(__name__)

# إعدادات بوت تلغرام
TELEGRAM_BOT_TOKEN = "8654548888:AAHo75b0AB8prNiowt3sEpY4Fu5BzKFIUNA" # ضع التوكن هنا
TELEGRAM_CHAT_ID = "6045504196"     # ضع الـ ID هنا

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/submit-lead', methods=['POST'])
def submit_lead():
    try:
        data = request.json
        name = data.get('name')
        phone = data.get('phone')
        wilaya = data.get('wilaya')
        baladiya = data.get('baladiya')

        # تجهيز الرسالة
        message = f"""
🔔 **طلب حجز جديد - ABDOU LAZ PHOTOGRAPHY**
        
👤 **الاسم واللقب:** {name}
📞 **رقم الهاتف:** {phone}
📍 **الولاية:** {wilaya}
🏙️ **البلدية:** {baladiya}
        """
        
        # إرسال الرسالة إلى تلغرام
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "Markdown"
        }
        
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            return jsonify({"status": "success", "message": "تم الإرسال بنجاح"})
        else:
            return jsonify({"status": "error", "message": "فشل الإرسال إلى تلغرام"}), 500

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
