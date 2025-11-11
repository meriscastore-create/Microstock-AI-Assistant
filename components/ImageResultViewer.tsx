import React from 'react';
import Spinner from './ui/Spinner';
import Button from './ui/Button';

interface ImageResultViewerProps {
    images: string[];
    isGenerating: boolean;
    onClose: () => void;
    onViewImage: (image: string) => void;
}

const ImageResultViewer: React.FC<ImageResultViewerProps> = ({ images, isGenerating, onClose, onViewImage }) => {
    return (
        <div className="w-full h-full flex flex-col bg-brand-dark shadow-2xl">
            <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-brand-accent">Generated Images</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {isGenerating && images.length === 0 && (
                    <div className="flex flex-col justify-center items-center h-full text-center">
                        <Spinner />
                        <p className="mt-4 text-gray-400">Generating your images... this may take a moment.</p>
                        <p className="mt-2 text-sm text-gray-500">You can enhance and upscale after generation.</p>
                    </div>
                )}

                {!isGenerating && images.length === 0 && (
                     <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-center">Your generated images will appear here.</p>
                    </div>
                )}
                
                {images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {images.map((img, index) => (
                             <div key={index} className="space-y-2">
                                <div className="bg-black rounded-lg overflow-hidden">
                                    <img 
                                        src={img} 
                                        alt={`Generated image ${index + 1}`} 
                                        className="w-full h-auto object-contain max-h-96"
                                    />
                                </div>
                                <Button onClick={() => onViewImage(img)} size="sm" variant="secondary" className="w-full">
                                    View
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageResultViewer;