import React, { Component } from "react";
import "./style.css";

class Expired extends Component {
  render() {
    return (
      <body class="expire">
        <div class="main">
          <div class="main-l">
            <img class="" src="https://i.imgur.com/fEJmCJ6.png"></img>
            <h3 class="txtRed">Cửa hàng hết hạn sử dụng.</h3>
            <p>
              <strong>HOTLINE</strong>: 0984.635.577
            </p>
            <p>
              <strong>Hỗ trợ kỹ thuật</strong>: 0976.686.500
            </p>
          </div>
          <div class="main-r">
            <img
              class="image-expired"
              src="https://ikitech.vn/wp-content/uploads/2022/03/thiet-ke-website-ban-hang-tai-ikitech-4-1024x614.png"
              alt="Cửa hàng hết hạn sử dụng"
            />
          </div>
        </div>
        <div class="expire-bg"></div>
      </body>
    );
  }
}

export default Expired;
