from flask import Flask, request, jsonify
import os

app = Flask(__name__)

try:
    import cv2
    OPENCV_AVAILABLE = True
except Exception:
    OPENCV_AVAILABLE = False


def mocked_boxes():
    return [
        {"x": 0.1, "y": 0.6, "w": 0.12, "h": 0.2, "label": "AS"},
        {"x": 0.25, "y": 0.6, "w": 0.12, "h": 0.2, "label": "KH"},
        {"x": 0.45, "y": 0.5, "w": 0.12, "h": 0.2, "label": "7D"}
    ]


@app.route('/detect', methods=['POST'])
def detect():
    # Accept multipart form upload or JSON with filename (delegated)
    if 'image' in request.files:
        f = request.files['image']
        data = f.read()
        # If OpenCV available we could try a simple threshold/contour flow (omitted)
        if OPENCV_AVAILABLE:
            # basic mock: in real implementation do cv2.imdecode and process
            boxes = mocked_boxes()
        else:
            boxes = mocked_boxes()
        return jsonify({"boxes": boxes, "note": "from cv_service (mocked)"})
    return jsonify({"error": "no image provided"}), 400


if __name__ == '__main__':
    port = int(os.environ.get('CV_PORT', 5100))
    app.run(host='0.0.0.0', port=port)
