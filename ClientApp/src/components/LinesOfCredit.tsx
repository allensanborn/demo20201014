import React from "react";
import { EntityManager, EntityQuery } from "breeze-client";
import { entityManagerProvider } from "../model/entity-manager-provider";
import { LineOfCredit } from "../model/line-of-credit";
import { Client } from "../model/client";
import { Creditor } from "../model/creditor";

interface LineOfCreditState {
  LinesOfCredit: LineOfCredit[];
  Clients: Client[];
  Creditors: Creditor[];
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
      Clients: [] as Client[],
      Creditors: [] as Creditor[],
      selected: null as LineOfCredit,
      allRowsSelected: false,
      totalRowCount: 0,
      checkedRowCount: 0,
      balance: 0,
    };
    this.manager = entityManagerProvider.newManager();

    this.saveChanges = this.saveChanges.bind(this);
    this.rejectChanges = this.rejectChanges.bind(this);
    this.addDebt = this.addDebt.bind(this);
    this.remove = this.remove.bind(this);
    this.onChangeClient = this.onChangeClient.bind(this);
    this.onChangeCreditor = this.onChangeCreditor.bind(this);
  }

  componentDidMount() {
    entityManagerProvider.subscribeComponent(this.manager, this);

    const query = new EntityQuery("LinesOfCredit").expand("Client, Creditor");
    this.manager.executeQuery(query).then((qr) => {
      console.log("query result", [qr.results]);
      this.setState({
        selected: null,
        LinesOfCredit: qr.results,
      });

      const query2 = new EntityQuery("Clients");
      this.manager.executeQuery(query2).then((qr) => {
        this.setState({ Clients: qr.results });
      });

      const query3 = new EntityQuery("Creditors");
      this.manager.executeQuery(query3).then((qr) => {
        this.setState({ Creditors: qr.results });
      });
    });
  }

  componentWillUnmount() {
    entityManagerProvider.unsubscribeComponent(this.manager, this);
  }

  addDebt() {
    let debt = this.manager.getEntityByKey("LineOfCredit", -1) as LineOfCredit;
    if (!debt) {
      debt = this.manager.createEntity(
        LineOfCredit.prototype.entityType
      ) as LineOfCredit;
    }

    debt.lineOfCreditId = -1;
    debt.balance = 0;
    debt.minPaymentPercentage = 0;
    this.setState({
      selected: debt,
      //LinesOfCredit: this.state.LinesOfCredit.concat([debt]),
    });
  }

  remove(ent: LineOfCredit) {
    ent.entityAspect.setDeleted();
  }

  saveChanges() {
    var blah = this.manager.getChanges();
    console.log("Changes", [blah]);
    this.manager
      .saveChanges()
      .then(() => {
        // refresh Client list to remove deleted Clients
        this.setState({
          selected: null,
          LinesOfCredit: this.manager.getEntities(
            "LineOfCredit"
          ) as LineOfCredit[],
        });
      })
      .catch((asdf) => {
        console.log(asdf);
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

  onChangeClient(event) {
    let clientId = event.target.value;
    let client = this.manager.getEntityByKey("Client", clientId) as Client;
    let lineOfCredit = this.state.selected;
    lineOfCredit.client = client;

    this.setState({
      selected: lineOfCredit,
    });
  }

  onChangeCreditor(event) {
    let creditorId = event.target.value;
    let creditor = this.manager.getEntityByKey(
      "Creditor",
      creditorId
    ) as Creditor;
    let lineOfCredit = this.state.selected;
    lineOfCredit.creditor = creditor;

    this.setState({
      selected: lineOfCredit,
    });
  }

  renderDebtEdit() {
    let debt = this.state.selected;

    if (debt) {
      let clientsList =
        this.state.Clients.length > 0 &&
        this.state.Clients.map((client) => {
          return (
            <option key={client.clientId} value={client.clientId}>
              {client.lastName}, {client.firstName}
            </option>
          );
        });

      let creditorsList =
        this.state.Creditors.length > 0 &&
        this.state.Creditors.map((creditor) => {
          return (
            <option key={creditor.creditorId} value={creditor.creditorId}>
              {creditor.name}
            </option>
          );
        });

      return (
        <div>
          <h3>Edit</h3>

          <div>
            <select
              value={this.state.selected.clientId || -1}
              onChange={this.onChangeClient}
            >
              {" "}
              <option key={-1} value={-1}>
                Select a Client
              </option>
              {clientsList}
            </select>
            <select
              value={this.state.selected.creditorId || -1}
              onChange={this.onChangeCreditor}
            >
              <option key={-1} value={-1}>
                Select a Creditor
              </option>
              {creditorsList}
            </select>
            <input
              name="minPaymentPercentage"
              type="text"
              value={this.state.selected.minPaymentPercentage}
              onChange={this.state.selected.handleChange}
            />
            <input
              name="balance"
              type="text"
              value={this.state.selected.balance}
              onChange={this.state.selected.handleChange}
            />
          </div>

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
      if (loc.isSelected) {
        loc.entityAspect.setDeleted();
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
            {this.state.LinesOfCredit.filter((loc) => {
              if (
                loc.entityAspect.entityState.toString() === "Deleted" ||
                loc.entityAspect.entityState.toString() === "Added"
              ) {
                return false;
              } else {
                return true;
              }
            }).map((loc) => (
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

                <td>{loc.creditor.name || ""}</td>
                <td>{loc.client.firstName || ""}</td>
                <td>{loc.client.lastName || ""}</td>
                <td>{loc.minPaymentPercentage.toFixed(2) || ""} %</td>
                <td>{loc.balance.toFixed(2) || ""}</td>
                <td>{loc.entityAspect.entityState.name}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
                <button className="btn btn-primary" onClick={this.addDebt}>
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

        {this.renderDebtEdit()}
        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            className="btn btn-success"
            disabled={
              !this.manager.hasChanges() ||
              this.state.selected.entityAspect.hasValidationErrors
            }
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
