from flask import Flask, request, jsonify
from model import get_prediction_from_url
app = Flask(__name__)

@app.route('/check_url', methods=['POST'])
def process_data():
    data = request.json
    print(data)

    url = data.get('url_check')
    if url:
        try:
            type_url = get_prediction_from_url(url)
            return jsonify({'type_url': type_url})
        except Exception as e:
            return jsonify({'error': 'Failed to decode image', 'message': str(e)}), 400
    else:
        return jsonify({'error': 'No message provided'}), 400

if __name__ == '__main__':
    # print(get_prediction_from_url('br-icloud.com.br'))
    app.run(host='localhost', port=8005, debug=True)
