CV microservice (mocked)

This small Flask service exposes a single endpoint:

- POST /detect — accepts multipart form file field `image` and returns mocked bounding boxes.

To run locally:

```bash
cd backend/cv_service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

By default it listens on port 5100. If OpenCV isn't installed the service returns mocked boxes; to enable full CV install `opencv-python-headless`.
