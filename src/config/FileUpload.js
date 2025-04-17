import axiosMerchant from '../api/merchantRequest';

class FileUploadService {
  upload(file, url) {
    let formData = new FormData();
    const fileName = new Date().getTime()+ '.jpeg';
    formData.append("file", file, fileName);

    return axiosMerchant.post(`/files`, formData);
  }

  uploadGeneral(file, url) {
    let formData = new FormData();
    formData.append("file", file)

    return axiosMerchant.post(`/files`, formData);
  }

}
// eslint-disable-next-line
export default new FileUploadService();