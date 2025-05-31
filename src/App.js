import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const imageAssets1 = [
    "/assets/View_1_Open_Unselect.png",
    "/assets/View_1_Capture.png",
    "/assets/View_1_Open_Select.png",
  ];

  const imageAssets2 = [
    "/assets/View_2_Open_Unselect.png",
    "/assets/View_2_Capture.png",
    "/assets/View_2_Open_Select.png",
  ];

  const imageAssets3 = imageAssets2;

  const webcamRef = useRef(null);

  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [index3, setIndex3] = useState(0);

  const [capturedImage1, setCapturedImage1] = useState(null);
  const [capturedImage2, setCapturedImage2] = useState(null);
  const [capturedImage3, setCapturedImage3] = useState(null);

  const [showTick1, setShowTick1] = useState(false);
  const [showTick2, setShowTick2] = useState(false);
  const [showTick3, setShowTick3] = useState(false);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [activeView, setActiveView] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const uploadImage = async (imageBase64) => {
    const filename = `${uuidv4()}.jpg`;
    const payload = { filename: filename };
    try {
      const response = await fetch('http://localhost:3001/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to upload image');
      const result = await response.json();
      console.log('Image uploaded:', result);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const captureImage = (setCapturedImage, setLoading, setShowTick, setIndex) => {
    const screenshot = webcamRef.current.getScreenshot();
    setCapturedImage(screenshot);
    setLoading(true);
    setShowTick(false);
    setIndex(2);

    setTimeout(() => setShowTick(true), 1000);
    setTimeout(() => {
      setLoading(false);
      setShowTick(false);
      setActiveView(null);
    }, 2000);
  };

  const handleUploadClick = async () => {
    if (!capturedImage1 && !capturedImage2 && !capturedImage3) {
      alert('No images to upload!');
      return;
    }

    if (capturedImage1) await uploadImage(capturedImage1);
    if (capturedImage2) await uploadImage(capturedImage2);
    if (capturedImage3) await uploadImage(capturedImage3);

    alert('Images uploaded successfully!');

    setCapturedImage1(null);
    setCapturedImage2(null);
    setCapturedImage3(null);

    setIndex1(0);
    setIndex2(0);
    setIndex3(0);
  };

  const handleViewClick = (view, index, setIndex, setCapturedImage, setLoading, setShowTick) => {
    if (activeView && activeView !== view) return;
    setActiveView(view);
    if (index === 0) setIndex(1);
    else if (index === 1) captureImage(setCapturedImage, setLoading, setShowTick, setIndex);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Overlay top-left and top-right */}
        <div className="top-left">
          <img src="/assets/DARA.png" alt="DARA" className="DARA" />
        </div>
        <div className="top-right">
          <img src="/assets/Mask_Group_2.png" alt="mask_group" className="mask_group" />
        </div>

        {/* Webcam or Captured View */}
        {(index1 === 1 || index2 === 1 || index3 === 1) &&
          !loading1 && !loading2 && !loading3 && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="fullscreen-webcam"
              playsInline
              videoConstraints={{
                facingMode: { ideal: isMobile ? "environment" : "user" }
              }}
            />
          )}

        {loading1 && capturedImage1 && (
          <img src={capturedImage1} alt="Captured1" className="fullscreen-webcam" />
        )}
        {loading2 && capturedImage2 && (
          <img src={capturedImage2} alt="Captured2" className="fullscreen-webcam" />
        )}
        {loading3 && capturedImage3 && (
          <img src={capturedImage3} alt="Captured3" className="fullscreen-webcam" />
        )}

        {/* Tick overlay */}
        {showTick1 && <img src="/assets/Pop_Up_Complete.png" alt="Tick" className="tick-overlay" />}
        {showTick2 && <img src="/assets/Pop_Up_Complete.png" alt="Tick" className="tick-overlay" />}
        {showTick3 && <img src="/assets/Pop_Up_Complete.png" alt="Tick" className="tick-overlay" />}
      </div>

      <div>
        <div className="footer" style={{ backgroundImage: `url('/assets/Blue_box.png')` }}>
          <div className="image-overlay">
            <img
              src={imageAssets1[index1]}
              alt="View 1"
              className="overlay-img"
              onClick={() =>
                handleViewClick('view1', index1, setIndex1, setCapturedImage1, setLoading1, setShowTick1)
              }
              style={{ cursor: activeView && activeView !== 'view1' ? 'not-allowed' : 'pointer' }}
            />
            <img
              src={imageAssets2[index2]}
              alt="View 2"
              className="overlay-img"
              onClick={() =>
                handleViewClick('view2', index2, setIndex2, setCapturedImage2, setLoading2, setShowTick2)
              }
              style={{ cursor: activeView && activeView !== 'view2' ? 'not-allowed' : 'pointer' }}
            />
            <img
              src={imageAssets3[index3]}
              alt="View 3"
              className="overlay-img"
              onClick={() =>
                handleViewClick('view3', index3, setIndex3, setCapturedImage3, setLoading3, setShowTick3)
              }
              style={{ cursor: activeView && activeView !== 'view3' ? 'not-allowed' : 'pointer' }}
            />
          </div>

          <div className="upload-container">
            <img
              src="/assets/Upload_button.png"
              width="100px"
              alt="Upload Button"
              onClick={handleUploadClick}
            />
            <p>Tap to select the view and upload the images when complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
