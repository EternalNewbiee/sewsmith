import React, { useState } from 'react';

type FileUploadProps = {
  onFileUpload: (file: File) => void;
  onUploadComplete: () => void;
  onRedirect: () => void; // New prop for handling redirection
  uploadComplete: boolean; // Prop for upload completion status
};

const CustomDesign: React.FC<FileUploadProps> = ({ onFileUpload, onUploadComplete, onRedirect, uploadComplete }) => {
  const [uploaded, setUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      setUploaded(true);
      onUploadComplete();
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleContainerClick = () => {
    onRedirect(); 
  };

  const handleImageClick = () => {
    if (uploadComplete) {
      onRedirect(); 
    }
  };

  return (
    <div
      className="customcard cursor bg-gray-200 h-250 w-[290px] border rounded-lg cursor-pointer border-gray-400 relative"
      onClick={handleContainerClick} 
    >
      <div className="details-container h-[286px] bg-white flex flex-col justify-center" onClick={handleContainerClick}>
        <div className="details-container h-full w-full bg-white rounded-b-lg p-2 flex flex-col justify-center gap-5" onClick={handleContainerClick}>
          {!uploaded && (
            <>
              <h3 className='text-center font-bold'>Add Custom Design</h3>
              <input
                type="file"
                accept=".png, .jpg, .jpeg, .pdf, .doc, .docx, .rtf"
                onChange={handleFileChange}
                className="order-button bg-[#ffd700] px-5 py-3 rounded-[800px] text-white cursor-pointer"
              />
            </>
          )}

          {uploaded && imageUrl && (
            <div onClick={handleImageClick}>
              <img src={imageUrl} alt="Uploaded Design" className="mx-auto" style={{ maxHeight: '200px', maxWidth: '100%' }} />
              <p className="text-center text-gray-600 mt-2">Uploaded Image</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomDesign;