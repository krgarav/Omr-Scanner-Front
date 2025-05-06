import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SmallHeader from 'components/Headers/SmallHeader';
const url = "https://28mdpn6d-5289.inc1.devtunnels.ms"
const FolderPicker = ({ onSelect }) => {
    const [folders, setFolders] = useState([]);
    const [currentPath, setCurrentPath] = useState('');
    const [newFolderName, setNewFolderName] = useState('');

    useEffect(() => {
        fetchFolders(currentPath);
    }, [currentPath]);

    const fetchFolders = async (path) => {
        try {
            const response = await axios.get(url + '/api/FileManager/folders', { params: { path } });
            setFolders(response.data);
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    };

    const handleFolderClick = (folder) => {
        setCurrentPath((prevPath) => `${prevPath}/${folder.name}`);
    };

    const handleCreateFolder = async () => {
        if (!newFolderName) return;
        try {
            await axios.post(url + '/api/FileManager/folders', null, {
                params: { path: currentPath, folderName: newFolderName },
            });
            setNewFolderName('');
            fetchFolders(currentPath);
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    const handleSelectFolder = () => {
        if (onSelect) {
            onSelect(currentPath);
        }
    };

    return (

        <>
            <SmallHeader />
            <div>
                <h3>Current Path: {currentPath || '/'}</h3>
                <ul>
                    {currentPath && (
                        <li onClick={() => setCurrentPath(currentPath.split('/').slice(0, -1).join('/'))}>
                            ..
                        </li>
                    )}
                    {folders.map((folder, index) => (
                        <li key={index} onClick={() => handleFolderClick(folder)}>
                            {folder.name}
                        </li>
                    ))}
                </ul>
                <input
                    type="text"
                    placeholder="New folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                />
                <button onClick={handleCreateFolder}>Create Folder</button>
                <button onClick={handleSelectFolder}>Select Folder</button>
            </div>
        </>
    );
};

export default FolderPicker;