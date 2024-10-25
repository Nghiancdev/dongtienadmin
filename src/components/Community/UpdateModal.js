import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import themeData from "../../ultis/theme_data";
import Upload from "../Upload";

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      images: [],
      post: {},
    };
  }

  componentDidMount() {
    const { storeCode } = this.props;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.post !== this.props.post) {
      this.setState({
        content: this.props.post.content,
        images: this.props.post.images,
        post: this.props.post,
      });
    }
  }

  onChange = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value,
    });
  };

  handleDataFromPostImg = (imgs) => {
    this.setState((prevState, props) => {
      var formdata = { ...prevState.form };
      formdata.images = imgs;
      return { form: formdata };
    });
  };

  setImages = (images) => {
    this.setState({ images });
  };

  handleImageData = (data) => {
    this.handleDataFromPostImg([...data]);
    this.setImages(data);
  };

  onSave = (e) => {
    e.preventDefault();

    this.props.onUpdateCallback(this.state.post.id, {
      content: this.state.content,
      images: this.state.images,
    });
    window.$(".modal").modal("hide");
  };

  render() {
    return (
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="updateModal"
        data-keyboard="true"
        data-backdrop="static"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div
              class="modal-header"
              style={{ backgroundColor: themeData().backgroundColor }}
            >
              <h4 class="modal-title">Chỉnh sửa bài đăng</h4>

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
              id="updateForm"
            >
              <div class="modal-body" style={{ maxHeight: "100%" }}>
                <div class="form-group">
                  <label for="content">Nội dung</label>
                  <input
                    type="text"
                    class="form-control"
                    id="content"
                    placeholder="Nhập nội dung"
                    autoComplete="off"
                    value={this.state.content}
                    onChange={(e) => {
                      this.setState((prevState) => {
                        return {
                          ...prevState,
                          content: e.target.value,
                        };
                      });
                    }}
                    name="content"
                  />
                </div>
                <div className="" style={{ display: "flex" }}>
                  <div class="form-group">
                    <label for="images">Hình ảnh</label>
                    <div style={{ width: "100%" }}>
                      <Upload
                        multiple
                        setFiles={this.handleImageData}
                        files={this.state.images}
                        images={this.state.images}
                        limit={10}
                        imageType="POST"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-default"
                  data-dismiss="modal"
                >
                  Đóng
                </button>
                <button type="submit" class="btn btn-warning">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.authReducers.login.authentication,
    alert: state.categoryBReducers.alert.alert_uid,
    permission: state.authReducers.permission.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showError: (error) => {
      dispatch(error);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
