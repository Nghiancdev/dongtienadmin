import React, { Component } from "react";

import { connect } from "react-redux";
import * as Types from "../../constants/ActionType";
// import Alert from "../../Partials/Alert";

import { formatNumberV2 } from "../../ultis/helpers";

import styled from "styled-components";
import Alert from "../Partials/Alert";

const CardStyles = styled.div`
  .discount {
    margin-top: 20px;
    .discount__header {
      display: flex;
      width: 100%;
      padding: 0 8px;
      border-bottom: 1px solid #e3e6f0;
      font-weight: 600;
      column-gap: 16px;
      &__title {
        width: 16%;
      }
      &__from {
        width: 24%;
      }
      &__to {
        width: 24%;
      }
      &__price {
        width: 24%;
      }
      &__action {
        width: 12%;
      }
    }
    .discount__main {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      row-gap: 15px;
      .discount__content {
        display: flex;
        width: 100%;
        padding: 0 8px;
        column-gap: 16px;
        &__title {
          width: 16%;
        }
        &__from {
          width: 24%;
        }
        &__to {
          width: 24%;
        }
        &__price {
          width: 24%;
        }
        &__action {
          width: 12%;
          svg {
            cursor: pointer;
            width: 20px;
            height: 20px;
            transition: all 0.5s;
            &:hover {
              transform: scale(1.1);
            }
          }
        }
        &__item {
          display: flex;
          flex-direction: column;
          row-gap: 3px;
          > div {
            color: red;
            font-size: 13px;
          }
        }
      }
      .discount__end {
        display: flex;
        width: 100%;
        padding: 0 8px;
        column-gap: 16px;
        &__title {
          width: 16%;
        }
        &__from {
          width: 24%;
          margin-left: -10px;
        }
      }
    }
  }
`;

const initPriceRange = {
  min_distance: "",
  max_distance: "",
  fee: "",
  errors: {
    min_distance: "",
    max_distance: "",
    fee: "",
  },
};

