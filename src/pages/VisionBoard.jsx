import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, deleteDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, firestore, storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


import Folder from '../components/Folder';
import FolderContent from '../components/FolderContent';
import FileUploadModal from '../components/FileUploadModal';
import TextFileModal from '../components/TextFileModal';
import TextFileViewer from '../components/TextFileViewer';
import StringConnector from '../components/StringConnector';

import { Box, IconButton, Tooltip, Typography, CircularProgress } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { styled } from '@mui/system';

const BoardContainer = styled(Box)({
    position: 'relative',
    height: '100vh',
    background: 'radial-gradient(circle at center,rgb(77, 77, 109) 0%,rgb(18, 31, 68) 100%)',
    overflow: 'hidden',
    color: '#e6f7ff',
});

const CenterArea = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    height: '70%',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 8px 32px rgba(100, 150, 255, 0.4)',
    },
}));

const FloatingButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    backgroundColor: theme?.palette?.primary?.main || '#1976d2',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: theme?.palette?.primary?.main || '#1976d2',

        transform: 'scale(1.1)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
    },
}));

export default function VisionBoard() {
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedTextFile, setSelectedTextFile] = useState(null);
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [openTextModal, setOpenTextModal] = useState(false);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load user's folders and connections
    useEffect(() => {
        if (!auth.currentUser) return;

        setLoading(true);
        const unsubscribe = onSnapshot(
            collection(firestore, 'users', auth.currentUser.uid, 'folders'),
            (snapshot) => {
                const foldersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    position: doc.data().position || {
                        x: Math.random() * 80 + 10,
                        y: Math.random() * 80 + 10
                    }
                }));
                setFolders(foldersData);
                setLoading(false);
            }
        );

        const unsubscribeConnections = onSnapshot(
            collection(firestore, 'users', auth.currentUser.uid, 'connections'),
            (snapshot) => {
                setConnections(snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })));
            }
        );

        return () => {
            unsubscribe();
            unsubscribeConnections();
        };
    }, []);

    const createNewFolder = async () => {
        if (!auth.currentUser) return;

        const folderId = uuidv4();
        const newFolder = {
            id: folderId,
            name: `New Folder ${folders.length + 1}`,
            position: {
                x: Math.random() * 80 + 10,
                y: Math.random() * 80 + 10
            },
            items: [],
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(firestore, 'users', auth.currentUser.uid, 'folders', folderId), newFolder);
    };

    const deleteFolder = async (folderId) => {
        if (!auth.currentUser) return;

        // Delete all files in the folder from storage first
        const folder = folders.find(f => f.id === folderId);
        if (folder) {
            for (const item of folder.items) {
                if (item.type === 'image' || item.type === 'file') {
                    try {
                        const fileRef = ref(storage, `users/${auth.currentUser.uid}/${item.id}`);
                        await deleteObject(fileRef);
                    } catch (error) {
                        console.error("Error deleting file:", error);
                    }
                }
            }
        }

        // Delete the folder document
        await deleteDoc(doc(firestore, 'users', auth.currentUser.uid, 'folders', folderId));

        // Delete any connections associated with this folder
        const folderConnections = connections.filter(
            conn => conn.source === folderId || conn.target === folderId
        );

        for (const conn of folderConnections) {
            await deleteDoc(doc(firestore, 'users', auth.currentUser.uid, 'connections', conn.id));
        }

        if (selectedFolder?.id === folderId) {
            setSelectedFolder(null);
        }
    };

    const handleFolderMove = async (folderId, newPosition) => {
        await setDoc(
            doc(firestore, 'users', auth.currentUser.uid, 'folders', folderId),
            { position: newPosition },
            { merge: true }
        );
    };

    const handleUploadFile = async (file) => {
        if (!selectedFolder || !auth.currentUser) return;

        setLoading(true);
        try {
            const fileId = uuidv4();
            const storageRef = ref(storage, `users/${auth.currentUser.uid}/${fileId}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            const updatedItems = [
                ...selectedFolder.items,
                {
                    id: fileId,
                    type: file.type.startsWith('image/') ? 'image' : 'file',
                    name: file.name,
                    url: downloadURL,
                    createdAt: new Date().toISOString()
                }
            ];

            await setDoc(
                doc(firestore, 'users', auth.currentUser.uid, 'folders', selectedFolder.id),
                { items: updatedItems },
                { merge: true }
            );
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTextFile = async (textData) => {
        if (!selectedFolder || !auth.currentUser) return;

        const textId = uuidv4();
        const updatedItems = [
            ...selectedFolder.items,
            {
                id: textId,
                type: 'text',
                title: textData.title,
                content: textData.content,
                createdAt: new Date().toISOString()
            }
        ];

        await setDoc(
            doc(firestore, 'users', auth.currentUser.uid, 'folders', selectedFolder.id),
            { items: updatedItems },
            { merge: true }
        );
    };

    const deleteFile = async (fileId, fileType) => {
        if (!selectedFolder || !auth.currentUser) return;

        try {
            // Delete from storage if it's a file
            if (fileType === 'image' || fileType === 'file') {
                const fileRef = ref(storage, `users/${auth.currentUser.uid}/${fileId}`);
                await deleteObject(fileRef);
            }

            // Remove from folder items
            const updatedItems = selectedFolder.items.filter(item => item.id !== fileId);
            await setDoc(
                doc(firestore, 'users', auth.currentUser.uid, 'folders', selectedFolder.id),
                { items: updatedItems },
                { merge: true }
            );
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    const createConnection = async (sourceId, targetId, color) => {
        if (!auth.currentUser) return;

        const connectionId = uuidv4();
        await setDoc(
            doc(firestore, 'users', auth.currentUser.uid, 'connections', connectionId),
            {
                id: connectionId,
                source: sourceId,
                target: targetId,
                color: color || '#00ffff',
                createdAt: new Date().toISOString()
            }
        );
    };

    const deleteConnection = async (connectionId) => {
        if (!auth.currentUser) return;
        await deleteDoc(doc(firestore, 'users', auth.currentUser.uid, 'connections', connectionId));
    };

    return (
        <BoardContainer>
            {loading && (
                <Box sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 9999
                }}>
                    <CircularProgress size={80} color="primary" />
                </Box>
            )}

            {/* Folders around the edges */}
            {folders.map(folder => (
                <Folder
                    key={folder.id}
                    folder={folder}
                    onClick={() => setSelectedFolder(folder)}
                    onMove={handleFolderMove}
                    onCreateConnection={(color) => createConnection('board', folder.id, color)}
                    onDelete={() => deleteFolder(folder.id)}
                />
            ))}
            {/* Center area showing selected folder content */}
            <CenterArea>
                {selectedFolder ? (
                    selectedTextFile ? (
                        <TextFileViewer
                            textFile={selectedTextFile}
                            onClose={() => setSelectedTextFile(null)}
                            onDelete={() => {
                                deleteFile(selectedTextFile.id, selectedTextFile.type);
                                setSelectedTextFile(null);
                            }}
                        />
                    ) : (
                        <FolderContent
                            folder={selectedFolder}
                            onUploadClick={() => setOpenUploadModal(true)}
                            onCreateTextClick={() => setOpenTextModal(true)}
                            onTextFileClick={(textFile) => setSelectedTextFile(textFile)}  // open viewer here
                            onDeleteFile={deleteFile}
                        />
                    )
                ) : (
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Select a folder to view its contents
                    </Typography>
                )}
            </CenterArea>


            {/* Add new folder button */}
            <Tooltip title="Add New Folder" arrow>
                <FloatingButton
                    onClick={createNewFolder}
                    sx={{
                        bottom: 50,
                        right: 50,
                    }}
                >
                    <AddCircleIcon fontSize="large" />
                </FloatingButton>
            </Tooltip>

            {/* Connection strings */}
            {connections.map(conn => (
                <StringConnector
                    key={conn.id}
                    source={conn.source === 'board' ? { x: '50%', y: '50%' } : folders.find(f => f.id === conn.source)?.position}
                    target={conn.target === 'board' ? { x: '50%', y: '50%' } : folders.find(f => f.id === conn.target)?.position}
                    color={conn.color}
                    onDelete={() => deleteConnection(conn.id)}
                />
            ))}

            {/* Modals */}
            <FileUploadModal
                open={openUploadModal}
                onClose={() => setOpenUploadModal(false)}
                onUpload={handleUploadFile}
            />
            <TextFileModal
                open={openTextModal}
                onClose={() => setOpenTextModal(false)}
                onSubmit={handleCreateTextFile}
            />
        </BoardContainer>
    );
}