import react from "react";
import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "../common/pagination";
import { paginate } from "../utils/paginate";

class Doors extends Component {
  state = {
    alldoors: [],
    currentPage: 1,
    pageSize: 10,
  };
  componentDidMount() {
    this.fetchData();
  }
  render() {
    const doors = paginate(
      this.state.alldoors,
      this.state.currentPage,
      this.state.pageSize
    );
    //const doors = this.state.alldoors;
    if (doors.length === 0)
      return (
        <react.Fragment>
          <h3>No Doors to display</h3>
        </react.Fragment>
      );
    return (
      <div>
        <p>Showing {doors.length} Doors from Database</p>
        <div className="table-responsive m-2">
          <Pagination
            total={this.state.alldoors.length}
            pageSize={this.state.pageSize}
            currentPage={this.state.currentPage}
            onPageChange={this.handlePageChange}
          />
          <table className="table table-bordered table-hover">
            <thead>
              <tr className="table-info">
                <th>S.No</th>
                <th>Name</th>
                <th>Address</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doors.map((d, index) => (
                <tr key={d.id + d.name}>
                  <th>{index + 1 + (this.state.currentPage - 1) * 10}</th>
                  <th>{d.name}</th>
                  <th>{d.address}</th>
                  <th>{d.dateTime}</th>

                  <th>
                    <Link className="btn btn-primary" to={`./door/${d.id}`}>
                      Detail
                    </Link>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };
  async fetchData() {
    try {
      const result = await axios.get("http://127.0.0.1:5000/doors");
      if (result.status === 200) {
        const alldoors = result.data.map((door) => ({
          id: door[0],
          name: door[1],
          dateTime: door[2],
          address: `${door[4]}, ${door[5]}, ${door[6]}, ${door[7]}, ${door[8]}`,
        }));
        this.setState({ alldoors });
      }
    } catch (error) {
      console.log("Could not fetch doors at this time:", error);
    }
  }
}

export default Doors;
