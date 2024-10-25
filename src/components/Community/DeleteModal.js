import React, { Component } from "react";
import { connect } from "react-redux";
import themeData from "../../../src/ultis/theme_data";
import * as communityApi from "../../data/remote/community";

class Modal extends Component {
  onSave = (e) => {
    const { posts, modal, onSetPosts, onSetLoading } = this.props;

    e.preventDefault();

    var { storeCode } = this.props;
    onSetLoading(true);
    communityApi
      .deletePostById(storeCode, modal.id)
      .then(() => {
        const postUpdated = posts.filter((post) => post.id !== modal.id);
        onSetPosts(postUpdated);
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        onSetLoading(false);
      });
    window.$(".modal").modal("hide");
  };

  render() {
    var { modal } = this.props;

    return (
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="removeModal"
        data-keyboard="false"
        data-backdrop="static"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div
              class="modal-header"
              style={{ backgroundColor: themeData().backgroundColor }}
            >
              <h4 style={{ color: "white" }}>Thông báo</h4>{" "}
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form
              onSubmit={this.onSave}
              role="form"
              action="#"
              method="post"
              id="removeForm"
            >
              <div class="modal-body">
                <input type="hidden" name="remove_id_store" />
                <div class="alert-remove"></div>
                Bạn có muốn xóa {modal.title} không?
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
                  Xóa
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
