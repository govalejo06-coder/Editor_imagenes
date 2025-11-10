
import React, { useState, useCallback } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import type { UploadedFile } from '../types';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  onFileSelect: (file: UploadedFile | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (file: File | null) => {
    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      try {
        const base64 = await fileToBase64(file);
        const dataUrl = `data:${file.type};base64,${base64}`;
        setPreview(dataUrl);
        onFileSelect({ file, base64 });
      } catch (error) {
        console.error("Error converting file to base64:", error);
        onFileSelect(null);
        setPreview(null);
      }
    } else {
      onFileSelect(null);
      setPreview(null);
    }
  }, [onFileSelect]);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        1. Sube tu imagen
      </label>
      <div className="mt-1">
        <label
          htmlFor="file-upload"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative flex justify-center items-center w-full h-64 px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-indigo-500' : 'border-gray-300'} border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200`}
        >
          {preview ? (
            <img src={preview} alt="Vista previa" className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
            <div className="space-y-1 text-center">
              <UploadIcon />
              <div className="flex text-sm text-gray-600">
                <p className="pl-1">Arrastra y suelta una imagen o</p>
              </div>
              <p className="font-semibold text-indigo-600 hover:text-indigo-500">
                haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
            </div>
          )}
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept=".jpg,.jpeg,.png"
            onChange={handleInputChange}
          />
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;
