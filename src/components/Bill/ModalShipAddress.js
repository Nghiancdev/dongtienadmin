import { Component } from "react";
import themeData from "../../ultis/theme_data";
import * as billAction from "../../actions/bill";
import * as shipmentAction from "../../actions/shipment";
import styled from "styled-components";
import { connect, shallowEqual } from "react-redux";
import history from "../../history";

const ModalDeleteOrderStyles = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  .modal-dialog {
    animation: popup 1s ease-in-out 1;
  }
  @keyframes popup {
    0% {
      opacity: 0;
      transform: translateY(-50px);
    }
    50% {
      opacity: 1;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

class ModalShipAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order_code: this.props.order_code,
      selectedItem: this.props.listShipmentAddress[0],
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("tesssssss===", nextProps);
    this.setState({ selectedItem: nextProps.order_code });
    this.setState({ selectedItem: nextProps.listShipmentAddress[0] });
  }

  showData = (listBakery) => {
    var result = null;

    if (listBakery.length > 0) {
      result = listBakery.map((data, index) => {
        return (
          <option
            value={data.storeId}
            key={index}
            className={
              data.is_default_order_online === true
                ? "active-branch-default"
                : ""
            }
          >
            {data.storeAddress}
          </option>
        );
      });
    }
    return result;
  };

  handleCloseModalDeleteOrder = () => {
    this.props.setCloseModalShipAddress(false);
  };
  handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const { listShipmentAddress } = this.props;

    // Tìm object của item đã chọn
    const selectedItem = listShipmentAddress.find(
      (item) => item.storeId === selectedValue
    );

    console.log("objext====", selectedItem);

    // Cập nhật state với item đã chọn
    this.setState({ selectedItem: selectedItem });
  };

  handleSubmit = () => {
    var { store_code } = this.props;
    const dataBody = {
      order_code: this.state.order_code,
      pickup: this.state.selectedItem,
    };

    this.props.createShipAhamove(store_code, dataBody);
    this.handleCloseModalDeleteOrder();
  };

  render() {
    const { listShipmentAddress } = this.props;
    const { selectedItem } = this.state;

    return (
      <ModalDeleteOrderStyles
        className="modal"
        style={{
          display: "block",
        }}
      >
        <div className="modal-dialog " role="document">
          <div className="modal-content">
            <div
              className="modal-header"
              style={{ backgroundColor: themeData().backgroundColor }}
            >
              <h4 style={{ color: "white" }}>Chọn Bakery</h4>
              <button
                type="button"
                onClick={this.handleCloseModalDeleteOrder}
                className="close"
              >
                <span>&times;</span>
              </button>
            </div>
            {/* <form> */}
            <div className="modal-body">
              <input type="hidden" name="remove_id_store" />
              <div className="alert-remove"></div>
              <div
                style={{ margin: "auto" }}
                className={`nav-item dropdown no-arrow mx-1`}
              >
                <select
                  id="input"
                  className="form-control border-input"
                  name="store"
                  onChange={this.handleSelectChange}
                  defaultValue={selectedItem?.storeId} // Đặt item đầu tiên làm mặc định
                >
                  {this.showData(listShipmentAddress)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                onClick={this.handleCloseModalDeleteOrder}
              >
                Đóng
              </button>
              <button onClick={this.handleSubmit} className="btn btn-warning">
                Xác nhận
              </button>
            </div>
            {/* </form> */}
          </div>
        </div>
      </ModalDeleteOrderStyles>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    statusDeleteOrder: state.billReducers.bill.statusDeleteOrder,
    listShipmentAddress: state.shipmentReducers.shipment.listShipmentAddress,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    deleteOrder: (store_code, order_code) => {
      dispatch(billAction.deleteOrder(store_code, order_code));
    },
    fetchAllShipAddress: (store_code, address) => {
      dispatch(shipmentAction.fetchAllShipAddress(store_code, address));
    },
    createShipAhamove: (store_code, data) => {
      dispatch(shipmentAction.createShipAhamove(store_code, data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalShipAddress);
