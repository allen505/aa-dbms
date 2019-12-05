/* eslint-disable */
import React from "react";
import {
  Card,
  Button,
  Result,
  Modal,
  message
} from "antd";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";

import Cookies from "universal-cookie";

const cookies = new Cookies();

class Cards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userid: cookies.get("userid"),
      visible: false,
      product: null
    };
    try {
      this.state.userid = props.id;
    } catch (e) {
      console.log(e);
    }
  }

  success = Pname => {
    this.setState({
      visible: true,
      product: Pname
    });
  };

  buyproduct = (Sid, e, Pname, Price) => {
    if (this.state.userid != undefined) {
      let order = {
        pid: e.target.value,
        bid: this.state.userid,
        sid: Sid,
        price: Price
      };
      let register = () => {
        fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(order)
        })
          .then(res => res.json())
          .then(resp => {
            if (resp) {
              this.success(Pname);
            } else {
              this.error();
            }
          });
      };
      register();
	 }
	 else{
		message.error("Log in required");
	 }
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  render() {
    setTimeout(() => {
      this.setState(() => ({
        loading: false
      }));
    }, 1000);
    const { Meta } = Card;
    let index = 0;
    let rowGroup = [];
    var cardList = this.props.product.map(prod => {
      return (
        <div
          style={{
            float: "left",
            width: "25%"
          }}
        >
          <Card
            loading={this.state.loading}
            style={{ width: "90%" }}
            style={{ margin: 7, marginBottom: 15, padding: 0 }}
            // border-radius: 7
            // cover={<img alt="example" src="" />}
            hoverable={true}
            actions={[
              <Button
                type="primary"
                block
                onClick={e => {
                  this.buyproduct(prod.Sid, e, prod.Pname, prod.Price);
                }}
                value={prod.Pid}
                style={{ margin: 2, width: 320 }}
              >
                Buy
              </Button>
            ]}
          >
            <Meta title={prod.Pname} description={prod.Descripton} />
            <br />
            <Meta title={"₹ " + prod.Price} />
          </Card>
          <Modal
            title="Basic Modal"
            visible={this.state.visible}
            onOk={this.handleOk}
            footer={[
              <Button key="buy" onClick={this.handleCancel}>
                Back to shopping
              </Button>
            ]}
            onCancel={this.handleCancel}
          >
            <Result
              status="success"
              title={"Successfully Purchased  " + this.state.product}
            />
          </Modal>
        </div>
      );
  });
  return cardList;
}
}

export default Cards;
