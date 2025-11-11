import React from 'react';
import Spinner from './ui/Spinner';
import Button from './ui/Button';

interface ImageGeneratorProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    numImages: number;
    setNumImages: (num: number) => void;
    isGenerating: boolean;
    onGenerate: () => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
    prompt,
    setPrompt,
    numImages,
    setNumImages,
    isGenerating,
    onGenerate
}) => {
    
    return (
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-4 flex flex-col h-full">
            <h2 className="text-xl font-bold text-brand-accent">Image Generator</h2>
            <div className="space-y-2">
                <label htmlFor="image-prompt" className="block text-sm font-medium text-brand-light">
                    Prompt
                </label>
                <textarea
                    id="image-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A confident young woman smiling while holding smartphone..."
                    className="w-full h-24 p-3 bg-brand-dark border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition duration-200 resize-none"
                />
            </div>
            <div>
                <label htmlFor="num-images" className="block text-sm font-medium text-brand-light">Number of Images</label>
                <select id="num-images" value={numImages} onChange={e => setNumImages(Number(e.target.value))} className="w-full mt-1 p-2 bg-brand-dark border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none">
                    {[...Array(6)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                </select>
                <p className="text-xs text-gray-400 mt-2 px-1">
                    Note: The 'nano banana' model generates square images. Aspect ratio cannot be changed.
                </p>
            </div>

            <div className="flex-grow" />

            <Button onClick={onGenerate} disabled={isGenerating || !prompt.trim()} className="w-full">
                {isGenerating ? <Spinner /> : 'Generate Images'}
            </Button>
        </div>
    );
};

export default ImageGenerator;