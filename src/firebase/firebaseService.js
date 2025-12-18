import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

const COLLECTION_NAME = 'travelEntries';

// Upload file to Firebase Storage
export const uploadFile = async (file, folder = 'images') => {
  try {
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    // Upload with metadata to preserve quality
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name
      }
    };
    
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Get all entries
export const getEntries = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const entries = [];
    querySnapshot.forEach((doc) => {
      entries.push({ id: doc.id, ...doc.data() });
    });
    return entries;
  } catch (error) {
    console.error('Error getting entries:', error);
    return [];
  }
};

// Add new entry
export const addEntry = async (entryData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...entryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...entryData };
  } catch (error) {
    console.error('Error adding entry:', error);
    throw error;
  }
};

// Update entry
export const updateEntry = async (id, entryData) => {
  try {
    const entryRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(entryRef, {
      ...entryData,
      updatedAt: serverTimestamp()
    });
    return { id, ...entryData };
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
};

// Delete entry
export const deleteEntry = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
};
