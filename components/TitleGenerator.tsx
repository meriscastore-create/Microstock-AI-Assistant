
import React from 'react';
import Spinner from './ui/Spinner';
import Button from './ui/Button';

interface TitleGeneratorProps {
    keywords: string;
    setKeywords: (keywords: string) => void;
    generatedTitle: string;
    generatedJsonPrompt: string;
    isGeneratingTitle: boolean;
    isGeneratingJson: boolean;
    onGenerateTitle: () => void;
    onGenerateJson: () => void;
    onCheckKeywords: () => void;
}

const TitleGenerator: React.FC<TitleGeneratorProps> = ({
    keywords,
    setKeywords,
    generatedTitle,
    generatedJsonPrompt,
    isGeneratingTitle,
    isGeneratingJson,
    onGenerateTitle,
    onGenerateJson,
    onCheckKeywords
}) => {
    
    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert(`${type} copied to clipboard!`);
        }, (err) => {
            console.error('Could not copy text: ', err);
            alert(`Failed to copy ${type}.`);
        });
    };

    return (
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-4 flex flex-col h-full">
            <div className="space-y-2">
                <label htmlFor="keywords" className="block text-sm font-medium text-brand-accent">
                    Enter Keywords
                </label>
                <textarea
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., seamless christmas pattern, reindeer, mountain, winter landscape"
                    className="w-full h-24 p-3 bg-brand-dark border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition duration-200 resize-none"
                />
            </div>
            <Button onClick={onGenerateTitle} disabled={isGeneratingTitle || !keywords.trim()} className="w-full">
                {isGeneratingTitle ? <Spinner /> : 'Generate Title'}
            </Button>
            
            {generatedTitle && (
                <div className="bg-brand-dark p-4 rounded-lg space-y-3 animate-fade-in">
                    <h3 className="font-semibold text-lg text-brand-light">Generated Title</h3>
                    <p className="bg-gray-800 p-3 rounded-md text-gray-300">{generatedTitle}</p>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={() => copyToClipboard(generatedTitle, 'Title')} size="sm">Copy Title</Button>
                        <Button onClick={onCheckKeywords} size="sm" variant="secondary">Check Keywords</Button>
                        <Button onClick={onGenerateJson} disabled={isGeneratingJson} size="sm" variant="accent">
                             {isGeneratingJson ? <Spinner /> : 'Generate JSON Prompt'}
                        </Button>
                    </div>
                </div>
            )}

            {generatedJsonPrompt && (
                <div className="bg-brand-dark p-4 rounded-lg space-y-3 animate-fade-in flex-grow flex flex-col">
                    <h3 className="font-semibold text-lg text-brand-light">JSON Prompt</h3>
                     <div className="relative flex-grow">
                        <textarea
                            readOnly
                            value={generatedJsonPrompt}
                            className="w-full h-full p-3 bg-gray-800 border-none rounded-md text-gray-300 font-mono text-xs resize-none"
                        />
                         <button onClick={() => copyToClipboard(generatedJsonPrompt, 'JSON Prompt')} className="absolute top-2 right-2 bg-gray-700 hover:bg-brand-secondary text-white p-2 rounded-md transition-colors">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                                <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TitleGenerator;
