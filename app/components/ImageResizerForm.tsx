'use client';

import React, { useState, useRef } from 'react';

const MAX_DIMENSION = 10000; // This should match the value in the API route

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f4f4f9',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginBottom: '30px',
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1200px',
    gap: '30px',
  },
  formSection: {
    flex: '1',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '12px',
    border: 'none',
    backgroundColor: '#0070f3',
    color: 'white',
    borderRadius: '5px',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  imageSection: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  imageContainer: {
    width: '120%',
    height: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain' as const,
  },
  errorText: {
    color: 'red',
    marginTop: '10px',
    fontSize: '16px',
    textAlign: 'center' as const,
  },
};

export default function ImageResizerForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const validateInput = (value: string): boolean => {
    return /^[1-9]\d*$/.test(value);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || validateInput(value)) {
      setWidth(value);
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || validateInput(value)) {
      setHeight(value);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!validateInput(width) || !validateInput(height)) {
      setError('Please enter valid positive integers for width and height.');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
      formData.append('width', width);
      formData.append('height', height);

      try {
        const res = await fetch('/api/resize', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to resize image');
        }

        const blob = await res.blob();
        const imageURL = URL.createObjectURL(blob);
        setOutputImage(imageURL);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = () => {
    if (outputImage) {
      const link = document.createElement('a');
      link.href = outputImage;
      link.download = 'resized_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Online Image Resizer Tool</h1>
      
      <div style={styles.content}>
        <div style={styles.formSection}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                style={styles.input}
                ref={fileInputRef}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Width:</label>
              <input
                type="number"
                value={width}
                onChange={handleWidthChange}
                required
                min="1"
                max={MAX_DIMENSION}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Height:</label>
              <input
                type="number"
                value={height}
                onChange={handleHeightChange}
                required
                min="1"
                max={MAX_DIMENSION}
                style={styles.input}
              />
            </div>
            <p style={{fontSize: '14px', color: '#666'}}>
              Maximum allowed dimension: {MAX_DIMENSION}x{MAX_DIMENSION} pixels
            </p>
            <button
              type="submit"
              style={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Resizing...' : 'Resize Image'}
            </button>
          </form>
          {error && <p style={styles.errorText}>{error}</p>}
        </div>

        <div style={styles.imageSection}>
          <div style={styles.imageContainer}>
            {previewImage ? (
              <img src={previewImage} alt="Preview" style={styles.image} />
            ) : (
              <p>No image selected</p>
            )}
          </div>
          
          {outputImage && (
            <>
              <div style={styles.imageContainer}>
                <img src={outputImage} alt="Resized Output" style={styles.image} />
              </div>
              <button
                onClick={handleDownload}
                style={{ ...styles.button, backgroundColor: '#28a745' }}
              >
                Download Resized Image
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}