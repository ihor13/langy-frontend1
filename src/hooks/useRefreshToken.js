import axios from "../api/axios";
import useAuth from "./useAuth";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthProvider";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const authContext = useContext(AuthContext);
  // 1. call this func when the initial request fails or accessToken is expired, then it will refresh get a new token and we will retry the request
  const refresh = async () => {
    //authContext.setAuth(data);
    console.log(JSON.stringify({ refresh: authContext.auth.refreshToken }));
    const response = await axios.post("https://langy.onrender.com/api/user/token/refresh/", 
      JSON.stringify({ refresh: authContext.auth.refreshToken }), {
        headers: { 'Content-Type': 'application/json' },
        //`https://langy.onrender.com/api/user/token/refresh/`
        // allow to sent cookie with the request
        // * this request going to to sent along our cookie that has the response token. it's a secure cookie that we never see inside of our javascript code, but axios can send it to backend endpoint that we need it to.
        //withCredentials: true,
      }
    );
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.access);
      return { ...prev, accessToken: response.data.access };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
