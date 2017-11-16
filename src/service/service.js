import axios from 'axios';

axios.defaults.baseURL = '';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

import Util from 'assets/js/Util.js'

const Service = {
  wxConfig: (param) => {
    return axios.get(`/synergy/xc/photo/getConfig`, { params: param }).then(response => {
      return response.data;
    });
  },
  getProduct: (param) => {
    return axios.get(`/synergy/xc/photo/getProductById`, { params: param }).then(response => {
      return response.data;
    });
  },

  getLayout: (param) => {
    return axios.get(`/synergy/xc/photo/getLayoutInfo`, { params: param }).then(response => {
      return response.data;
    });
  },

  getQiniuToken: () => {
    return axios.get(`/synergy/xc/common/getQNToken?space=photos`).then(response => {
      return response.data;
    });
  },

  getImageList: (param) => {
    return axios.get(`/synergy/xc/photo/getPhotoList`, { params: param }).then(response => {
      return response.data;
    });
  },

  deleteImage: (param) => {
    return axios.post(`/synergy/xc/photo/deleteNativeImg`, param).then(response => {
      return response.data;
    });
  },

  getImageInfo: (param) => {
    return axios.get(`${Util.getConstant().DOMAIN}${param}?imageInfo`).then(response => {
      return response.data;
    });
  },

  saveImage: (param) => {
    return axios.post(`/synergy/xc/photo/saveImage`, param).then(response => {
      return response.data;
    })
  },

  uploadImage: (param) => {
    return axios.post(`/synergy/xc/photo/uploadImage`, param).then(response => {
      return response.data;
    });
  }
}


export default Service;
