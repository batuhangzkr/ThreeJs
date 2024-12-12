import React, { useState } from 'react';

interface ControlPanelProps {
    onAddCube: () => void;
    onAddSphere: () => void;
    onAddPlane: () => void;
    onAddText: (text: string) => void;
    onDeleteText: () => void;
    onAddTexture: (file: File) => void;
    onDeleteObject: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({

    onAddCube,
    onAddSphere,
    onAddPlane,
    onAddText,
    onDeleteText,
    onAddTexture,
    onDeleteObject,
}) => {
    const [textInput, setTextInput] = useState('');

    return (
        <div className="w-full h-full bg-blue-50 p-4 space-y-3">
            <h3 className="text-lg font-bold text-blue-700">Nesne Ekle</h3>
            <button
                onClick={onAddCube}
                className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                Küp Ekle
            </button>
            <button
                onClick={onAddSphere}
                className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                Küre Ekle
            </button>
            <button
                onClick={onAddPlane}
                className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                Düzlem Ekle
            </button>

            <h3 className="text-lg font-bold text-blue-700">Metin Ekle</h3>
            <div className="space-y-2">
                <input
                    type="text"
                    placeholder="Metin Gir"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full text-black p-2 border rounded-lg"
                />
                <button
                    onClick={() => {
                        if (textInput.trim() !== '') {
                            onAddText(textInput);
                            setTextInput('');
                        }
                    }}
                    className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                    Metin ekle
                </button>
            </div>

            <button
                onClick={onDeleteText}
                className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Seçilen Objenin bütün metinlerini sil
            </button>
            <h3 className="text-lg font-bold text-red-700">Obje sil</h3>
            <button
                onClick={onDeleteObject}
                className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Seçilen objeyi sil
            </button>

            <h3 className="text-lg font-bold text-blue-700">Resim Ekle</h3>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && onAddTexture(e.target.files[0])}
                className="w-full p-2 border rounded-lg file-input cursor-pointer bg-[#04041b]"
            />
        </div>
    );
};

export default ControlPanel;
