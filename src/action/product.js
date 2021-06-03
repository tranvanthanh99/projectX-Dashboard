import axios from "axios"
import { backEndLink } from "../config"

export const getProduct = async (offset, limit) => {
  try {
    const res = await axios.get(`${backEndLink}/api/product/browse?offset=${offset}&limit=${limit}&admin=${true}`)
    return {
      success: true,
      ...res.data
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export const getProductData = async (urlKey) => {
  try {
    const res = await axios.get(`${backEndLink}/api/product/${urlKey}`)
    return {
      success: true,
      ...res.data
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export const updateProductData = async (id, updateOps) => {
  try {
    const res = await axios.post(`${backEndLink}/api/product/update/${id}`, {
      ...updateOps
    })
    return {
      success: true,
      ...res.data
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}

export const createProduct = async (updateOps) => {
  try {
    const res = await axios.post(`${backEndLink}/api/product/createProduct`, {
      ...updateOps
    })
    return {
      success: true,
      ...res.data
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}
