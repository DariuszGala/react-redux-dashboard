import * as React from 'react';
import {connect, DispatchProp} from 'react-redux';
import {
  fetchCoinData, 
  selectCoinAndFetchPriceData, 
  selectCurrencyAndFetchHistoData
} from './../actions/actionCreators';

import {SelectBar} from './../components/SelectBar';
import {Content} from './../components/Content';

interface IProps {
  state: any;
  dispatch: any;
  fetchsCoinData: any;
  selectCoinAndFetchPriceData: any;
  selectCurrencyAndFetchHistoData: any;
}

class App extends React.Component<IProps & DispatchProp<any>> {
  props: IProps;
  coinsState: any;

  constructor(props: any) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(
      fetchCoinData()
    ).then((response: any) => {
        const initialCoinSymbol = Object.keys(response.payload)[0];
        return this.props.dispatch(selectCoinAndFetchPriceData(initialCoinSymbol, 'USD'));
      }
    ).catch((error: any)=> {
      console.log(error);
    });
  }

  selectHandler(value: string, type: string) {
    if (type === 'currency') {
      this.props.dispatch(selectCurrencyAndFetchHistoData(this.props.state.selectedCoin, value));
    } else {
      this.props.dispatch(selectCoinAndFetchPriceData(value, this.props.state.selectedCurrency));
    }
  }

  render() {
    const coinsState = this.props.state;

    const coinDataState = coinsState.coinData;
    const priceDataState = coinsState.priceData;
    const histoDataState = coinsState.histoData;

    const isDataLoading = coinDataState.isLoading;
    
    const coinsData = coinDataState.values;
    const priceData = priceDataState.values;
    const histoData = histoDataState.values;

    const selectedCoin = coinsState.selectedCoin;
    const selectedCurrency = coinsState.selectedCurrency;
   
    const selectedCoinData = coinsData[selectedCoin] || {};
    const selectedCoinPriceValue = priceData[selectedCurrency];
    const selectedCoinPrice = selectedCoinPriceValue ?
                                {value: selectedCoinPriceValue, currency: selectedCurrency} : {};

    const coinsItems = Object
        .keys(coinsData)
        .map((item: string) => {
          return {name: coinsData[item].FullName, value:coinsData[item].Symbol}
        });

    const currencyItems = Object
        .keys(priceData)
        .map((item: string) => {
          return {name: item, value: item}
        });

    const appContent = isDataLoading ? 
      <div className='loading'>
        <div className='icon is-large'>
          <i className="fa fa-spin fa-spinner fas fa-3x" aria-hidden="true"></i>
        </div>
      </div> : 
      <div>
       <div className='level'>
        <div className='level-left'>
          <h1 className='title'>
            Cryptocurrency Dashboard
          </h1>
        </div>
        <div className='level-right'>
          <SelectBar items={coinsItems} selectHandler={this.selectHandler.bind(this)} label={'Choose coin:'} type='coin'/>
          <SelectBar items={currencyItems} selectHandler={this.selectHandler.bind(this)} label={'Choose currency:'} selected={selectedCurrency} type='currency'/>
        </div>
        </div>
        <Content coinData={selectedCoinData} priceData={selectedCoinPrice} histoData={histoData} selectedCoin={selectedCoin}/>
      </div>

    return (
      <div className='wrapper'>
        {appContent}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {state}
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchCoinData: () => {
      dispatch(fetchCoinData());
    },
    selectCoinAndFetchPriceData: (selectedCoin: any, selectedCurrency: any) => {
      dispatch(selectCoinAndFetchPriceData(selectedCoin, selectedCurrency));
    },
    selectCurrencyAndFetchHistoData: (selectedCoin: any, selectedCurrency: any) => {
      dispatch(selectCurrencyAndFetchHistoData(selectedCoin, selectedCurrency));
    },
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
