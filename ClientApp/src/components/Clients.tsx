import React from "react";
import { EntityManager, EntityQuery } from "breeze-client";
import { Client } from "../model/client";
import { entityManagerProvider } from "../model/entity-manager-provider";

interface ClientState {
  Clients: Client[];
  selected: Client;
}
export class Clients extends React.Component<any, ClientState> {
  manager: EntityManager;

  constructor(props: any) {
    super(props);
    this.state = {
      Clients: [] as Client[],
      selected: null as Client,
    };
    this.manager = entityManagerProvider.newManager();

    this.saveChanges = this.saveChanges.bind(this);
    this.rejectChanges = this.rejectChanges.bind(this);
    this.addClient = this.addClient.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    entityManagerProvider.subscribeComponent(this.manager, this);

    const query = new EntityQuery("Clients"); //.expand("orders");
    this.manager.executeQuery(query).then((qr) => {
      this.setState({
        selected: null,
        Clients: qr.results,
      });
    });
  }

  componentWillUnmount() {
    entityManagerProvider.unsubscribeComponent(this.manager, this);
  }

  addClient() {
    let cust = this.manager.createEntity(Client.prototype.entityType) as Client;
    cust.clientId = -1;
    // select the new Client, and add it to the list of Clients
    this.setState({
      selected: cust,
      Clients: this.state.Clients.concat([cust]),
    });
  }

  remove(ent: Client) {
    ent.entityAspect.setDeleted();
  }

  saveChanges() {
    this.manager.saveChanges().then(() => {
      // refresh Client list to remove deleted Clients
      this.setState({
        selected: null,
        Clients: this.manager.getEntities("Client") as Client[],
      });
    });
  }

  rejectChanges() {
    this.manager.rejectChanges();
    // refresh Client list to restore original state
    this.setState({
      selected: null,
      Clients: this.manager.getEntities("Client") as Client[],
    });
  }

  renderCustEdit() {
    let cust = this.state.selected;
    if (cust) {
      return (
        <div>
          <h3>Edit</h3>
          <div>
            First Name:{" "}
            <input
              type="text"
              name="firstName"
              value={cust.firstName || ""}
              onChange={cust.handleChange}
            />
          </div>
          <div>
            Last Name:{" "}
            <input
              type="text"
              name="lastName"
              value={cust.lastName || ""}
              onChange={cust.handleChange}
            />
          </div>

          <button
            type="button"
            className="btn btn-dark"
            onClick={this.remove.bind(this, cust)}
          >
            Delete
          </button>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <h1>Clients</h1>

        <table className="table" style={{ margin: "auto" }}>
          <thead>
            <tr>
              <th>Client Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.Clients.map((client) => (
              <tr
                key={client.clientId}
                style={{
                  backgroundColor:
                    client === this.state.selected ? "lightgray" : "white",
                }}
                onClick={() => this.setState({ selected: client })}
              >
                <td>{client.clientId}</td>
                <td>{client.firstName}</td>
                <td>{client.lastName}</td>
                <td>{client.entityAspect.entityState.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="btn btn-dark" onClick={this.addClient}>
          Add Client
        </button>

        {this.renderCustEdit()}

        <div style={{ marginTop: "20px" }}>
          <button
            type="button"
            className="btn btn-dark"
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
