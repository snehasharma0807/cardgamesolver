from flask import Flask, request, jsonify
import os

app = Flask(__name__)

try:
    import cv2
    OPENCV_AVAILABLE = True
except Exception:
    OPENCV_AVAILABLE = False
try:
    import numpy as np
except Exception:
    np = None


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
        # If OpenCV available and numpy present, do a basic contour-based detection
        if OPENCV_AVAILABLE and np is not None:
            try:
                arr = np.frombuffer(data, dtype=np.uint8)
                img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
                if img is None:
                    raise ValueError('could not decode image')

                h, w = img.shape[:2]
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                blur = cv2.GaussianBlur(gray, (5, 5), 0)
                edged = cv2.Canny(blur, 50, 150)

                contours, _ = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                boxes = []
                for c in contours:
                    area = cv2.contourArea(c)
                    if area < (w * h) * 0.001:  # ignore tiny
                        continue
                    x, y, cw, ch = cv2.boundingRect(c)
                    aspect = float(cw) / float(ch) if ch > 0 else 0
                    # likely card aspect roughly 0.5-1.2 depending on orientation; accept a broad range
                    if aspect < 0.2 or aspect > 2.5:
                        # still allow larger shapes, but filter extremes
                        continue
                    # normalize coords
                    nx = float(x) / w
                    ny = float(y) / h
                    nw = float(cw) / w
                    nh = float(ch) / h
                    boxes.append({"x": round(nx, 4), "y": round(ny, 4), "w": round(nw, 4), "h": round(nh, 4), "label": None})

                # sort boxes left-to-right for convenience
                boxes = sorted(boxes, key=lambda b: b['x'])
                if not boxes:
                    boxes = mocked_boxes()
            except Exception as e:
                # on any CV error, fall back to mocked boxes
                boxes = mocked_boxes()
        else:
            boxes = mocked_boxes()
        return jsonify({"boxes": boxes, "note": "from cv_service (mocked)"})
    return jsonify({"error": "no image provided"}), 400


if __name__ == '__main__':
    port = int(os.environ.get('CV_PORT', 5100))
    app.run(host='0.0.0.0', port=port)
