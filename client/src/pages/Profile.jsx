import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { updateUserStart,updateUserFailure,updateUserSuccess, deleteUserFailure, deleteUserSuccess, deleteUserStart, signOutStart, signOutFailure, signOutSuccess } from "../redux/user/userSlice";
import { Link } from 'react-router-dom';


export default function Profile() {
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSucess, setUpdateSuccess] = useState(false);
 
  const fileRef = useRef(null);
  const { currentUser,loading,error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadedURL) => {
          setFormData({ ...formData, avatar: downloadedURL });
        });
      }
    );
  };


  const handleChange = (e)=>{
    setFormData({...formData , [e.target.id]:e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();  //prevent refreshing page
    try{
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
        body: JSON.stringify(formData),
          
      })
      const data = await res.json();
      if(data.success===false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    }catch(error){
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async()=>{
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
        })
        const data = await res.json();
        if(data.success===false){
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
    }
    catch(error){
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async()=>{
      try{
        dispatch(signOutStart());
        const res=await fetch('/api/auth/signout');
        const data = await res.json();
        if(data.success===false){
          dispatch(signOutFailure(data.message));
          return;
          }
          dispatch(signOutSuccess());
          // localStorage.removeItem('token');
          //window.location.reload();
          }
          catch(error){
            dispatch(signOutFailure(error.message));
            
      }
  }



  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form  onSubmit={handleSubmit}  className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        <p className="text-sm self-center" >
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload (image must be less than 2Mb) </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700"> {`Uploading ${filePerc} `} </span>
          ) : filePerc === 100 ? (
            <span className="text-green-700"> Image successfully uploaded! </span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg "
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg "
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg "
          id="password"
          onChange={handleChange}
        />
        <button  disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ?'Loading...': 'Update'}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"} >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span  onClick={handleDeleteUser} className="text-red-700 cursor-pointer"> Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer"> Sign out</span>
      </div>
      
          <p className="text-red-700 mt-5" > {error ? error : ''} </p>
          <p className="text-green-700 mt-5" > {updateSucess ? 'User is updated successfully' : ''} </p>

    </div>
  );
}
