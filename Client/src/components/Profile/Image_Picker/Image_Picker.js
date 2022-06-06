import React, { useRef, useEffect, useCallback } from 'react';
import * as ActionCreators from '../../../Redux/Actions/actions';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import default_img_src from '../default_user_image';

export const Image_Picker = ({input_data}) =>
{
    let lang = input_data.lang.language;
    const langObj =
    {
        ua:
        {
            warningSize: "Розмір файла має бути не більше 5 мб",
            warningType: "Тип файла має бути jpg png x-png jpeg",
            imageBgSpan: "Ваш аватар",
            changeImgBtn: "Змінити фотографію",
            popupHeaderTitle: "Завантаження нового фото",
            popupContentInfo: "Ви можете завантажити зображення в форматі JPG PNG X-PNG JPEG",
            popupChooseImgBtn: "Виберіть файл",
            popupFooterInfo: "Розмір фотографії має бути не більше 5 мб",
            popupSaveBtn: "Зберегти"
        },
        ru:
        {
            warningSize: "Размер файла должен быть не более 5 мб",
            warningType: "Тип файла должен быть jpg png x-png jpeg",
            imageBgSpan: "Ваш аватар",
            changeImgBtn: "Сменить фотографию",
            popupHeaderTitle: "Загрузка новой фотографии",
            popupContentInfo: "Вы можете загрузить изображения в формате JPG PNG X-PNG JPEG",
            popupChooseImgBtn: "Выберите файл",
            popupFooterInfo: "Размер загружаемой фотографии должен не превышать 5 мб",
            popupSaveBtn: "Сохранить"
        },
        en:
        {
            warningSize: "File size must be less 5 mb",
            warningType: "File type must be jpg png x-png jpeg",
            imageBgSpan: "Your avatar",
            changeImgBtn: "Change image",
            popupHeaderTitle: "Choosing new image",
            popupContentInfo: "You can upload images as JPG PNG X-PNG JPEG",
            popupChooseImgBtn: "Choose file",
            popupFooterInfo: "File size must be less 5 mb",
            popupSaveBtn: "Save"
        }
    }

    const maxFileSize = 5000000; //bytes == 5mb
    const acceptedFileTypes = "image/x-png, image/png, image/jpg, image/jpeg";
    const acceptedFileTypesArray = acceptedFileTypes.split(',').map(item => (item.trim()));
    const inpFileRef = useRef();
    let canvasRef = useRef();
    let imgRef = useRef(null);
    let reader = new FileReader();

    reader.onload = (e) => // тут все работает нормально
    {
        input_data.dispatch(ActionCreators.change_input_data_temporary_img_src(e.target.result));
        input_data.dispatch(ActionCreators.change_input_data_img_show_popup_crop_wrapper("img_show_crop_wrapper_active"));
    };

    let onFileChange = (e) => // тут все работает нормально
    {
        let file = e.target.files[0];
        if(file)
        {
            const currentFileSize = file.size;
            const currentFileType = file.type;
            
            if(currentFileSize > maxFileSize) 
            {
                alert(langObj[lang].warningSize);
            }
            else if(!acceptedFileTypesArray.includes(currentFileType)) 
            {
                alert(langObj[lang].warningType);
            }
            else reader.readAsDataURL(file);
        }
        inpFileRef.current.value = "";
    }

    let onCropChange = (crop, percentCrop) => // тут все работает нормально
    {
        if(input_data.img_show_popup !== "")
        {
            input_data.dispatch(ActionCreators.change_input_data_img_crop_info(percentCrop));
            getCroppedImg(percentCrop);
        }
    }

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);

    let getCroppedImg = (crop) => // here we draw the cropped image on a square of canvas 
    { 
        const image = imgRef.current;
        const canvas = canvasRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;
        canvas.width = image.width * (crop.width / 100) * pixelRatio;  //image.width * (crop.width / 100)
        canvas.height = image.height * (crop.height / 100) * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
          image,
          (crop.x / 100) * image.width * scaleX,
          (crop.y / 100) * image.height * scaleY,
          image.width * (crop.width / 100) * scaleX,
          image.height * (crop.height / 100) * scaleY,
          0,
          0,
          image.width * (crop.width / 100),
          image.height * (crop.height / 100),
        );
    }

    let onImageSaveClick = () =>
    {
        const base64Image = canvasRef.current.toDataURL('image/jpeg');
        input_data.dispatch(ActionCreators.change_input_data_img_src(base64Image));
        onClosePopup();
    }

    const onClosePopup = () => // скидывем все
    {
        input_data.dispatch(ActionCreators.change_input_data_img_show_popup(""));
        window.setTimeout(()=>
        {
            input_data.dispatch(ActionCreators.change_input_data_img_show_popup_crop_wrapper(""));
            input_data.dispatch(ActionCreators.change_input_data_temporary_img_src(""));
        },300);
    }

    let onShowPopup = () =>
    {   
        input_data.dispatch(ActionCreators.change_input_data_img_show_popup("img_show_popup_active"));
    }

    let avar_src = input_data.img_src === ""? default_img_src : input_data.img_src; 
    return (

        <div className="profile_img_choose_wrapper">

            <div className= {"profile_img_choose_popup_wrapper " + input_data.img_show_popup}> 

                <div className="profile_img_choose_popup" >

                    <div className="popup_header profile_img_choose_popup_header">
                            <span>{langObj[lang].popupHeaderTitle}</span>
                            <button className = "close_popup_btn" onClick = {onClosePopup}></button>
                    </div>

                    <div className= {"profile_img_choose_popup_pick_file_wrapper " + input_data.img_show_crop_wrapper}>

                        <div className="profile_img_choose_popup_pick_file_block_content">

                            <span>{langObj[lang].popupContentInfo}</span>
                            <label id = "inpFile" className = "profile_data_save_btn">
                                <input type="file" accept= {acceptedFileTypes} onChange = {onFileChange} ref = {inpFileRef}/> 
                                {langObj[lang].popupChooseImgBtn}
                            </label>

                        </div>

                        <div className="profile_img_choose_popup_pick_file_block_footer">
                            <span>{langObj[lang].popupFooterInfo}</span>
                        </div>

                    </div>

                    <div className= {"profile_img_choose_popup_crop_wrapper " + input_data.img_show_crop_wrapper}>
                        <div className="profile_img_choose_popup_crop_content_wrapper">
                            <div className="profile_img_choose_popup_crop_image">
                                <ReactCrop src={input_data.temporary_img_src} crop = {input_data.img_crop_info} onChange = {onCropChange} onImageLoaded = {onLoad} keepSelection = "true"/>
                            </div>

                            <div className="profile_img_choose_popup_crop_preview_block">
                                <canvas ref = {canvasRef}></canvas> 
                                <button className = "profile_data_save_btn" onClick = {onImageSaveClick}>{langObj[lang].popupSaveBtn}</button>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <div className="profile_img_choose_wrapper_avatar">
                <span className = "none_span" >{langObj[lang].imageBgSpan}</span>
                <img src= {avar_src}  alt=""/>
            </div>
            
            <button id = "avatar_change_btn" className='light_gray_btn' onClick = {onShowPopup}>{langObj[lang].changeImgBtn}</button> 

        </div>

    )
}