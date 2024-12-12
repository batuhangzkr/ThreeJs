'use client';

import ThreeUserInteractiveApp from "@/components/ThreeUserInteractiveApp";
import ControlPanel from "@/components/ControlPanel";
import { useRef } from "react";

const Page: React.FC = () => {
    const addCubeRef = useRef<() => void | null>(null);
    const addSphereRef = useRef<() => void | null>(null);
    const addPlaneRef = useRef<() => void | null>(null);
    const addTextRef = useRef<(text: string) => void | null>(null);
    const deleteTextRef = useRef<() => void | null>(null);
    const deleteObjectRef = useRef<() => void | null>(null);
    const addTextureRef = useRef<(file: File) => void | null>(null);

    return (
        <div style={{ display: 'flex ' }}>
            {/* Three.js scene section */}
            <div className="w-3/4">
                <ThreeUserInteractiveApp
                    onSetFunctions={(functions) => {
                        addCubeRef.current = functions.addCube;
                        addSphereRef.current = functions.addSphere;
                        addPlaneRef.current = functions.addPlane;
                        addTextRef.current = functions.addText;
                        deleteTextRef.current = functions.deleteText;
                        addTextureRef.current = functions.addTexture;
                        deleteObjectRef.current = functions.deleteObject;
                    }}
                />
            </div>

            {/* Control panel section */}
            <div className="w-1/4">
                <ControlPanel
                    onAddCube={() => addCubeRef.current && addCubeRef.current()}
                    onAddSphere={() => addSphereRef.current && addSphereRef.current()}
                    onAddPlane={() => addPlaneRef.current && addPlaneRef.current()}
                    onAddText={(text) => addTextRef.current && addTextRef.current(text)}
                    onDeleteText={() => deleteTextRef.current && deleteTextRef.current()}
                    onAddTexture={(file) => addTextureRef.current && addTextureRef.current(file)}
                    onDeleteObject={() => deleteObjectRef.current && deleteObjectRef.current()}
                />
            </div>
        </div>
    );
};

export default Page;
