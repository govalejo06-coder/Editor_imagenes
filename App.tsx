import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import AdvancedOptions from './components/AdvancedOptions';
import { editImageWithPrompt, summarizeChanges } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { UploadedFile } from './types';
import { LoadingSpinner, SparklesIcon } from './components/IconComponents';

interface ImageAttributes {
  brightness: number;
  contrast: number;
  objects: string;
  fontType: string;
  width: string;
  height: string;
  resolution: string;
}

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [attributes, setAttributes] = useState<ImageAttributes>({
    brightness: 0,
    contrast: 0,
    objects: '',
    fontType: '',
    width: '',
    height: '',
    resolution: '',
  });
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: UploadedFile | null) => {
    setUploadedFile(file);
    setEditedImage(null);
    setSummary(null);
    setError(null);
  }, []);

  const buildFullPrompt = (): string => {
    let fullPrompt = prompt;
    const adjustments: string[] = [];

    if (attributes.brightness !== 0) {
      adjustments.push(`ajustar el brillo en un ${attributes.brightness}%`);
    }
    if (attributes.contrast !== 0) {
      adjustments.push(`ajustar el contraste en un ${attributes.contrast}%`);
    }
    if (attributes.width.trim()) {
      adjustments.push(`cambiar el ancho a ${attributes.width} píxeles`);
    }
    if (attributes.height.trim()) {
        adjustments.push(`cambiar el alto a ${attributes.height} píxeles`);
    }
    if (attributes.resolution.trim()) {
        adjustments.push(`ajustar la resolución a "${attributes.resolution}"`);
    }
    if (attributes.fontType.trim()) {
      adjustments.push(`usar un tipo de letra similar a "${attributes.fontType}" para cualquier texto`);
    }
    if (attributes.objects.trim()) {
      adjustments.push(`en cuanto a objetos: ${attributes.objects}`);
    }

    if (adjustments.length > 0) {
      fullPrompt += `\n\nAplicar los siguientes ajustes específicos: ${adjustments.join(', ')}.`;
    }
    
    return fullPrompt;
  };

  const handleGenerateClick = async () => {
    if (!uploadedFile || !prompt.trim()) {
      setError('Por favor, sube una imagen y escribe un prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEditedImage(null);
    setSummary(null);

    const fullPrompt = buildFullPrompt();

    try {
      const [editedImageResult, summaryResult] = await Promise.all([
        editImageWithPrompt(uploadedFile.base64, uploadedFile.file.type, fullPrompt),
        summarizeChanges(fullPrompt),
      ]);

      if (!editedImageResult) {
        throw new Error('La API no devolvió una imagen editada.');
      }

      setEditedImage(`data:image/png;base64,${editedImageResult}`);
      setSummary(summaryResult);

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Ocurrió un error desconocido.';
      setError(`Error al generar la imagen: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <main className="container mx-auto max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 transition-all duration-300">
          <header className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Editor de Imágenes con IA
            </h1>
            <p className="mt-2 text-md sm:text-lg text-gray-600">
              Transforma tus fotos con instrucciones simples y ajustes precisos.
            </p>
          </header>

          <div className="space-y-6">
            <ImageUploader onFileSelect={handleImageUpload} />

            <div className="w-full">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                2. Describe el cambio principal
              </label>
              <textarea
                id="prompt"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="Ej: Haz que la imagen tenga un estilo vintage y elimina el fondo..."
                disabled={isLoading}
              />
            </div>

            <AdvancedOptions attributes={attributes} setAttributes={setAttributes} isDisabled={isLoading} />
            
            <button
              onClick={handleGenerateClick}
              disabled={!uploadedFile || !prompt.trim() || isLoading}
              className="w-full flex items-center justify-center gap-x-2 text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Generando...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  Generar Nueva Imagen
                </>
              )}
            </button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </div>
          
          {(isLoading || editedImage) && (
             <div className="mt-10 pt-6 border-t border-gray-200">
                {isLoading && !editedImage && (
                    <div className="text-center text-gray-600">
                        <div className="flex justify-center items-center">
                            <LoadingSpinner />
                        </div>
                        <p className="mt-2 text-lg font-medium">Procesando tu imagen...</p>
                        <p className="text-sm text-gray-500">Esto puede tardar unos segundos.</p>
                    </div>
                )}
                {editedImage && uploadedFile && (
                  <ResultDisplay
                    originalImage={uploadedFile.base64}
                    editedImage={editedImage}
                    summary={summary}
                  />
                )}
            </div>
          )}
        </div>
      </main>
      <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>Potenciado por Gemini API. Creado con React y Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;