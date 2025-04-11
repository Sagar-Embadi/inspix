import {ToastContainer, toast } from "react-toastify"

export const showToastify = (type, message)=>{

    const config = {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    }

    if(type === "success"){
        toast.success(message)
    }
    else if(type === 'info'){
        toast.info(message,config)
    }
    else if(type === 'warning' ){
        toast.warning(message,config)
    }
    else if(type === 'error'){
        toast.error(message,config)
    }
    else{
        toast(message,config)
    }


}