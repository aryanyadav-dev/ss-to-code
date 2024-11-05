"use client";

import { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, Code, Copy, Check, Image, Video } from 'lucide-react';

interface FileState {
  file: File | null;
  preview: string;
}

const ScreenshotToCode = () => {
  const [{ file, preview }, setFileState] = useState<FileState>({ file: null, preview: '' });
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [uploadedVideoURL, setUploadedVideoURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const [framework, setFramework] = useState<string>('React + Tailwind');
  const [model, setModel] = useState<string>('Claude 3 Sonnet');
  const [livePreviewCode, setLivePreviewCode] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 25 * 1024 * 1024) {
        setError('File size exceeds 25MB limit. Please upload a smaller file.');
        setFileState({ file: null, preview: '' });
        return;
      }

      const filePreview = URL.createObjectURL(selectedFile);
      setFileState({ file: selectedFile, preview: filePreview });

      // Create a FormData object to send the file and other data
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('framework', framework);
      formData.append('model', model);

      try {
        setLoading(true);
        setError('');

        // Send POST request to the API
        const response = await axios.post('src/pages/generatedcode.ts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Handle the response, assuming it contains the generated code
        if (response.data) {
          setGeneratedCode(response.data.generatedCode);
        }
      } catch (err) {
        setError('An error occurred while generating the code. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUploadRecording = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedVideoURL(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    // Generate code based on the uploaded video
    let generatedHtml = '';

    if (uploadedVideoURL) {
      generatedHtml = `
      <div class="uploaded-video">
        <h1>Uploaded Video</h1>
        <video controls>
          <source src="${uploadedVideoURL}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>`;
    } else if (file) {
      generatedHtml =
        framework === 'React + Tailwind'
          ? `
<div class="flex min-h-screen bg-gray-100">
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Welcome</h1>
    <p class="text-gray-600">This is a sample generated code for ${framework}</p>
    <img src="${preview}" alt="Uploaded Screenshot" class="mt-4 rounded-lg" />
  </div>
</div>
          `
          : '<p>Generated code for the selected framework and model will appear here.</p>';
    }

    setTimeout(() => {
      setGeneratedCode(generatedHtml);
      setLoading(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        videoChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoURL(videoUrl);
        videoChunksRef.current = []; // Reset chunks for the next recording
        // Call the function to generate code after recording stops
        generateCodeFromRecording(videoUrl);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      setError('Failed to start recording.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const generateCodeFromRecording = (videoUrl: string) => {
    // Mock function to generate code based on the recording
    const generatedHtml = `
      <div class="recording">
        <h1>Your screen recording is ready!</h1>
        <video controls>
          <source src="${videoUrl}" type="video/webm">
          Your browser does not support the video tag.
        </video>
      </div>
    `;
    setGeneratedCode(generatedHtml);
  };

  const deleteUploadedFile = () => {
    setFileState({ file: null, preview: '' });
  };

  const deleteUploadedVideo = () => {
    setUploadedVideoURL(null);
  };

  const handlePreview = () => {
    setLivePreviewCode(generatedCode);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Title section aligned to the left */}
      <div className="max-w-3xl ml-0 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Screenshot to Code</h1>
        <p className="text-gray-600">Upload a screenshot or record your screen to get the corresponding code</p>
      </div>

      {/* Dropdowns for framework and model selection */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="text-gray-900 font-semibold">Generating:</label>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="ml-2 border rounded p-1 text-gray-900"
          >
            <option>HTML + Tailwind</option>
            <option>HTML + CSS</option>
            <option>React + Tailwind</option>
            <option>Vue + Tailwind</option>
            <option>Bootstrap</option>
            <option>NextJS</option>
          </select>
        </div>

        <div>
          <label className="text-gray-900 font-semibold">Model:</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="ml-2 border rounded p-1 text-gray-900"
          >
            <option>Claude 3 Sonnet</option>
            <option>ChatGPT</option>
            <option>Llama</option>
            <option>Gemini</option>
          </select>
        </div>
      </div>

      {/* Horizontal line */}
      <div className="w-full border-t border-gray-300 my-6"></div>

      {/* Upload Section for Screenshot */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <span className="text-gray-600">Drop your screenshot here or click to upload</span>
            <span className="text-sm text-gray-500 mt-2">Supports PNG, JPG up to 25MB</span>
          </label>
        </div>

        {/* Preview the uploaded image */}
        {file && (
          <div className="relative mt-4">
            <img src={preview} alt="Uploaded Screenshot" className="rounded-lg max-w-full" />
            <button
              onClick={deleteUploadedFile}
              className="absolute top-0 right-0 mt-2 mr-2 bg-red-600 text-white rounded-full p-2"
            >
              &times;
            </button>
          </div>
        )}
      </div>

      {/* Screen Recording Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-black text-xl font-bold mb-2">Screen Recording</h2>
        <p className="text-gray-600 text-center mb-4">Record your screen to generate a code based on your actions.</p>
        <div className="flex justify-center mb-4">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`bg-green-500 text-white py-2 px-4 rounded ${recording ? 'bg-red-500' : ''}`}
          >
            {recording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
        {videoURL && (
          <div className="relative mt-4">
            <video controls src={videoURL} className="rounded-lg max-w-full" />
          </div>
        )}
      </div>

      {/* Video upload section */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="video/mp4"
            onChange={handleUploadRecording}
            className="hidden"
            id="video-upload"
          />
          <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
            <Video className="h-12 w-12 text-gray-400 mb-4" />
            <span className="text-gray-600">Drop your video here or click to upload</span>
            <span className="text-sm text-gray-500 mt-2">Supports MP4 files</span>
          </label>
        </div>
        {uploadedVideoURL && (
          <div className="relative mt-4">
            <video controls src={uploadedVideoURL} className="rounded-lg max-w-full" />
            <button
              onClick={deleteUploadedVideo}
              className="absolute top-0 right-0 mt-2 mr-2 bg-red-600 text-white rounded-full p-2"
            >
              &times;
            </button>
          </div>
        )}
      </div>

      {/* Buttons to generate code and preview */}
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            className={`bg-green-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Code'}
          </button>

          <button
            onClick={copyToClipboard}
            className={`bg-gray-500 text-white py-2 px-4 rounded ${!generatedCode ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!generatedCode}
          >
            {copied ? <Check /> : <Copy />}
          </button>
        </div>

        <button
          onClick={handlePreview}
          className={`bg-blue-500 text-white py-2 px-4 rounded ${!generatedCode ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!generatedCode}
        >
          Preview
        </button>
      </div>

      {/* Display generated code and live preview */}
      <div className="flex gap-4">
        <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-sm overflow-auto">
          <h2 className="text-xl font-bold mb-2 text-black">Generated Code</h2>
          <pre className="whitespace-pre-wrap text-gray-900 bg-gray-100 p-2 rounded-lg border border-gray-300">
            <code dangerouslySetInnerHTML={{ __html: formatCode(generatedCode) }} />
          </pre>
        </div>

        <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-sm overflow-auto">
          <h2 className="text-xl font-bold mb-2 text-black">Live Preview</h2>
          <div className="preview-container" dangerouslySetInnerHTML={{ __html: livePreviewCode }} />
        </div>
      </div>
    </div>
  );
};

// Function to format the code for syntax highlighting
const formatCode = (code: string) => {
  return code
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(const|let|var|function|class|return|if|else|for|while|switch|case|break|continue|async|await|try|catch|finally|throw|import|export|from|require|new|this|super|extends|constructor|static|get|set)/g, '<span class="text-blue-500">$1</span>')
    .replace(/(".*?"|'.*?')/g, '<span class="text-green-500">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/|\/\/.*?$)/gm, '<span class="text-gray-500">$1</span>')
    .replace(/(\d+)/g, '<span class="text-orange-500">$1</span>')
    .replace(/(function\s+\w+)/g, '<span class="text-purple-500">$1</span>');
};

export default ScreenshotToCode;
