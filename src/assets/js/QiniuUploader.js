import 'timepack-qiniu'
import Util from './Util'
export default class QNUploader {
  constructor(buttonId, uptoken, afterFunc) {
    this.buttonId = buttonId;
    this.uptoken = uptoken;
    this.callback = afterFunc;
  }
  init() {
    let that = this;
    Qiniu.uploader({
      runtimes: 'html5,flash,html4',
      browse_button: this.buttonId,
      uptoken: this.uptoken,
      domain: Util.getConstant().DOMAIN,
      get_new_uptoken: false,
      max_file_size: '100mb', //没有会导致微信端614错误
      max_retries: 3,
      dragdrop: true,
      chunk_size: '10mb',
      auto_start: true,
      unique_names: true,
      save_key: false,
      filters: {
        mime_types: [{
          title: "Image files",
          extensions: "jpg,png,jpeg"
        }],
        max_file_size: "100mb"
      },
      log_level: 1,
      init: {
        'FilesAdded': function(up, files) {
          that.callback.added(up, files);
        },
        'BeforeUpload': function(up, file) {},
        'UploadProgress': function(up, file) {
          that.callback.progress(up, file);
        },
        'UploadComplete': function(up) {
          up.files = [];
          that.callback.complete();
        },
        'FileUploaded': function(up, file, info) {
          let res = $.parseJSON(info);
          that.callback.uploaded(encodeURI(res.key), file);
        },
        'Error': function(up, err, errTip) {
          that.callback.error(up, err, errTip);
        }
      }
    });
  }
}
