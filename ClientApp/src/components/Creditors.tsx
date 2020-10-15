import React from 'react';
import { EntityManager, EntityQuery } from 'breeze-client';
import { Creditor } from '../model/creditor';
import { entityManagerProvider } from '../model/entity-manager-provider';

interface CreditorState {
  Creditors: Creditor[];
  selected: Creditor;
}
export class Creditors extends React.Component<any, CreditorState> {

  manager: EntityManager;

  constructor(props: any) {
    super(props);
    this.state = {
      Creditors: [] as Creditor[],
      selected: null as Creditor
    };
    this.manager = entityManagerProvider.newManager();

    this.saveChanges = this.saveChanges.bind(this);
    this.rejectChanges = this.rejectChanges.bind(this);
    this.addCreditor = this.addCreditor.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    entityManagerProvider.subscribeComponent(this.manager, this);

    const query = new EntityQuery("Creditors");//.expand("orders");
    this.manager.executeQuery(query).then(qr => {
      this.setState({
        selected: null,
        Creditors: qr.results
      });
    });
  }

  componentWillUnmount() {
    entityManagerProvider.unsubscribeComponent(this.manager, this);
  }

  addCreditor() {
    let cust = this.manager.createEntity(Creditor.prototype.entityType) as Creditor;
    cust.creditorId = -1;
    // select the new Creditor, and add it to the list of Creditors
    this.setState({
      selected: cust,
      Creditors: this.state.Creditors.concat([cust])
    })
  }

  remove(ent: Creditor) {
    ent.entityAspect.setDeleted();
  }

  saveChanges() {
    this.manager.saveChanges().then(() => {
      // refresh Creditor list to remove deleted Creditors
      this.setState({
        selected: null,
        Creditors: this.manager.getEntities("Creditor") as Creditor[]
      })
    });
  }

  rejectChanges() {
    this.manager.rejectChanges();
    // refresh Creditor list to restore original state
    this.setState({
      selected: null,
      Creditors: this.manager.getEntities("Creditor") as Creditor[]
    })
  }

  renderCustEdit() {
    let creditor = this.state.selected;
    if (creditor) {
      return <div><h3>Edit</h3>
        <div>Name: <input type="text" name="name" value={creditor.name || ''} onChange={creditor.handleChange} /></div>       

        <button type="button" onClick={this.remove.bind(this, creditor)}>Delete</button>
      </div>
    }
  }

  render() {
    return (
      <div>
        <h1>Creditors</h1>

        <table className="table" style={{ margin: 'auto' }}>
          <thead>
            <tr>
              <th>Creditor Id</th>
              <th>Name</th>              
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.state.Creditors.map(creditor =>
              <tr key={creditor.creditorId}
                style={{ backgroundColor: (creditor === this.state.selected) ? 'lightgray' : 'white' }}
                onClick={() => this.setState({ selected: creditor })}>
                  <td>{creditor.creditorId}</td>
                <td>{creditor.name}</td>                
                <td>{creditor.entityAspect.entityState.name}</td>
              </tr>)
            }
          </tbody>
        </table>
        <button type="button" onClick={this.addCreditor}>Add Creditor</button>

        {this.renderCustEdit()}

        <div style={{ marginTop: '20px' }}>
          <button type="button" disabled={!this.manager.hasChanges()} onClick={this.saveChanges}>Save Changes</button>
          <button type="button" disabled={!this.manager.hasChanges()} onClick={this.rejectChanges}>Revert Changes</button>
        </div>

      </div>
    );
  }
}
