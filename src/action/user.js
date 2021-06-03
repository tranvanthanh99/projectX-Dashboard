import axios from "axios"
import { backEndLink } from "../config"

export const login = async (email, password) => {
  try {
    const res = await axios.post(`${backEndLink}/api/auth/login`, {
      email,
      password,
    });
    if (res.status === 200) {
      localStorage.setItem("token", res.data.token);
      return {
        ...res.data,
        success: true,
      }
    }
    else {
      return {
        ...res.data,
        success: false,
        error: res.data.error,
      }
    }
  }
  catch (error) {
    return {
      success: false,
      error: error,
    }
  }
}

export const getUser = async (token, offset, limit) => {
  try {
    const res = await axios.get(`${backEndLink}/api/user?offset=${offset}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      // localStorage.setItem("token", res.data.token);
      return {
        ...res.data,
        success: true,
      }
    }
    else {
      return {
        ...res.data,
        success: false,
        // error: res.data.error,
      }
    }
  }
  catch (error) {
    return {
      success: false,
      error: error,
    }
  }
}

export const getUserByID = async (token, id) => {
  try {
    const res = await axios.get(`${backEndLink}/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      // localStorage.setItem("token", res.data.token);
      return {
        ...res.data,
        success: true,
      }
    }
    else {
      return {
        ...res.data,
        success: false,
        // error: res.data.error,
      }
    }
  }
  catch (error) {
    return {
      success: false,
      error: error,
    }
  }
}

export const updateUser = async (token, id, updateOps) => {
  try {
    const res = await axios.post(`${backEndLink}/api/user/update/${id}`, {...updateOps},{
      headers: {
        Authorization: `Bearer ${token}`,
      }, 
    });
    if (res.status === 200) {
      return {
        ...res.data,
        success: true,
      }
    }
    else {
      return {
        ...res.data,
        success: false,
      }
    }
  }
  catch (error) {
    return {
      success: false,
      error: error,
    }
  }
}

export const createUser = async (token, userOps) => {
  try {
    const res = await axios.post(`${backEndLink}/api/user/createUser`, {...userOps},{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      return {
        ...res.data,
        success: true,
      }
    }
    else {
      return {
        ...res.data,
        success: false,
      }
    }
  }
  catch (error) {
    return {
      success: false,
      error: error,
    }
  }
}
