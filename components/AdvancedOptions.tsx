import React from 'react';

interface ImageAttributes {
  brightness: number;
  contrast: number;
  objects: string;
  fontType: string;
  width: string;
  height: string;
  resolution: string;
}

interface AdvancedOptionsProps {
  attributes: ImageAttributes;
  setAttributes: React.Dispatch<React.SetStateAction<ImageAttributes>>;
  isDisabled: boolean;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ attributes, setAttributes, isDisabled }) => {
  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAttributes(prev => ({
      ...prev,
      [name]: e.target.type === 'range' ? parseInt(value, 10) : value,
    }));
  };

  return (
    <details className="group border border-gray-200 rounded-lg">
      <summary className="p-4 cursor-pointer flex justify-between items-center font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 list-none">
        3. Ajustes Adicionales (Opcional)
        <svg
          className="w-5 h-5 transform group-open:rotate-180 transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Brillo */}
        <div>
          <label htmlFor="brightness" className="block text-sm font-medium text-gray-700">
            Brillo ({attributes.brightness}%)
          </label>
          <input
            type="range"
            id="brightness"
            name="brightness"
            min="-50"
            max="50"
            value={attributes.brightness}
            onChange={handleAttributeChange}
            disabled={isDisabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
          />
        </div>

        {/* Contraste */}
        <div>
          <label htmlFor="contrast" className="block text-sm font-medium text-gray-700">
            Contraste ({attributes.contrast}%)
          </label>
          <input
            type="range"
            id="contrast"
            name="contrast"
            min="-50"
            max="50"
            value={attributes.contrast}
            onChange={handleAttributeChange}
            disabled={isDisabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
          />
        </div>

        {/* Ancho */}
        <div>
            <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                Ancho (px)
            </label>
            <input
                type="number"
                id="width"
                name="width"
                value={attributes.width}
                onChange={handleAttributeChange}
                disabled={isDisabled}
                placeholder="Ej: 1080"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
        </div>

        {/* Alto */}
        <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Alto (px)
            </label>
            <input
                type="number"
                id="height"
                name="height"
                value={attributes.height}
                onChange={handleAttributeChange}
                disabled={isDisabled}
                placeholder="Ej: 1920"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
        </div>

        {/* Resolución */}
        <div className="md:col-span-2">
            <label htmlFor="resolution" className="block text-sm font-medium text-gray-700">
                Resolución / Píxeles
            </label>
            <input
                type="text"
                id="resolution"
                name="resolution"
                value={attributes.resolution}
                onChange={handleAttributeChange}
                disabled={isDisabled}
                placeholder="Ej: alta resolución, 300 DPI, estilo pixel art"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
        </div>

        {/* Objetos */}
        <div className="md:col-span-2">
          <label htmlFor="objects" className="block text-sm font-medium text-gray-700">
            Objetos a agregar o quitar
          </label>
          <input
            type="text"
            id="objects"
            name="objects"
            value={attributes.objects}
            onChange={handleAttributeChange}
            disabled={isDisabled}
            placeholder="Ej: añade un sombrero al gato, quita el coche rojo"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          />
        </div>

        {/* Tipo de Letra */}
        <div className="md:col-span-2">
          <label htmlFor="fontType" className="block text-sm font-medium text-gray-700">
            Tipo de letra (si aplica)
          </label>
          <input
            type="text"
            id="fontType"
            name="fontType"
            value={attributes.fontType}
            onChange={handleAttributeChange}
            disabled={isDisabled}
            placeholder="Ej: Comic Sans, futurista, manuscrita"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          />
        </div>
      </div>
    </details>
  );
};

export default AdvancedOptions;