class ConfigShip extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //validate số lượng
  validate = (e, index) => {
    const value = e.target.value;
    const name = e.target.name;
    const { setShipList, setShipListsss } = this.props;
    let textError = "";
    if (!value) {
      textError = "Không được để trống trường này!";
    } else if (index === 0 && parseInt(value) < 0) {
      textError = "Khoảng cách ít nhất phải lớn hơn 1";
    } else if (
      parseInt(value) < parseInt(setShipList[index]?.min_distance) &&
      name === ""
    ) {
      textError = "Giá trị không được nhỏ hơn số lượng bắt đầu";
    } else {
      textError = "";
    }

    return textError;
  };

  // validate danh sách số lượng không hợp lệ
  validateList = (updatedDiscountList, name, value, index) => {
    const messageErrorDefault = "Giá trị nhập không hợp lệ";
    const newDiscountList = [...updatedDiscountList];
    if (value && name !== "fee") {
      updatedDiscountList.forEach((element, i) => {
        if (i < index) return;
        if (i === index) {
          newDiscountList[i].errors.max_distance =
            name === "min_distance" &&
            parseInt(value) >= parseInt(newDiscountList[i].max_distance)
              ? messageErrorDefault
              : "";
          if (
            name === "max_distance" &&
            parseInt(value) < parseInt(newDiscountList[i].min_distance)
          ) {
            newDiscountList[i].errors.max_distance = messageErrorDefault;
          }
        } else {
          newDiscountList[i].errors.max_distance =
            parseInt(value) >= parseInt(newDiscountList[i].max_distance)
              ? messageErrorDefault
              : "";
          newDiscountList[i].errors.from =
            parseInt(value) >= parseInt(newDiscountList[i].min_distance)
              ? messageErrorDefault
              : "";
        }
      });
    }

    return newDiscountList;
  };

  // validate giá nhập
  validatePriceRange = (e, index) => {
    // const value = e.target.value;
    // const { shipList } = this.props;
    // let textError = "";

    // if (!value) {
    //   textError = "Không được để trống trường này!";
    // } else if (
    //   index === 0 &&
    //   parseInt(value.toString()?.replace(/[.,]/g, "")) >=
    //     parseInt(this.getRetailPrice()?.toString()?.replace(/[.,]/g, ""))
    // ) {
    //   textError = "Giá trị phải nhỏ hơn giá bán lẻ";
    // } else if (
    //   parseInt(value.toString()?.replace(/[.,]/g, "")) >=
    //   parseInt(shipList[index - 1]?.price?.toString()?.replace(/[.,]/g, ""))
    // ) {
    //   textError = "Giá trị phải nhỏ hơn khoảng giá trước";
    // } else {
    //   textError = "";
    // }
    // return textError;
    console.log("đã vào");
  };

  getRetailPrice = () => {
    const { list_distribute, priceDefault } = this.props;

    const getPrice = (data) => {
      if (data.price !== null && data.price !== undefined && data.price) {
        return data.price;
      } else {
        const subElementWithPrice =
          data.sub_element_distributes &&
          data.sub_element_distributes.length &&
          data.sub_element_distributes.find(
            (subElement) =>
              subElement.price !== null && subElement.price !== undefined
          );
        return subElementWithPrice ? subElementWithPrice.price : null;
      }
    };

    if (!list_distribute && !list_distribute?.element_distributes?.length)
      return priceDefault
        ? parseInt(priceDefault?.toString()?.replace(/,/g, ""))
        : 0;
    else {
      let price = 0;
      if (list_distribute?.element_distributes?.length > 0) {
        for (const item of list_distribute?.element_distributes) {
          const price = getPrice(item);
          if (price) return price;
        }
      }
      return price;
    }
  };

  addInitPriceRange = (item) => {
    const { shipList, setShipList } = this.props;
    if (!item) setShipList([initPriceRange]);
    else {
      const { min_distance, max_distance } = item;
      const newPrice = {
        min_distance: max_distance
          ? (parseInt(max_distance) + 1).toString()
          : min_distance
          ? parseInt(min_distance) + 1
          : "",
        max_distance: "",
        fee: "",
        errors: {
          min_distance: "",
          max_distance: "",
          fee: "",
        },
      };
      const newDiscountList = [...shipList, newPrice];
      setShipList(newDiscountList);
    }
  };

  onDeleteItem = (index) => {
    const { shipList, setShipList } = this.props;
    const updatedDiscountList = JSON.parse(JSON.stringify(shipList));
    updatedDiscountList.splice(index, 1);
    if (index < updatedDiscountList.length) {
      updatedDiscountList[index].from = updatedDiscountList[index - 1]?.to
        ? (parseFloat(updatedDiscountList[index - 1]?.to || 0) + 1).toString()
        : (
            parseFloat(updatedDiscountList[index - 1]?.from || 0) + 1
          ).toString();
    }

    let nextIndex = index + 1;
    while (nextIndex < updatedDiscountList.length) {
      updatedDiscountList[nextIndex].from = (
        updatedDiscountList[nextIndex - 1]?.to
          ? parseFloat(updatedDiscountList[nextIndex - 1]?.to || 0) + 1
          : parseFloat(updatedDiscountList[nextIndex - 1]?.from || 0) + 1
      ).toString();
      nextIndex += 1;
    }

    setShipList(updatedDiscountList);
  };

  onChangeInput = (e, index) => {
    const name = e.target.name;
    const value = e.target.value;
    const { shipList, setShipList } = this.props;

    const updatedDiscountList = JSON.parse(JSON.stringify(shipList));
    updatedDiscountList[index] = {
      ...updatedDiscountList[index],
      [name]: name === "fee" ? formatNumberV2(value) : value,
    };

    if (name === "fee") {
      updatedDiscountList[index].errors[name] = this.validatePriceRange(
        e,
        index
      );
    } else {
      updatedDiscountList[index].errors[name] = this.validate(e, index);
    }

    if (name === "max_distance") {
      let nextIndex = index + 1;
      if (nextIndex === updatedDiscountList.length && !value) {
        setShipList(updatedDiscountList);
        return;
      }

      if (value === "") {
        updatedDiscountList[nextIndex].from = (
          parseFloat(updatedDiscountList[index].from) + 1
        ).toString();
      } else if (
        nextIndex < updatedDiscountList.length &&
        updatedDiscountList[nextIndex].to
      ) {
        updatedDiscountList[nextIndex].from = (
          parseFloat(value) + 1
        ).toString();
      } else {
        let nextFromValue = parseFloat(value) + 1;
        const currentToValue = value;

        while (nextIndex < updatedDiscountList.length) {
          const nextToValue = updatedDiscountList[nextIndex].to;
          if (
            !nextToValue ||
            parseFloat(nextToValue) === parseFloat(currentToValue)
          ) {
            updatedDiscountList[nextIndex].from = nextFromValue.toString();
            nextFromValue += 1;
            nextIndex += 1;
          } else {
            break;
          }
        }
      }
    }

    const newDiscountList = this.validateList(
      updatedDiscountList,
      name,
      value,
      index
    );

    setShipList(newDiscountList);
  };

  render() {
    const { shipList, isShow } = this.props;
    console.log(
      "🚀 ~ file: Discount.js:272 ~ Discount ~ render ~ discountList:",
      shipList
    );
    return (
      <CardStyles>
        <Alert type={Types.ALERT_UID_STATUS} alert={this.props.alert} />
        <div class="card mb-4">
          <div class="card-body" style={{ padding: "0.0rem" }}>
            <div class="row">
              <div class="col-lg-12">
                <div>
                  <div class="card-body" style={{ padding: "0.8rem" }}>
                    <div>
                      {/* <div
                        style={{
                          color: "red",
                          fontStyle: "italic",
                        }}
                      >
                        *Giá sỉ chỉ có thể được thiết lập khi sản phẩm không có
                        phân loại hoặc các phân loại đồng giá.
                      </div> */}
                      {isShow ? (
                        <div className="discount">
                          <div className="discount__header">
                            <div className="discount__header__title">
                              Khoảng cách
                            </div>
                            <div className="discount__header__from">
                              Từ (Km)
                            </div>
                            <div className="discount__header__to">Đến (Km)</div>
                            <div className="discount__header__price">Phí</div>
                            <div className="discount__header__action">
                              Thao tác
                            </div>
                          </div>
                          <div>
                            <button
                              type="button"
                              className={`btn btn-info btn-sm ${
                                shipList && shipList.length > 0
                                  ? "hide"
                                  : "show"
                              }`}
                              onClick={() => this.addInitPriceRange()}
                            >
                              <i className="fa fa-plus"></i>
                              Thêm khoảng cách
                            </button>
                          </div>
                          <div className="discount__main">
                            {shipList && shipList.length > 0
                              ? shipList.map((item, index) => {
                                  const {
                                    min_distance,
                                    max_distance,
                                    fee,
                                    errors,
                                  } = item;
                                  return (
                                    <>
                                      <div
                                        className="discount__content"
                                        key={index}
                                      >
                                        <div className="discount__content__title">
                                          Khoảng cách {index + 1}
                                        </div>
                                        <div className="discount__content__from">
                                          <div className="discount__content__item">
                                            <input
                                              value={min_distance}
                                              name="min_distance"
                                              type="text"
                                              placeholder="Từ (sản phẩm)"
                                              className="form-control"
                                              autoComplete="off"
                                              onChange={(e) =>
                                                this.onChangeInput(e, index)
                                              }
                                              disabled={index !== 0}
                                            />
                                            {errors.min_distance ? (
                                              <div>{errors.min_distance}</div>
                                            ) : null}
                                          </div>
                                        </div>
                                        <div className="discount__content__to">
                                          <div className="discount__content__item">
                                            <input
                                              value={max_distance}
                                              name="max_distance"
                                              type="text"
                                              placeholder="Đến (sản phẩm)"
                                              className="form-control"
                                              autoComplete="off"
                                              onChange={(e) =>
                                                this.onChangeInput(e, index)
                                              }
                                            />
                                            {errors.max_distance ? (
                                              <div>{errors.max_distance}</div>
                                            ) : null}
                                          </div>
                                        </div>
                                        <div className="discount__content__price">
                                          <div className="discount__content__item">
                                            <input
                                              value={fee}
                                              name="fee"
                                              type="text"
                                              placeholder="Đơn giá"
                                              className="form-control"
                                              autoComplete="off"
                                              onChange={(e) =>
                                                this.onChangeInput(e, index)
                                              }
                                            />
                                            {errors.fee ? (
                                              <div>{errors.fee}</div>
                                            ) : null}
                                          </div>
                                        </div>
                                        <div className="discount__content__action">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            onClick={() =>
                                              this.onDeleteItem(index)
                                            }
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                            />
                                          </svg>
                                        </div>
                                      </div>
                                      {index === shipList.length - 1 && (
                                        <div
                                          className="discount__end"
                                          key={index + 2}
                                        >
                                          <div className="discount__end__title">
                                            Khoảng cách {index + 2}
                                          </div>
                                          <div className="discount__end__from">
                                            <button
                                              type="button"
                                              className={`btn btn-info btn-sm ${
                                                shipList && shipList.length > 0
                                                  ? "show"
                                                  : "hide"
                                              }`}
                                              onClick={() =>
                                                this.addInitPriceRange(item)
                                              }
                                            >
                                              <i className="fa fa-plus"></i>
                                              Thêm khoảng cách
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  );
                                })
                              : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardStyles>
    );
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {};
};
const mapStateToProps = (state) => {
  return {
    alert: state.UploadReducers.alert.alert_uploadDis,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigShip);
