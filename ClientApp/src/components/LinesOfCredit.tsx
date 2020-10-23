import React from "react";
import { EntityManager, EntityQuery } from "breeze-client";
import { LineOfCredit } from "../model/line-of-credit";
import { entityManagerProvider } from "../model/entity-manager-provider";

interface LineOfCreditState {
  LinesOfCredit: LineOfCredit[];
  selected: LineOfCredit;
  allRowsSelected: boolean;
  totalRowCount: number;
  checkedRowCount: number;
  balance: number;
}

export class LinesOfCredit extends React.Component<any, LineOfCreditState> {
  manager: EntityManager;

  constructor(props: any) {
    super(props);
    this.state = {
      LinesOfCredit: [] as LineOfCredit[],
      selected: null as LineOfCredit,
    };
    this.manager = entityManagerProvider.newManager();

    this.saveChanges = this.saveChanges.bind(this);
    this.rejectChanges = this.rejectChanges.bind(this);
    this.addClient = this.addClient.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    entityManagerProvider.subscribeComponent(this.manager, this);

    // TODO expand client and creditor
    const query = new EntityQuery("LinesOfCredit").expand("Client, Creditor");
    this.manager.executeQuery(query).then((qr) => {
      console.log("query result", [qr.results]);
      this.setState({
        selected: null,
        LinesOfCredit: qr.results,
      });
    });
  }

  componentWillUnmount() {
    entityManagerProvider.unsubscribeComponent(this.manager, this);
  }

  addClient() {
    let cust = this.manager.createEntity(
      LineOfCredit.prototype.entityType
    ) as LineOfCredit;
    cust.clientId = -1;
    // select the new LineOfCredit, and add it to the list of LineOfCredits
    this.setState({
      selected: cust,
      LinesOfCredit: this.state.LinesOfCredit.concat([cust]),
    });
  }

  remove(ent: LineOfCredit) {
    ent.entityAspect.setDeleted();
  }

  saveChanges() {
    this.manager.saveChanges().then(() => {
      // refresh Client list to remove deleted Clients
      this.setState({
        selected: null,
        LinesOfCredit: this.manager.getEntities(
          "LineOfCredit"
        ) as LineOfCredit[],
      });
    });
  }

  rejectChanges() {
    this.manager.rejectChanges();
    // refresh Client list to restore original state
    this.setState({
      selected: null,
      LinesOfCredit: this.manager.getEntities("LineOfCredit") as LineOfCredit[],
    });
  }

  renderCustEdit() {
    let debt = this.state.selected;
    if (debt) {
      return (
        <div>
          <h3>Edit</h3>
          <select></select>
          {/* <div>
            First Name:{" "}
            <input
              type="text"
              name="firstName"
              value={debt.firstName || ""}
              onChange={debt.handleChange}
            />
          </div>
          <div>
            Last Name:{" "}
            <input
              type="text"
              name="lastName"
              value={debt.lastName || ""}
              onChange={debt.handleChange}
            />
          </div> */}

          <button
            type="button"
            className="btn btn-dark"
            onClick={this.remove.bind(this, debt)}
          >
            Delete
          </button>
        </div>
      );
    }
  }

  computedBalance = () =>
    this.state.LinesOfCredit.reduce(
      (sum, lineOfCredit) =>
        sum + (lineOfCredit.isSelected ? lineOfCredit.balance : 0),
      0
    );

  totalRowCount = () => this.state.LinesOfCredit.length;

  checkedRowCount = () =>
    this.state.LinesOfCredit.reduce(
      (sum, lineOfCredit) => sum + (lineOfCredit.isSelected ? 1 : 0),
      0
    );

  removeSelectedDebts = () => {
    this.state.LinesOfCredit.forEach((loc) => {
      if(loc.isSelected){
        console.log(loc)
        loc.entityAspect.setDeleted();
        console.log(loc)
      }
    });
  };

  render() {
    return (
      <div>
        <h1>Lines of Credit</h1>

        <table className="table table-striped" style={{ margin: "auto" }}>
          <thead className="thead-dark">
            <tr>
              <th>
                <input
                  name="selectAllRows"
                  type="checkbox"
                  checked={this.state.allRowsSelected || false}
                  onChange={() => {
                    if (this.state.allRowsSelected) {
                      // deselect all rows
                      this.setState({ allRowsSelected: false });
                      this.state.LinesOfCredit.forEach((loc) => {
                        loc.isSelected = false;
                      });
                    }
                    // select all rows
                    else {
                      this.setState({ allRowsSelected: true });
                      this.state.LinesOfCredit.forEach((loc) => {
                        loc.isSelected = true;
                      });
                    }
                  }}
                />
              </th>
              <th>Creditor</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Min Pay %</th>
              <th>Balance</th>
              <th>State Name</th>
            </tr>
          </thead>
          <tbody>
            {this.state.LinesOfCredit
            .filter((loc)=>{              
              if(loc.entityAspect.entityState.toString() === "Deleted"){
                return false;          
              }else{
                return true;
              }
            })
            .map((loc) => (
              
              <tr
                key={loc.lineOfCreditId}
                style={{
                  backgroundColor:
                    loc === this.state.selected ? "lightgray" : "white",
                }}
                onClick={() => this.setState({ selected: loc })}
              >
                <td>
                  <input
                    name="isSelected"
                    type="checkbox"
                    checked={loc.isSelected || false}
                    onChange={loc.handleChange}
                  />
                </td>

                <td>{loc.creditor.name||''}</td>
                <td>{loc.client.firstName||''}</td>
                <td>{loc.client.lastName||''}</td>
                <td>{loc.minPaymentPercentage.toFixed(2)||''} %</td>
                <td>{loc.balance.toFixed(2)||''}</td>
                <td>{loc.entityAspect.entityState.name}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
                <button className="btn btn-primary" onClick={this.addClient}>
                  {" "}
                  Add Debt
                </button>
                <button
                  className="btn btn-danger"
                  onClick={this.removeSelectedDebts}
                >
                  {" "}
                  Remove Debt
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <span>Total: ${this.computedBalance()}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span>Total Row Count: {this.totalRowCount()}</span>
              </td>
              <td>
                <span>Checked Row Count: {this.checkedRowCount()}</span>
              </td>
            </tr>
          </tfoot>
        </table>
        {/* 
        {this.renderCustEdit()} */}
        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            className="btn btn-success"
            disabled={!this.manager.hasChanges()}
            onClick={this.saveChanges}
          >
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-dark"
            disabled={!this.manager.hasChanges()}
            onClick={this.rejectChanges}
          >
            Revert Changes
          </button>
        </div>
      </div>
    );
  }
}
