import React, { useRef, useEffect, useState } from 'react';

export default function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [lastResponse, setLastResponse] = useState(null);

  useEffect(() => {
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        console.error('camera error', e);
        setStatus('camera-error');
      }
    }
    start();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      captureAndUpload();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const captureAndUpload = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async blob => {
      if (!blob) return;
      setStatus('uploading');
      try {
        const form = new FormData();
        form.append('image', blob, 'capture.jpg');
        const res = await fetch((process.env.REACT_APP_API_URL || '') + '/upload', {
          method: 'POST',
          body: form
        });
        const json = await res.json();
        setLastResponse(json);
        // call mock-cv to get fake boxes
        const cvRes = await fetch((process.env.REACT_APP_API_URL || '') + '/mock-cv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: json.filename })
        });
        const cvJson = await cvRes.json();
        setLastResponse(prev => ({ ...prev, cv: cvJson }));
        setStatus('ok');
      } catch (e) {
        console.error(e);
        setStatus('error');
      }
    }, 'image/jpeg', 0.8);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Camera Capture (captures every 2s)</h2>
      <video ref={videoRef} autoPlay playsInline style={{ width: 320, height: 240, background: '#000' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div style={{ marginTop: 12 }}>
        <strong>Status:</strong> {status}
      </div>
      <pre style={{ marginTop: 12, maxHeight: 240, overflow: 'auto' }}>{JSON.stringify(lastResponse, null, 2)}</pre>
    </div>
  );
}
