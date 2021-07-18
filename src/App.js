// import logo from './logo.svg';
import './App.css';
import React from 'react';
import data from './data-brokers.json'
import ModalComponent from './components/ModalComponent'


let dataBrokers = data;

//preprocess the data
for (let i = 0; i < dataBrokers.length; i++) {
  dataBrokers[i].complete === "FALSE" ? dataBrokers[i].complete = false : dataBrokers[i].complete = true;
}


console.table(data);

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dataBrokers: dataBrokers,
      queryString: "",
      currIndex: null,
      showModal: false,
    };
  }

  buttonChange = (brokerName) => {
    const dataBrokers = [...this.state.dataBrokers]
    const index = dataBrokers.findIndex(broker => broker.name === brokerName)
    dataBrokers[index].complete = !dataBrokers[index].complete
    this.setState({dataBrokers})
  }

  instructionButtonClick = (brokerName) => {
    const currIndex = this.state.dataBrokers.findIndex(dataBroker => dataBroker.name === brokerName)
    this.setState({showModal: true, currIndex})
  }

  filterResults = (event) => {
    this.setState({
      queryString: event.target.value
    })
    console.log("FILTERING RESULTS", event)
  }


  getModalContent = () => {
    const dataBroker = this.state.dataBrokers[this.state.currIndex]

    if (!dataBroker) {
      return;
    }

    return <>

      <div className={"modal-title-div"}>
        <h1>{dataBroker.name}</h1>
      </div>

      <div className={"modal-instruction-div"}>
        <p>{dataBroker.instruction}</p>
      </div>

      <button onClick={() => this.setState({
        showModal: !this.state.showModal
      })} type='button'>
        {"Cancel"}
      </button>

    </>
  }

  getOptOutContent = (broker) => {
    if (broker.optout.search(/^http[s]?:\/\//) !== -1) {
      return <a href={broker.optout} target={"_blank"} rel={"noreferrer"}
                className={broker.complete === true ?
                    "a.link-complete" : "a.link-incomplete"}
      >
        {'Opt Out Form'}
      </a>
    } else if (broker.optout.search(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi) !== -1) {
      return <a href={`mailto:` + broker.optout}
                className={broker.complete === true ?
                    "a.link-complete" : "a.link-incomplete"}>
        Email
      </a>
    }
  }


  // insertRowsinTable = () => (
  //
  //     let newRow, nameCell, linkCell, instructionCell, completionCell;
  //
  //     this.state.dataBrokers
  //     .filter(broker => broker.name.toLowerCase().includes(this.state.queryString.toLowerCase()))
  //     .map((broker) =>
  //
  //         newRow = my-Table.insertRow(-1);
  //
  //         nameCell = newRow.insertCell(0);
  //         linkCell = newRow.insertCell(1);
  //         instructionCell = newRow.insertCell(2);
  //         completionCell = newRow.insertCell(3);
  // )

  render() {
    return (
        <div className='App'>
          <div className='outer-wrapper'>
            <div className={'title-div'}>
              <h1>Data Broker Opt Out List</h1>
            </div>

            <div className={'search-bar-div'}>
              <input type="search" onChange={this.filterResults} value={this.state.queryString}/>
            </div>


            <div className={'table-wrapper'}>
              <table className={"my-Table"}>


                {
                  this.state.dataBrokers
                      .filter(broker => broker.name.toLowerCase().includes(this.state.queryString.toLowerCase()))
                      .map((broker) =>
                          <div>
                            <tr className={"rows"}>
                              <td className={broker.complete === true ? 'complete-row' : 'incomplete-row'}>
                                {broker.name}
                              </td>

                              <td className={broker.complete === true ? 'complete-row' : 'incomplete-row'}>
                                {this.getOptOutContent(broker)}
                              </td>


                              <td className={broker.complete === true ? 'complete-row' : 'incomplete-row'}>
                                     <button onClick={() => this.instructionButtonClick(broker.name)} type='button'
                                             className={broker.complete === true ? 'button-grey' : 'button'}>
                                       {"Removal Instructions"}
                                     </button>

                              </td>

                              <td className={broker.complete === true ? 'complete-row' : 'incomplete-row'}>
                                <button onClick={() => this.buttonChange(broker.name)} type='button'
                                        className={broker.complete === true ? 'button-grey' : 'button'}>
                                  {broker.complete ? "Complete" : "Incomplete"}
                                </button>
                              </td>
                            </tr>

                          </div>)

                }

                <ModalComponent
                    isShowing={this.state.showModal}
                    onToggle={() =>
                        this.setState({
                          showModal: !this.state.showModal
                        })
                    }>
                  {this.getModalContent()}
                </ModalComponent>
              </table>


            </div>
          </div>
        </div>
    )
  };
}

export default App;





