import React, { useState, useCallback, useEffect } from 'react';
import TitleGenerator from './components/TitleGenerator';
import ImageGenerator from './components/ImageGenerator';
import KeywordChecker from './components/KeywordChecker';
import ImageResultViewer from './components/ImageResultViewer';
import ImageDetailModal from './components/ImageDetailModal';
import { generateTitle, generateJsonPrompt, generateImages } from './services/geminiService';
import type { AspectRatio } from './types';
import Button from './components/ui/Button';

// API Key Modal Component defined within App.tsx to avoid creating new files
const ApiKeyModal: React.FC<{ onSave: (key: string) => void }> = ({ onSave }) => {
    const [localKey, setLocalKey] = useState('');

    const handleSave = () => {
        if (localKey.trim()) {
            onSave(localKey.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
                <h2 className="text-xl font-semibold text-brand-accent">Enter Your API Key</h2>
                <p className="text-gray-400 text-sm">
                    To use this application, please provide your Google AI API key. Your key is stored securely in your browser's session and is never sent to our servers.
                </p>
                <div>
                    <label htmlFor="api-key-input" className="block text-sm font-medium text-brand-light mb-1">
                        Google AI API Key
                    </label>
                    <input
                        id="api-key-input"
                        type="password"
                        value={localKey}
                        onChange={(e) => setLocalKey(e.target.value)}
                        placeholder="Enter your key here"
                        className="w-full p-2 bg-brand-dark border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none"
                    />
                </div>
                <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-accent hover:underline"
                >
                    Get your API Key from Google AI Studio &rarr;
                </a>
                <Button onClick={handleSave} disabled={!localKey.trim()} className="w-full">
                    Save and Continue
                </Button>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [showApiKeyModal, setShowApiKeyModal] = useState(false);

    useEffect(() => {
        const storedKey = sessionStorage.getItem('gemini-api-key');
        if (storedKey) {
            setApiKey(storedKey);
        } else {
            setShowApiKeyModal(true);
        }
    }, []);

    const handleSaveApiKey = (key: string) => {
        setApiKey(key);
        sessionStorage.setItem('gemini-api-key', key);
        setShowApiKeyModal(false);
    };

    const [keywords, setKeywords] = useState<string>('');
    const [generatedTitle, setGeneratedTitle] = useState<string>('');
    const [generatedJsonPrompt, setGeneratedJsonPrompt] = useState<string>('');
    
    const [isGeneratingTitle, setIsGeneratingTitle] = useState<boolean>(false);
    const [isGeneratingJson, setIsGeneratingJson] = useState<boolean>(false);
    
    const [checkerUrl, setCheckerUrl] = useState<string>('');
    const [sidePanelContent, setSidePanelContent] = useState<'none' | 'checker' | 'images'>('none');

    const [imagePrompt, setImagePrompt] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [numImages, setNumImages] = useState<number>(1);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isGeneratingImages, setIsGeneratingImages] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    
    const checkApiKey = useCallback(() => {
        if (!apiKey) {
            setError('Please set your Google AI API Key before generating content.');
            setShowApiKeyModal(true);
            return false;
        }
        setError(null);
        return true;
    }, [apiKey]);

    const handleGenerateTitle = useCallback(async () => {
        if (!checkApiKey() || !keywords.trim()) {
            if (!keywords.trim()) setError('Please enter some keywords.');
            return;
        }
        setIsGeneratingTitle(true);
        setError(null);
        setGeneratedTitle('');
        setGeneratedJsonPrompt('');
        setSidePanelContent('none');
        try {
            const title = await generateTitle(apiKey!, keywords);
            setGeneratedTitle(title);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred during title generation.');
            console.error(e);
        } finally {
            setIsGeneratingTitle(false);
        }
    }, [keywords, apiKey, checkApiKey]);

    const handleGenerateJsonPrompt = useCallback(async () => {
        if (!checkApiKey() || !generatedTitle) {
            if(!generatedTitle) setError('Please generate a title first.');
            return;
        }
        setIsGeneratingJson(true);
        setError(null);
        setGeneratedJsonPrompt('');
        try {
            const jsonPrompt = await generateJsonPrompt(apiKey!, generatedTitle);
            const parsedJson = JSON.parse(jsonPrompt);
            setGeneratedJsonPrompt(JSON.stringify(parsedJson, null, 2));
            setImagePrompt(jsonPrompt); // Set the raw JSON string as the image prompt
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred during JSON prompt generation.');
            console.error(e);
        } finally {
            setIsGeneratingJson(false);
        }
    }, [generatedTitle, apiKey, checkApiKey]);

    const handleCheckKeywords = useCallback(() => {
        if (!generatedTitle) {
            setError('Please generate a title first.');
            return;
        }
        const formattedTitle = generatedTitle.replace(/\s+/g, '+');
        const url = `https://www.mykeyworder.com/keywords?language=en&tags=${formattedTitle}`;
        setCheckerUrl(url);
        setSidePanelContent('checker');
    }, [generatedTitle]);

    const handleGenerateImages = useCallback(async () => {
        if (!checkApiKey() || !imagePrompt.trim()) {
             if(!imagePrompt.trim()) setError('Please enter a prompt for the image.');
            return;
        }
        setIsGeneratingImages(true);
        setError(null);
        setGeneratedImages([]);
        setSidePanelContent('images');
        try {
            const images = await generateImages(apiKey!, imagePrompt, numImages, aspectRatio);
            setGeneratedImages(images);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred during image generation.');
            console.error(e);
            setSidePanelContent('none');
        } finally {
            setIsGeneratingImages(false);
        }
    }, [imagePrompt, numImages, aspectRatio, apiKey, checkApiKey]);
    
    const closeSidePanel = () => setSidePanelContent('none');

    const handleViewImage = (image: string) => {
        setViewingImage(image);
    };

    return (
        <>
            {showApiKeyModal && <ApiKeyModal onSave={handleSaveApiKey} />}
            <div className="flex flex-col lg:flex-row h-screen bg-gray-800 text-white font-sans overflow-hidden">
                <main className="flex-grow p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto w-full lg:w-7/12">
                    <header className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-brand-accent">Microstock AI Assistant</h1>
                            <p className="text-gray-400 mt-2">Generate SEO-friendly titles, detailed prompts, and stunning images for your stock portfolio.</p>
                        </div>
                        <Button variant="secondary" onClick={() => setShowApiKeyModal(true)}>
                            API Key
                        </Button>
                    </header>

                    {error && (
                        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                            <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                <svg className="fill-current h-6 w-6 text-red-200" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <TitleGenerator
                            keywords={keywords}
                            setKeywords={setKeywords}
                            generatedTitle={generatedTitle}
                            generatedJsonPrompt={generatedJsonPrompt}
                            isGeneratingTitle={isGeneratingTitle}
                            isGeneratingJson={isGeneratingJson}
                            onGenerateTitle={handleGenerateTitle}
                            onGenerateJson={handleGenerateJsonPrompt}
                            onCheckKeywords={handleCheckKeywords}
                        />
                        <ImageGenerator
                            prompt={imagePrompt}
                            setPrompt={setImagePrompt}
                            aspectRatio={aspectRatio}
                            setAspectRatio={setAspectRatio}
                            numImages={numImages}
                            setNumImages={setNumImages}
                            isGenerating={isGeneratingImages}
                            onGenerate={handleGenerateImages}
                        />
                    </div>
                </main>

                <aside className={`transition-all duration-500 ease-in-out w-full lg:w-5/12 h-full flex flex-col bg-brand-dark ${sidePanelContent !== 'none' ? 'translate-x-0' : 'lg:translate-x-full lg:w-0'}`}>
                    {sidePanelContent === 'checker' && <KeywordChecker url={checkerUrl} onClose={closeSidePanel} />}
                    {sidePanelContent === 'images' && <ImageResultViewer images={generatedImages} isGenerating={isGeneratingImages} onClose={closeSidePanel} onViewImage={handleViewImage} />}
                </aside>
            </div>
            {viewingImage && (
                <ImageDetailModal
                    imageSrc={viewingImage}
                    onClose={() => setViewingImage(null)}
                />
            )}
        </>
    );
};

export default App;