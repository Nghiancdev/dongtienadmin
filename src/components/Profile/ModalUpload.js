import React, { Component } from "react";
import * as helper from "../../ultis/helpers";
import { connect } from "react-redux";
import * as profileAction from "../../actions/profile"
import {compressed} from "../../ultis/helpers"

class ModalUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  onSave= async (e) =>{
    
    e.preventDefault();
    window.$('.modal').modal('hide');

    var file = this.fileUpload.files[0];
    if(typeof file !== "undefined" && file != "" && file != null )
    {
      window.$('#file-store').fileinput('clear');

      const fd = new FormData();
      fd.append('image' , await compressed(file))
      this.props.uploadImgUser(fd)
    }



  }

  componentDidMount() {
   
    helper.loadFileInput("file-store");
  }
  render() {
    return (
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="uploadModalProfile"
        data-keyboard="false"
        data-backdrop="static"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Upload ảnh</h4>

              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-hidden="true"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={this.onSave}
              role="form"
              action="#"
              method="post"
              id="removeForm"
            >
              <div className="modal-body">
                <form enctype="multipart/form-data">
                  <div className="form-group">
                    <div className="file-loading">
                      <input
                        id="file-store"
                        type="file"
                        className="file"
                        data-overwrite-initial="false"
                        data-min-file-count="2"
                        ref={(ref) => this.fileUpload = ref}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-default"
                  data-dismiss="modal"
                >
                  Đóng
                </button>
                <button type="submit" class="btn btn-info">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch, props) => {
  return {
    uploadImgUser: ( file) => {
      dispatch(profileAction.uploadImgUser(file));
    },
  };
};
export default connect(null, mapDispatchToProps)(ModalUpload);