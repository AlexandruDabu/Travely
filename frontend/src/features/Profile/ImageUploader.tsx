import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../../app/hooks/useAuth';

const CLOUDINARY_NAME = 'dzcbnpola';
const UPLOAD_PRESET = 'demoUpload';
const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`;

interface ImageUploaderProps {
  initialImageUrl: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({initialImageUrl}) => {
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {updateImage, user} = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl); // Preview the selected image
      setNewImageFile(file); // Store the selected file for later upload
    }
  };

  const handleSave = async () => {
    if (newImageFile) {
      setLoading(true);
      try {
        const uploadedUrl = await uploadImageToCloudinary(newImageFile);
        setImageUrl(uploadedUrl); // Update to the final uploaded image
        setNewImageFile(null); // Clear the file after successful upload
        updateImage(user?.id, uploadedUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setImageUrl(initialImageUrl); // Revert to the initial image
    setNewImageFile(null); // Clear the selected file
  };

  return (
    <>
      <label htmlFor="image-upload" className="cursor-pointer">
        <div className="relative w-32 h-32 sm:w-48 sm:h-48 lg:w-48 lg:h-48 rounded-full overflow-hidden mb-6">
            <img
            src={imageUrl || '/user.png'}
            alt="Profile"
            className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gray-100 opacity-0 hover:opacity-70 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-gray-500 text-lg font-semibold">Change Image</span>
            </div>
        </div>
    </label>

      {loading && <p className="text-gray-600">Uploading...</p>}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden hover:bg-gray-200"
      />
      {newImageFile && !loading && (
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
};

const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await axios.post(apiUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload image');
  }
};

export default ImageUploader;
