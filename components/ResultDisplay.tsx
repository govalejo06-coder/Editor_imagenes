
import React from 'react';
import { DownloadIcon } from './IconComponents';

interface ResultDisplayProps {
  originalImage: string;
  editedImage: string;
  summary: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, editedImage, summary }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Resultado</h2>
        {summary && (
          <p className="mt-2 text-lg text-indigo-600 bg-indigo-50 p-3 rounded-lg">
            “{summary}”
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Original</h3>
          <div className="w-full aspect-square bg-gray-200 rounded-lg shadow-md overflow-hidden flex items-center justify-center">
            <img src={originalImage} alt="Original" className="object-contain max-h-full max-w-full" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Editada</h3>
          <div className="w-full aspect-square bg-gray-200 rounded-lg shadow-md overflow-hidden flex items-center justify-center">
            <img src={editedImage} alt="Editada" className="object-contain max-h-full max-w-full" />
          </div>
          <a
            href={editedImage}
            download="imagen-editada.png"
            className="mt-4 inline-flex items-center gap-x-2 text-white bg-green-600 hover:bg-green-700 font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <DownloadIcon />
            Descargar
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
