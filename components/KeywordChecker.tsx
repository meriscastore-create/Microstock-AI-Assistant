import React from 'react';

interface KeywordCheckerProps {
    url: string;
    onClose: () => void;
}

const KeywordChecker: React.FC<KeywordCheckerProps> = ({ url, onClose }) => {
    return (
        <div className="w-full h-full flex flex-col bg-brand-dark shadow-2xl">
            <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-brand-accent">Keyword Checker</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex-grow">
                {url ? (
                    <iframe
                        src={url}
                        title="Keyword Checker"
                        className="w-full h-full border-none"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Generate a title and click "Check Keywords" to see results.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KeywordChecker;