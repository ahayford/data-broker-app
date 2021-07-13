// import logo from './logo.svg';
import './App.css';
import React from 'react';
import data from './data-brokers.json'
import ModalComponent from './components/ModalComponent'


let dataBrokers = data;

//preprocess the data
for (let i=0; i<dataBrokers.length; i++) {
  dataBrokers[i].complete === "FALSE"? dataBrokers[i].complete = false : dataBrokers[i].complete = true;
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
      <h1>{dataBroker.name}</h1>
      <p>{dataBroker.instruction}</p>

      {/*<p>*/}
      {/*  <button onClick={() => this.buttonChange(dataBroker.name)} type='button'>*/}
      {/*    {"Mark as Complete"}*/}
      {/*  </button>*/}

      {/*  <button onClick={() => this.setState({*/}
      {/*  showModal: !this.state.showModal*/}
      {/*})} type='button'>*/}
      {/*  {"Cancel"}*/}
      {/*</button>*/}

      {/*</p>*/}
    </>
  }

  getOptOutContent = (broker) => {
    if (broker.optout.search(/^http[s]?:\/\//) !== -1) {
      return <a href={broker.optout} target={"_blank"} rel={"noreferrer"}>{'Opt Out Form'}</a>
    } else if (broker.optout.search(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi) !== -1) {
      return <a href={`mailto:` + broker.optout}>Email</a>
    }
  }

  render() {
    return (
        <div className='App'>
          <input type="search" onChange={this.filterResults} value={this.state.queryString}/>
          <div>
            {this.state.dataBrokers
                .filter(broker => broker.name.toLowerCase().includes(this.state.queryString.toLowerCase()))
                .map((broker) =>
                    <div key={broker.name} className={"data-row"}>
                      <div className={"data-column"}>
                        {broker.name}
                      </div>
                      <div className={"data-column"}>
                        {this.getOptOutContent(broker)}
                      </div>

                      <div className={"data-column"}>
                        <button onClick={() => this.instructionButtonClick(broker.name)} type='button'>
                          {"Removal Instructions"}
                        </button>
                      </div>

                      <div className={"data-column"}>
                        <button onClick={() => this.buttonChange(broker.name)} type='button'>
                          {
                            broker.complete ? "Complete" : "Incomplete"
                          }
                        </button>
                      </div>
                    </div>
                )
            }
            <ModalComponent
                isShowing={this.state.showModal}
                onToggle={() =>
                    this.setState({
                      showModal: !this.state.showModal
                    })
                }
            >
              {this.getModalContent()}
            </ModalComponent>

          </div>

        </div>
    )
  };
}

export default App;





