import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
const QrScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const scannerRef = useRef(null);

  const startScanner = () => {
    setCameraStarted(true);
    
    // This will be initialized after user grants permission
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner.", error);
      });
      setCameraStarted(false);
      setScanResult(null);
    }
  };

  useEffect(() => {
    if (!cameraStarted) return;

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10,
        qrbox: 250,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      false
    );

    scannerRef.current = html5QrcodeScanner;

    const onScanSuccess = (decodedText, decodedResult) => {
      setScanResult(decodedText);
      // You can optionally stop the scanner after successful scan:
      // stopScanner();
    };

    const onScanFailure = (error) => {
      // Handle scan failure
      console.warn(`QR scan error: ${error}`);
    };

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(error => {
          console.error("Failed to clear html5QrcodeScanner.", error);
        });
      }
    };
  }, [cameraStarted]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>QR Code Scanner</h1>
      
      {!cameraStarted ? (
        <button 
          onClick={startScanner}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Start Scanner
        </button>
      ) : (
        <>
          <button 
            onClick={stopScanner}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            Stop Scanner
          </button>
          <div id="qr-reader" style={{ width: '100%' }}></div>
        </>
      )}
      
      {scanResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>Scan Result:</h3>
          <p>{scanResult}</p>
        </div>
      )}
    </div>
  );
}

export default QrScanner;


