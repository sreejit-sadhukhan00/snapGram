import React, {useCallback, useState} from 'react'
import {useDropzone,FileWithPath} from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploaderProps={
  fieldChange:(FILES:File[])=>void;
  mediaUrl:string;
}


function FileUploader({fieldChange,mediaUrl}:FileUploaderProps){
    const [fileurl, setFileurl] = useState(mediaUrl);
    const [file, setFile] = useState<File[]>([])

    // onDrop function creation ====>
    const onDrop = useCallback(
      (acceptedFiles: FileWithPath[]) => {
        setFile(acceptedFiles);
        fieldChange(acceptedFiles);
        setFileurl(URL.createObjectURL(acceptedFiles[0]));
      }, [file])

      const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept:{
            'image/*':['.png','.jpeg','.jpg','.svg']
        }
    })




  return (
    <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3  rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer'/>
      {
        fileurl ?( 
          <>
            <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
              <img src={fileurl} alt="uploader png"
              className='file_uploader-img'
              />
             
              </div>
             <p className='file_uploader-label text-gray-500'> click or drag photo to replace</p>
              </>
        ): (
            <div className='.file_uploader-box'>
               <img src="\assets\icons\file-upload.svg" alt="filelogo" height={76}   width={77}/>
                
                <h3 className='text-gray-300 mt-4 mb-0.5'>Drag Photo Here</h3>
               <h3 className='text-gray-500 small-regular mb-6 '> SVG ,PNG , JPG</h3>

               <Button className='shad-button_dark_4'>Select from computer</Button>
            </div>
        )
          
      }
    </div>
  )
}

export default FileUploader;