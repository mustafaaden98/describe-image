import React, { useState } from 'react';



type RecognitionResult = {
  description: string;
};

export const ImageUpload =() => {
 const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<RecognitionResult>({ description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection and preview
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setResults({ description: '' });
      setError(null);

      // Preview image
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to backend and get recognition labels
  const onSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResults({ description: '' });

    const formData = new FormData();
    formData.append('image', selectedFile); // The key 'image' must match backend multer field name

    try {
      const response = await fetch('https://api.nafimusti.info/analyze-image', {
        method: 'POST',
        body: formData,
        // No need to set Content-Type header for FormData; browser handles it with boundaries
      });

      const data: RecognitionResult = await response.json();

      if (response.ok) {
        // Assuming backend returns { labels: string[] }
        if (data) {
          setResults({
            description: data.description || 'No description available',
          });
        } else if (Array.isArray(data)) {
          // alternative if backend returns array directly
          setResults(data);
        } else {
          setError('Unexpected response format');
        }
      } else {
        setError('Failed to analyze image');
      }
    } catch (err) {
      setError('Network or server error');
      console.error('Upload error:', err);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h2>Select image</h2>
      <input type="file" accept="image/*" onChange={onFileChange} style={{width:'100%'}} />
      {previewUrl && (
        <div style={{ margin: '20px 0' }}>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%' }} />
        </div>
      )}
      <button
        onClick={onSubmit}
        disabled={!selectedFile || loading}
        style={{
          cursor: selectedFile && !loading ? 'pointer' : 'not-allowed',
          padding: '10px 20px',
          fontSize: '1rem',
          width: '100%',
          marginTop: 10,
          backgroundColor: '#43a047',
          color: '#fff',
        }}
      >
        {loading ? 'Recognizing please wait...' : 'Describe Image'}
      </button>
      {error && (
        <div style={{ marginTop: 15, color: 'red' }}>
          {error}
        </div>
      )}
      {results.description && (
        <div style={{ marginTop: 20 }}>
          <h3>Result:</h3>
          <span>{results.description}</span>
        </div>
      )}
    </div>
  );
};