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
                    "link-complete" : "link-incomplete"}
      >
        <b>{'Opt Out Form'}</b>
      </a>
    } else if (broker.optout.search(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi) !== -1) {
      return <a href={`mailto:` + broker.optout}
                className={broker.complete === true ?
                    "link-complete" : "link-incomplete"}>
        <b>Email</b>
      </a>
    } else {
      return "Follow Instructions"
    }
  }


  render() {
    return (
        <div className='App'>

          <div className={'fixed-div'}>
            <div className={'title-div'}>
              <h1>Data Broker Opt Out List</h1>
            </div>

            <div className={'search-bar-outer-div'}>

              <div className={'search-bar-div'}>
                <input type="search" onChange={this.filterResults} value={this.state.queryString} placeholder="Search..."/>
              </div>


            </div>

            <div className={'outer-header-wrapper'}>
              <div className={'header-wrapper'}>
                {
                  <table className={"header-Table"}>
                    <tr className={"tr-header-table"}>
                      <th className={"td-header-table"}>Website</th>
                      <th className={"td-header-table"}>Opt Out Link</th>
                      <th className={"td-header-table"}>Removal Instructions</th>
                      <th className={"td-header-table"}>Complete?</th>
                    </tr>
                  </table>
                }
              </div>
            </div>

          </div>

          <div className='outer-wrapper'>

            <div className={'table-wrapper'}>
              <table id={"optout-Table"}>
                <tbody>


                {
                  this.state.dataBrokers
                      .filter(broker => broker.name.toLowerCase().includes(this.state.queryString.toLowerCase()))
                      .map((broker) =>
                            <tr className={broker.complete === true ? 'tr-complete' : 'tr-incomplete'}>
                              <td className={broker.complete === true ? 'td-complete' : 'td-incomplete'}>
                                {broker.name}
                              </td>

                              <td className={broker.complete === true ? 'td-complete' : 'td-incomplete'}>
                                {this.getOptOutContent(broker)}
                              </td>


                              <td className={broker.complete === true ? 'td-complete' : 'td-incomplete'}>
                                <button onClick={() => this.instructionButtonClick(broker.name)} type='button'
                                        className={broker.complete === true ? 'button-grey' : 'button'}>
                                  {"Removal Instructions"}
                                </button>

                              </td>

                              <td className={broker.complete === true ? 'td-complete' : 'td-incomplete'}>
                                <button onClick={() => this.buttonChange(broker.name)} type='button'
                                        className={broker.complete === true ? 'button-grey' : 'button'}>
                                  {broker.complete ? "Complete" : "Incomplete"}
                                </button>
                              </td>
                            </tr>
)

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
              </tbody>
              </table>


            </div>
          </div>
        </div>
    )
  };
}

export default App;





