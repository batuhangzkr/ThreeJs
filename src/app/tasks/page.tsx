'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

const TasksPage = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen flex bg-[#04041b] text-white">
            {/* Sol taraf: Görev listesi */}
            <div className="w-1/4 bg-[#04041b] p-4 flex flex-col space-y-4">
                <h1 className="text-2xl font-bold text-center mb-4">ThreeJS Öğrenimim</h1>
                <button
                    onClick={() => router.push('/ThreedApp')}
                    className="bg-gray-800 hover:bg-gray-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg text-lg"
                >
                    3D Uygulama
                </button>
                <button
                    onClick={() => router.push('/Task2.4')}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                    Task 2.4
                </button>
                <button
                    onClick={() => router.push('/Task2.5')}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                    Task 2.5
                </button>
                <button
                    onClick={() => router.push('/Task3.1')}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                    Task 3.1
                </button>
                <button
                    onClick={() => router.push('/Task3.2')}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                    Task 3.2
                </button>
                <button
                    onClick={() => router.push('/Task3.3')}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                    Task 3.3
                </button>
                <button
                    onClick={() => router.push('/Task3.6')}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                    Task 3.6
                </button>
                <button
                    onClick={() => router.push('/Task3.7')}
                    className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                    Task 3.7
                </button>
            </div>

            {/* Sağ taraf: Görsel */}
            <div className="flex-grow flex justify-center items-center">
                <img
                    src="/three.png" // Görselin dosya yolunu değiştirin
                    alt="ThreeJS"
                    className="max-w-full max-h-full rounded-lg shadow-lg"
                />
            </div>
        </div>
    );
};

export default TasksPage;
