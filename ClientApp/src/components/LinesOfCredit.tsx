import React from "react";
import { EntityManager, EntityQuery } from "breeze-client";
import { LineOfCredit } from "../model/line-of-credit";
import { entityManagerProvider } from "../model/entity-manager-provider";

interface LineOfCreditState {
  LinesOfCredit: LineOfCredit[];
  selected: LineOfCredit;
}

export class LinesOfCredit extends React.Component<any, LineOfCreditState> {

    manager: EntityManager;
  
    constructor(props: any) {
      super(props);
      this.state = {
        LinesOfCredit: [] as LineOfCredit[],
        selected: null as LineOfCredit
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
      const query = new EntityQuery("LinesOfCredit")
        .expand("Clients")
        .expand("Creditors");
      this.manager.executeQuery(query).then(qr => {
        this.setState({
          selected: null,
          LinesOfCredit: qr.results
        });
      });
    }
  
    componentWillUnmount() {
      entityManagerProvider.unsubscribeComponent(this.manager, this);
    }
  
    addClient() {
      let cust = this.manager.createEntity(LineOfCredit.prototype.entityType) as LineOfCredit;
      cust.clientId = -1;
      // select the new Client, and add it to the list of Clients
      this.setState({
        selected: cust,
        LinesOfCredit: this.state.LinesOfCredit.concat([cust])
      })
    }
  
    remove(ent: LineOfCredit) {
      ent.entityAspect.setDeleted();
    }
  
    saveChanges() {
      this.manager.saveChanges().then(() => {
        // refresh Client list to remove deleted Clients
        this.setState({
          selected: null,
          LinesOfCredit: this.manager.getEntities("LineOfCredit") as LineOfCredit[]
        })
      });
    }
  
    rejectChanges() {
      this.manager.rejectChanges();
      // refresh Client list to restore original state
      this.setState({
        selected: null,
        LinesOfCredit: this.manager.getEntities("LineOfCredit") as LineOfCredit[]
      })
    }
  
    renderCustEdit() {
      let cust = this.state.selected;
      if (cust) {
        return <div><h3>Edit</h3>
          {/* <div>First Name: <input type="text" name="firstName" value={cust.firstName || ''} onChange={cust.handleChange} /></div>
          <div>Last Name: <input type="text" name="lastName" value={cust.lastName || ''} onChange={cust.handleChange} /></div> */}
  
          <button type="button" className="btn btn-dark" onClick={this.remove.bind(this, cust)}>Delete</button>
        </div>
      }
    }
  
    render() {
      return (
        <div>
          <h1>Lines of Credit</h1>
  
          <table className="table" style={{ margin: 'auto' }}>
            <thead>
              <tr>
                <th>Creditor</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Min Pay %</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {this.state.LinesOfCredit
              .map(client =>
                <tr key={client.lineOfCreditId}
                  style={{ backgroundColor: (client === this.state.selected) 
                    ? 'lightgray' 
                    : 'white' }}
                  onClick={() => this.setState({ selected: client })}>
                    <td>{client.creditor.name}</td>
                    <td>{client.client.firstName}</td>
                    <td>{client.client.lastName}</td>
                    <td>{client.balance}</td>
                    <td>{client.entityAspect.entityState.name}</td>
                </tr>)
              }
            </tbody>
          </table>
          <button type="button" className="btn btn-dark" onClick={this.addClient}>Add Line of Credit</button>
  
          {this.renderCustEdit()}
  
          <div style={{ marginTop: '20px' }}>
            <button type="button" className="btn btn-dark" disabled={!this.manager.hasChanges()} onClick={this.saveChanges}>Save Changes</button>
            <button type="button" className="btn btn-dark" disabled={!this.manager.hasChanges()} onClick={this.rejectChanges}>Revert Changes</button>
          </div>
  
        </div>
      );
    }
  }
  