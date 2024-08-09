import axios from 'axios';
import 'media/css/quickUpload.scss';
import { useState } from 'react';

type TypedUploadResult = {
  media_id: number;
  media_filename: string;
  media_url: string;
  media_filetype: string;
};

const REACT_APP_AJAX_UPLOAD_URL = process.env.REACT_APP_AJAX_UPLOAD_URL;
interface IUpload {
  onSuccess?: (e: TypedUploadResult) => void;
  onError?: Function;
  title?: string;
  placeholder?: string | null;
  children?: any;
}
/**
 * Click to upload at the moment, support image only!
 */
export default function QuickUploadImage({ onSuccess, onError, title, children, placeholder }: IUpload) {
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [imagePlaceholder, setImagePlaceholder] = useState<string | null>();

  /**
   * return to main progress file, callback
   */
  function uploadSuccess(rep: any) {
    setImagePlaceholder(rep.media_url);
    onSuccess?.call(this, rep);
  }

  function uploadFail(rep: any) {
    onError?.call(this, rep);
  }

  /**
   * Step2. save to server
   *
   * @param {File} file
   */
  async function saveToServer(file: File) {
    const fd = new FormData();
    fd.append('files', file); // append selected file to the bag named 'file'
    try {
      setLoadingPercent(0);
      const xProgress = (progressEvent: any) => {
        let progress_percent = Math.floor(progressEvent.loaded / progressEvent.total) * 100;
        setLoadingPercent(progress_percent);
      };

      let result = await axios.post(REACT_APP_AJAX_UPLOAD_URL, fd, {
        onUploadProgress: xProgress,
      });
      uploadSuccess(result.data);
    } catch (_) {
      uploadFail(_);
    } finally {
      setLoadingPercent(0);
    }
  }

  /**
   * Step1. select local image
   *
   */
  function selectLocalImage(e: any) {
    e.preventDefault();

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files[0];
      // file type is only image.
      if (/^image\//.test(file.type)) {
        saveToServer(file);
      } else {
        return onError('upload_image_only');
      }
    };
  }

  return (
    <>
      <div className="quick_upload_outer">
        {loadingPercent > 0 && loadingPercent < 100 && <div className="loaded" style={{ width: loadingPercent + '%' }}></div>}
        <div className="quick_upload_wrap clickable" onClick={selectLocalImage}>
          <span className="quick_upload clickable">
            <svg width="24" height="24" viewBox="0 0 24 24" role="presentation">
              <path
                d="M3 4.995C3 3.893 3.893 3 4.995 3h14.01C20.107 3 21 3.893 21 4.995v14.01A1.995 1.995 0 0119.005 21H4.995A1.995 1.995 0 013 19.005V4.995zM10.5 16.5L9 15l-3 3h12v-2.7L15 12l-4.5 4.5zM8 10a2 2 0 100-4 2 2 0 000 4z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </span>
        </div>
        {<img src={imagePlaceholder ?? placeholder} alt="" className="imageAfterUploadPlaceholder" />}
        <div className="children_wrap">
          {title && <span className="textPlaceholder">{title}</span>}
          {children}
        </div>
      </div>
    </>
  );
}
