import React, { useState } from 'react';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { processAndDownloadImage } from '../utils/imageUtils';

interface ImageDetailModalProps {
  imageSrc: string;
  onClose: () => void;
}

const UPSCALE_OPTIONS = [6, 8, 12, 24, 32, 64, 108];

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({ imageSrc, onClose }) => {
  const [enhance, setEnhance] = useState(true);
  const [detailedEnhance, setDetailedEnhance] = useState(false);
  const [setDpi, setSetDpi] = useState(true);
  const [selectedUpscale, setSelectedUpscale] = useState<number>(6);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await processAndDownloadImage(imageSrc, {
        targetMegapixels: selectedUpscale,
        enhance: enhance,
        detailedEnhance: detailedEnhance,
        setDpi300: setDpi,
      });
      onClose(); // Close modal on successful download
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Failed to process image. The resolution might be too high for your browser.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col lg:flex-row">
        
        {/* Image Viewer */}
        <div className="flex-grow flex items-center justify-center p-4 bg-brand-dark rounded-t-xl lg:rounded-l-xl lg:rounded-t-none">
          <img
            alt="Selected for enhancement"
            src={imageSrc}
            className="object-contain max-h-full max-w-full"
          />
        </div>

        {/* Controls Panel */}
        <div className="w-full lg:w-96 flex-shrink-0 p-6 flex flex-col space-y-4 bg-gray-900 rounded-b-xl lg:rounded-r-xl lg:rounded-b-none overflow-y-auto">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-semibold text-brand-accent">Enhance & Download</h2>
             <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Enhance Toggle */}
            <div className="flex items-center justify-between bg-brand-dark p-3 rounded-lg">
              <label htmlFor="enhance-toggle" className="font-medium text-brand-light">
                Auto Enhance
              </label>
              <button
                id="enhance-toggle"
                onClick={() => setEnhance(!enhance)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enhance ? 'bg-brand-secondary' : 'bg-gray-600'}`}
                aria-checked={enhance}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enhance ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <p className="text-xs text-gray-400 -mt-2 px-1">
              Applies subtle improvements to contrast and saturation.
            </p>

            {/* Detailed Enhance Toggle */}
            <div className="flex items-center justify-between bg-brand-dark p-3 rounded-lg">
              <label htmlFor="detailed-enhance-toggle" className="font-medium text-brand-light">
                Detailed Enhance
              </label>
              <button
                id="detailed-enhance-toggle"
                onClick={() => setDetailedEnhance(!detailedEnhance)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${detailedEnhance ? 'bg-brand-secondary' : 'bg-gray-600'}`}
                aria-checked={detailedEnhance}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${detailedEnhance ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <p className="text-xs text-gray-400 -mt-2 px-1">
              Applies stronger, more vibrant image corrections.
            </p>

             {/* DPI Toggle */}
            <div className="flex items-center justify-between bg-brand-dark p-3 rounded-lg">
              <label htmlFor="dpi-toggle" className="font-medium text-brand-light">
                Set 300 DPI
              </label>
              <button
                id="dpi-toggle"
                onClick={() => setSetDpi(!setDpi)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${setDpi ? 'bg-brand-secondary' : 'bg-gray-600'}`}
                aria-checked={setDpi}
              >
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${setDpi ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <p className="text-xs text-gray-400 -mt-2 px-1">
              Note: DPI is a print metadata flag. Upscaling is the primary factor for high-quality printing.
            </p>
          </div>

          {/* Upscale Options */}
          <div>
            <h3 className="font-medium text-brand-light mb-2">Upscale Resolution</h3>
            <div className="grid grid-cols-3 gap-2">
              {UPSCALE_OPTIONS.map(mp => (
                <button
                  key={mp}
                  onClick={() => setSelectedUpscale(mp)}
                  className={`p-3 rounded-lg text-center font-semibold transition-colors text-sm ${selectedUpscale === mp ? 'bg-brand-secondary text-white ring-2 ring-brand-accent' : 'bg-brand-dark hover:bg-gray-700'}`}
                >
                  {mp} MP
                </button>
              ))}
            </div>
             <p className="text-xs text-gray-400 mt-2 px-1">
              Select the target image size. The image will be upscaled if smaller. Higher values may be slow.
            </p>
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* Action Button */}
          <div className="flex-grow flex items-end">
            <Button onClick={handleDownload} disabled={isProcessing} className="w-full text-lg">
              {isProcessing ? <Spinner /> : `Download ${selectedUpscale}MP Image`}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImageDetailModal;
