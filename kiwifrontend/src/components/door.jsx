import React, { Component, Fragment } from "react";
import Pagination from "../common/pagination";
import { paginate } from "../utils/paginate";

import axios from "axios";

class Door extends Component {
  userId = this.props.match.params.id;
  state = {
    door: {},
    permittedUsers: [],
    totalPermittedUsers: 0,
    otherUsers: [],
    totalOtherUsers: 0,
    currentPagePermittedUsers: 1,
    currentPageOtherUsers: 1,
    pageSize: 10,
  };
  componentDidMount() {
    this.fetchDoorData();
  }
  render() {
    const permittedUsers = paginate(
      this.state.permittedUsers,
      this.state.currentPagePermittedUsers,
      this.state.pageSize
    );
    const otherUsers = paginate(
      this.state.otherUsers,
      this.state.currentPageOtherUsers,
      this.state.pageSize
    );
    return (
      <Fragment>
        <div className="container m-3">
          <div className="card border-info mb-3">
            <div className="card-header" style={{ fontWeight: "bold" }}>
              {this.state.door.name}
            </div>
            <div className="card-body">
              <p className="card-text">
                <b>ID:</b> {this.state.door.id}
                <br />
                <b>Sensor UUID:</b> {this.state.door.sensor_uuid}
                <br />
                <b>Address:</b> {this.state.door.address}
                <br />
                <b>Date Time:</b> {this.state.door.dateTime}
              </p>
            </div>
          </div>
        </div>

        <div className="container m-3">
          <div className="card border-info mb-3">
            <div className="card-header" style={{ fontWeight: "bold" }}>
              Permitted permittedUsers ({this.state.totalPermittedUsers})
            </div>

            <div className="card-body">
              {permittedUsers.length < 1 ? (
                <p className="alert alert-info">No Users to Display</p>
              ) : (
                <div>
                  <Pagination
                    total={this.state.permittedUsers.length}
                    pageSize={this.state.pageSize}
                    currentPage={this.state.currentPagePermittedUsers}
                    onPageChange={this.handlePageChangePagePermittedUsers}
                  />
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr className="table-info">
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permittedUsers.map((u, index) => (
                        <tr key={this.state.door.id + u.name}>
                          <th>
                            {index +
                              1 +
                              (this.state.currentPagePermittedUsers - 1) * 10}
                          </th>
                          <th>{u.name}</th>
                          <th>{u.email}</th>
                          <th>{u.createdAt}</th>

                          <th>
                            <button
                              className="btn btn-danger"
                              onClick={async () => {
                                await this.removePermissionData([
                                  u.id,
                                  this.state.door.id,
                                ]);
                              }}
                            >
                              Remove Permission
                            </button>
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container m-3">
          <div className="card border-info mb-3">
            <div className="card-header" style={{ fontWeight: "bold" }}>
              Other Users ({this.state.totalOtherUsers})
            </div>
            <div className="card-body">
              {otherUsers.length < 1 ? (
                <p className="alert alert-info">No Users to Display</p>
              ) : (
                <div>
                  <Pagination
                    total={this.state.otherUsers.length}
                    pageSize={this.state.pageSize}
                    currentPage={this.state.currentPageOtherUsers}
                    onPageChange={this.handlePageChangePageOtherUsers}
                  />
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr className="table-info">
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherUsers.map((u, index) => (
                        <tr key={u.id + u.name}>
                          <th>
                            {index +
                              1 +
                              (this.state.currentPageOtherUsers - 1) * 10}
                          </th>
                          <th>{u.name}</th>
                          <th>{u.email}</th>
                          <th>{u.createdAt}</th>

                          <th>
                            <button
                              className="btn btn-success"
                              onClick={async () => {
                                await this.postPermissionData([
                                  u.id,
                                  this.state.door.id,
                                  new Date().toDateString(),
                                ]);
                              }}
                            >
                              Grant Permission
                            </button>
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
  handlePageChangePageOtherUsers = (page) => {
    this.setState({ currentPageOtherUsers: page });
  };
  handlePageChangePagePermittedUsers = (page) => {
    this.setState({ currentPagePermittedUsers: page });
  };
  async postPermissionData(Data) {
    try {
      const result = await axios.post(
        `http://127.0.0.1:5000//post_permission/${Data}`
      );
      if (result.status === 200) {
        console.log("Data Inserted");
        this.fetchDoorData();
      }
    } catch (error) {
      console.log(
        "Could not Insert Permissions Data for Door at this time:",
        error
      );
    }
  }

  async removePermissionData(Data) {
    try {
      const result = await axios.delete(
        `http://127.0.0.1:5000//remove_permission/${Data}`
      );
      if (result.status === 200) {
        console.log("Door Permission Data Deleted! ");
        this.fetchDoorData();
      }
    } catch (error) {
      console.log(
        "Could not Delete Permissions Data for Door at this time: ",
        error
      );
    }
  }

  async fetchDoorData() {
    try {
      const result = await axios.get(
        `http://127.0.0.1:5000/doors/${this.userId}`
      );
      if (result.status === 200) {
        const currentDoor = result.data.door[0];
        const door = {
          id: currentDoor[0],
          sensor_uuid: currentDoor[1],
          name: currentDoor[2],
          dateTime: currentDoor[4],
          address: `${currentDoor[6]}, ${currentDoor[7]}, ${currentDoor[8]}, ${currentDoor[9]}, ${currentDoor[10]}, ${currentDoor[11]}`,
        };
        const permittedUsers = result.data.permitted_users.map((user) => ({
          id: user[0],
          email: user[1],
          name: `${user[2]} ${user[3]}`,
          createdAt: user[4],
        }));
        const totalPermittedUsers = permittedUsers.length;

        const otherUsers = result.data.other_users.map((user) => ({
          id: user[0],
          email: user[1],
          name: `${user[2]} ${user[3]}`,
          createdAt: user[4],
        }));
        const totalOtherUsers = otherUsers.length;
        const currentPagePermittedUsers = 1;
        const currentPageOtherUsers = 1;
        this.setState({
          door,
          permittedUsers,
          totalPermittedUsers,
          otherUsers,
          totalOtherUsers,
          currentPagePermittedUsers,
          currentPageOtherUsers,
        });
      }
    } catch (error) {
      console.log("Could not fetch doors at this time:", error);
    }
  }
}

export default Door;
