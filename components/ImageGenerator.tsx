import React from 'react';
import Spinner from './ui/Spinner';
import Button from './ui/Button';
import type { AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';

interface ImageGeneratorProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (ratio: AspectRatio) => void;
    numImages: number;
    setNumImages: (num: number) => void;
    isGenerating: boolean;
    onGenerate: () => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({
    prompt,
    setPrompt,
    aspectRatio,
    setAspectRatio,
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
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="aspect-ratio" className="block text-sm font-medium text-brand-light">Aspect Ratio</label>
                    <select id="aspect-ratio" value={aspectRatio} onChange={e => setAspectRatio(e.target.value as AspectRatio)} className="w-full mt-1 p-2 bg-brand-dark border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none">
                        {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="num-images" className="block text-sm font-medium text-brand-light">Number of Images</label>
                    <select id="num-images" value={numImages} onChange={e => setNumImages(Number(e.target.value))} className="w-full mt-1 p-2 bg-brand-dark border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none">
                        {[...Array(6)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                    </select>
                </div>
            </div>
            <Button onClick={onGenerate} disabled={isGenerating || !prompt.trim()} className="w-full">
                {isGenerating ? <Spinner /> : 'Generate Images'}
            </Button>
        </div>
    );
};

export default ImageGenerator;