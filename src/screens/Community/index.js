import React, { Component } from "react";
import Sidebar from "../../components/Partials/Sidebar";
import Topbar from "../../components/Partials/Topbar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import * as communityApi from "../../data/remote/community";
import Posts from "../../components/Community/Posts";
import { connect } from "react-redux";
import permission from "../../ultis/permission";
import Pagination from "../../components/Community/Pagination";
import Loading from "../Loading";
import DeleteModal from "../../components/Community/DeleteModal";
import Select from "react-select";
import Alert from "../../components/Partials/Alert";
import * as Types from "../../constants/ActionType";
import UpdateModal from "../../components/Community/UpdateModal";
import NotAccess from "../../components/Partials/NotAccess";

class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      links: [],
      currentPage: 1,
      isLoading: false,
      permissions: {},
      modal: {
        title: "",
        id: "",
      },
      searchValue: "",
      selectedStatusPost: null,
      alert: {
        content: "",
      },
      post: {},
    };
  }

  handleGetDataUpdate = (post) => {
    this.setState({ post });
  };

  handleSetPosts = (posts) => {
    console.log("posts", posts);
    this.setState({ posts });
  };

  handleSetLinks = (links) => {
    this.setState({ links });
  };

  handleSetCurrentPage = (page) => {
    this.setState({ currentPage: page });
  };

  handleSetLoading = (isLoading) => {
    console.log("isLoading", isLoading);
    this.setState({ isLoading });
  };

  handleDeleteCallback = (modal) => {
    this.setState({ modal });
  };

  handlePinCallback = (post) => {
    const { store_code: storeCode } = this.props.match.params;
    const { posts } = this.state;
    this.setState({ isLoading: true });
    const dataUpdate = {
      community_post_id: post.id,
      is_pin: !post.is_pin,
      status: 0,
    };
    communityApi
      .pinPost(storeCode, post.id, dataUpdate)
      .then((result) => {
        const postUpdated = posts.map((postItem) =>
          postItem.id === post.id
            ? { ...postItem, is_pin: !postItem.is_pin, status: 0 }
            : postItem
        );
        this.setState({ posts: postUpdated });
        this.props.showMsg(result);
      })
      .catch((err) => {
        this.props.showError("Đã có lỗi xảy ra");
        this.setState({
          alert: {
            content: err.message || "Đã có lỗi xảy ra",
          },
        });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  handleApproveCallback = (post) => {
    const { store_code: storeCode } = this.props.match.params;
    const { posts } = this.state;
    this.setState({ isLoading: true });

    const dataUpdate = {
      ...post,
      status: post.status === 0 ? 2 : 0,
    };
    delete dataUpdate.customer;
    communityApi
      .updatePostById(storeCode, post.id, dataUpdate)
      .then((result) => {
        const postUpdated = posts.map((postItem) =>
          postItem.id === post.id
            ? { ...postItem, status: postItem.status === 0 ? 2 : 0 }
            : postItem
        );
        this.setState({ posts: postUpdated });
        this.props.showMsg(result);
      })
      .catch((err) => {
        this.props.showError("Đã có lỗi xảy ra");
        this.setState({
          alert: {
            content: err.message || "Đã có lỗi xảy ra",
          },
        });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  handleReupCallback = (post) => {
    const { store_code: storeCode } = this.props.match.params;
    const { posts } = this.state;
    this.setState({ isLoading: true });

    const dataUpdate = {};
    communityApi
      .reupPost(storeCode, post.id, dataUpdate)
      .then((result) => {
        const postUpdated = posts.map((postItem) =>
          postItem.id === post.id ? { ...postItem, status: 0 } : postItem
        );
        console.log("postUpdated", postUpdated);
        this.setState({ posts: postUpdated });
        this.props.showMsg(result);
      })
      .catch((err) => {
        this.props.showError("Đã có lỗi xảy ra");

        this.setState({
          alert: {
            content: err.message || "Đã có lỗi xảy ra",
          },
        });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  handleSearch = (e) => {
    e.preventDefault();
    const { store_code: storeCode } = this.props.match.params;
    const { searchValue } = this.state;
    var params = `?search=${searchValue}`;
    this.setState({ isLoading: true });
    communityApi
      .fetchAllPosts(storeCode, params)
      .then((results) => {
        const posts = results.data.data.data;
        const links = results.data.data.links;
        this.setState({ posts, links });
      })
      .catch((err) => {
        console.log("error", err);
        this.setState({
          alert: {
            content: err.message || "Đã có lỗi xảy ra",
          },
        });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  handleUpdateCallback = (postId, dataUpdate) => {
    const { store_code: storeCode } = this.props.match.params;
    const { posts } = this.state;
    this.setState({ isLoading: true });

    communityApi
      .updatePostById(storeCode, postId, dataUpdate)
      .then((result) => {
        const postUpdated = posts.map((post) =>
          post.id === postId ? result.data.data : post
        );
        this.setState({ posts: postUpdated });
        this.props.showMsg(result);
      })
      .catch((err) => {
        this.props.showError("Đã có lỗi xảy ra");
        this.setState({
          alert: {
            content: err.message || "Đã có lỗi xảy ra",
          },
        });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  componentDidMount() {
    const { store_code } = this.props.match.params;
    this.setState({ isLoading: true });
    const params = `?limit=10`;
    communityApi
      .fetchAllPosts(store_code, params)
      .then((results) => {
        const posts = results.data.data.data;
        const links = results.data.data.links;
        this.setState({ posts, links });
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  componentDidUpdate(nextProps, prevState) {
    if (
      !this.state.loading &&
      typeof nextProps.permission.product_list != "undefined"
    ) {
      const permissions = nextProps.permission;
      const {
        communication_add: createPms,
        communication_update: updatePms,
        communication_delete: deletePms,
        communication_approve: approvePms,
        communication_list: readPms,
      } = permissions;
      this.setState({
        loading: true,
        permissions: {
          createPms,
          updatePms,
          deletePms,
          approvePms,
          readPms,
        },
      });
    }

    if (this.state.selectedStatusPost !== prevState.selectedStatusPost) {
      const status = this.state.selectedStatusPost?.value;
      const { store_code: storeCode } = this.props.match.params;

      this.setState({ isLoading: true });
      let params = status ? `?status=${status}` : "";

      if (status == 3) {
        params = `?is_pin=true`;
      }
      communityApi
        .fetchAllPosts(storeCode, params)
        .then((results) => {
          const posts = results.data.data.data;
          const links = results.data.data.links;
          this.setState({ posts, links });
        })
        .catch((err) => {
          console.log("error", err);
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  }

  render() {
    var { store_code } = this.props.match.params;
    var { permissions, isLoading, searchValue } = this.state;

    return (
      <div id="wrapper">
        <Sidebar store_code={store_code} />
        <div className="col-10 col-10-wrapper">
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <Topbar store_code={store_code} />
              <div className="container-fluid">
                <div>
                  <h4 className="h4 title_content mb-0 text-gray-800">
                    Bài đăng
                  </h4>
                  <br />

                  <div className="card shadow mb-4">
                    <div className="card-header">
                      <div class="row">
                        <form onSubmit={this.handleSearch}>
                          <div
                            class="input-group mb-6"
                            style={{ padding: "0 20px" }}
                          >
                            <input
                              style={{ maxWidth: "400px", minWidth: "300px" }}
                              type="search"
                              name="txtSearch"
                              value={searchValue}
                              onChange={(e) => {
                                this.setState({
                                  searchValue: e.target.value,
                                });
                              }}
                              class="form-control"
                              placeholder="Tìm theo tên bài đăng"
                            />
                            <div class="input-group-append">
                              <button class="btn btn-primary" type="submit">
                                <i class="fa fa-search"></i>
                              </button>
                            </div>
                          </div>
                        </form>

                        <div
                          style={{
                            minWidth: "230px",
                          }}
                        >
                          <Select
                            closeMenuOnSelect={true}
                            options={[
                              { value: "", label: "Tất cả" },
                              { value: "0", label: "Đang hiển thị" },
                              { value: "1", label: "Chờ duyệt" },
                              { value: "2", label: "Đang bị ẩn" },
                              { value: "3", label: "Được ghim" },
                            ]}
                            placeholder={"Chọn trạng thái bài đăng"}
                            value={this.state.selectedStatusPost}
                            onChange={(selectedOption) => {
                              this.setState({
                                selectedStatusPost: selectedOption,
                              });
                            }}
                            noOptionsMessage={() => "Không tìm thấy kết quả"}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      {isLoading ? (
                        <Loading />
                      ) : (
                        <>
                          <Posts
                            data={this.state.posts}
                            storeCode={store_code}
                            permissions={permissions}
                            onDeleteCallback={this.handleDeleteCallback}
                            onPinCallback={this.handlePinCallback}
                            onApproveCallback={this.handleApproveCallback}
                            onReupCallbacks={this.handleReupCallback}
                            onGetDataUpdate={this.handleGetDataUpdate}
                            currentPage={this.state.currentPage}
                          />
                          <Pagination
                            storeCode={store_code}
                            links={this.state.links}
                            onSetPosts={this.handleSetPosts}
                            onSetLinks={this.handleSetLinks}
                            onSetCurrentPage={this.handleSetCurrentPage}
                          />
                          <DeleteModal
                            storeCode={store_code}
                            modal={this.state.modal}
                            posts={this.state.posts}
                            onSetPosts={this.handleSetPosts}
                            onSetLoading={this.handleSetLoading}
                          />
                          <UpdateModal
                            storeCode={store_code}
                            onUpdateCallback={this.handleUpdateCallback}
                            post={this.state.post}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Alert type={Types.ALERT_UID_STATUS} alert={this.state.alert} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    permission: state.authReducers.permission.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showError: (error) => {
      dispatch({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "danger",
          title: "Lỗi",
          disable: "show",
          content: error,
        },
      });
    },
    showMsg: (res) => {
      dispatch({
        type: Types.ALERT_UID_STATUS,
        alert: {
          type: "success",
          title: "Thành công ",
          disable: "show",
          content: res.data.msg,
        },
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);
