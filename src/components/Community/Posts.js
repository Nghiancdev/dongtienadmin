import { Component } from "react";
import { Link } from "react-router-dom";
import * as Env from "../../ultis/default";

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  passDataModal = (event, postId) => {
    event.preventDefault();
    this.props.onDeleteCallback({ title: "bài đăng", id: postId });
  };

  handlePinPost = (e, post) => {
    e.preventDefault();
    this.props.onPinCallback(post);
  };

  handleApproveCallback = (e, post) => {
    e.preventDefault();
    this.props.onApproveCallback(post);
  };

  handleReupCallback = (e, post) => {
    e.preventDefault();
    this.props.onReupCallbacks(post);
  };

  handleGetDataUpdate = (e, post) => {
    e.preventDefault();
    this.props.onGetDataUpdate(post);
  };

  showData = (posts, perPage, currentPage) => {
    const { storeCode } = this.props;
    let result = null;

    if (posts.length > 0) {
      const { permissions } = this.props;
      const { updatePms, deletePms, approvePms } = permissions;

      result = posts.map((post, index) => {
        const imageUrl = !post.images?.length
          ? Env.IMG_NOT_FOUND
          : post.images[0];

        let published;
        switch (post.status) {
          case 0:
            published = "Đang hiển thị";
            break;
          case 1:
            published = "Chờ duyệt";
            break;
          case 2:
            published = "Đang bị ẩn";
            break;
          default:
            published = "Chưa xác định";
        }
        if (post.status === 0 && post.is_pin) {
          published = "Được ghim";
        }
        let publishedStatus;
        switch (published) {
          case "Đang hiển thị":
            publishedStatus = "success";
            break;
          case "Chờ duyệt":
            publishedStatus = "primary";
            break;
          case "Đang bị ẩn":
            publishedStatus = "secondary";
            break;
          case "Được ghim":
            publishedStatus = "info";
            break;
          default:
            publishedStatus = "light";
        }
        return (
          <tr>
            <td>{perPage * (currentPage - 1) + (index + 1)}</td>
            <td>
              <img
                src={imageUrl}
                className="img-responsive"
                alt="Image"
                width="100px"
                height="100px"
              />
            </td>
            <td>
              <div
                style={{
                  display: "-webkit-box",
                  wordBreak: "break-word",
                  overflow: "hidden",
                  lineClamp: 3,
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  padding: "0 0.75rem",
                  verticalAlign: "middle",
                }}
              >
                {post.content}
              </div>
            </td>
            <td>
              <h5>
                <span class={`badge badge-${publishedStatus}`}>
                  {published}
                </span>
              </h5>
            </td>
            <td>{post.customer.name}</td>
            <td>
              <div
                style={{
                  display: "flex",
                }}
              >
                <button
                  onClick={(e) => this.handlePinPost(e, post)}
                  style={{ marginLeft: "10px" }}
                  class={`btn btn-info btn-sm ${updatePms ? "show" : "hide"}`}
                >
                  <i class="fa fa-thumbtack"></i>{" "}
                  {post.is_pin ? "Bỏ ghim" : "Ghim"}
                </button>
                <button
                  onClick={(e) => this.handleApproveCallback(e, post)}
                  style={{ marginLeft: "10px" }}
                  data-toggle="modal"
                  data-target="#removeModal"
                  class={`btn btn-secondary btn-sm ${
                    approvePms ? "show" : "hide"
                  }`}
                >
                  <i class="fa fa-eye-slash"></i>{" "}
                  {post.status === 0 ? "Ẩn" : "Duyệt"}
                </button>
                <button
                  onClick={(e) => this.handleGetDataUpdate(e, post)}
                  style={{ marginLeft: "10px" }}
                  class={`btn btn-warning btn-sm ${
                    updatePms ? "show" : "hide"
                  }`}
                  data-toggle="modal"
                  data-target="#updateModal"
                >
                  <i class="fa fa-edit"></i> Sửa
                </button>
                <button
                  onClick={(e) => this.handleReupCallback(e, post)}
                  style={{ marginLeft: "10px" }}
                  data-toggle="modal"
                  data-target="#removeModal"
                  class={`btn btn-success btn-sm ${
                    updatePms ? "show" : "hide"
                  }`}
                >
                  <i class="fa fa-repeat"></i> Đăng lại
                </button>
                <button
                  onClick={(e) => this.passDataModal(e, post.id)}
                  style={{ marginLeft: "10px" }}
                  data-toggle="modal"
                  data-target="#removeModal"
                  class={`btn btn-danger btn-sm ${deletePms ? "show" : "hide"}`}
                >
                  <i class="fa fa-trash"></i> Xóa
                </button>
              </div>
            </td>
          </tr>
        );
      });
    } else {
      return result;
    }
    return result;
  };

  render() {
    const { data = [], perPage = 20, currentPage = 1 } = this.props;

    return (
      <div>
        <div className="card shadow ">
          <div className="card-body">
            <div class="table-responsive">
              <table
                class="table table-border "
                id="dataTable"
                width="100%"
                cellspacing="0"
              >
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Hình ảnh</th>
                    <th>Nội dung</th>
                    <th>Trạng thái</th>
                    <th>Người đăng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>

                <tbody>{this.showData(data, perPage, currentPage)}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Posts;
