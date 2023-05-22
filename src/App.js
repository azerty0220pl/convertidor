import { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLeft, faHeart } from '@fortawesome/free-solid-svg-icons';

const convFactors = [0.621371, 1.60934, 3.28084, 0.3048, 0.393701, 2.54];
const units = ['km', 'miles', 'm', 'feet', 'cm', 'inches'];

class App extends Component {
  constructor(props) {
    super(props);
    let data = JSON.parse(localStorage.getItem('convertidorSaved'));

    this.state = {
      saved: data == null ? [] : data,
      selected: 0,
      inputValue: '',
      resultValue: ''
    };

    this.selectChange = this.selectChange.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.invert = this.invert.bind(this);
    this.save = this.save.bind(this);
    this.load = this.load.bind(this);
    this.remove = this.remove.bind(this);
  }

  convert(num, sel) {
    let x = parseFloat(num);
    if (isNaN(x))
      this.setState({ resultValue: '' });
    else
      this.setState({ resultValue: (x * convFactors[sel]).toFixed(2) })
  }

  selectChange(e) {
    this.setState({
      selected: parseInt(e.target.value)
    });

    this.convert(this.state.inputValue, e.target.value);
  }

  inputChange(e) {
    this.setState({ inputValue: e.target.value });
    this.convert(e.target.value, this.state.selected);
  }

  invert() {
    let x = this.state.selected;
    x = this.state.selected + 1 - (this.state.selected % 2 * 2);
    this.setState({
      selected: x,
      inputValue: this.state.resultValue,
      resultValue: this.state.inputValue
    });
    this.convert(this.state.resultValue, x);
  }

  save() {
    if (this.state.inputValue !== '') {
      let x = this.state.saved;
      x.push({ selected: this.state.selected, input: this.state.inputValue });
      this.setState({
        saved: x,
        inputValue: '',
        resultValue: ''
      });
      localStorage.setItem("convertidorSaved", JSON.stringify(x));
    }
  }

  load(index) {
    this.setState({
      selected: this.state.saved[index].selected,
      inputValue: this.state.saved[index].input
    });

    this.convert(this.state.saved[index].input, this.state.saved[index].selected);
  }

  remove(index) {
    let x = this.state.saved;
    x.splice(index, 1);
    this.setState({
      saved: x
    });
    localStorage.setItem("convertidorSaved", JSON.stringify(x));
  }


  render() {
    return (
      <div className="app">
        <header>
          <h1><FontAwesomeIcon icon={faRightLeft} /> unit converter</h1>
        </header>

        <div className="converter">
          <h2>convert</h2>
          <div className="converter-1">
            <div className="converter-1-1">
              <select onChange={this.selectChange} value={this.state.selected}>
                <option value='0' label="km to miles" />
                <option value='1' label="miles to km" />
                <option value='2' label="m to foot" />
                <option value='3' label="foot to m" />
                <option value='4' label="cm to inch" />
                <option value='5' label="inch to cm" />
              </select>
              <button onClick={this.invert}><FontAwesomeIcon icon={faRightLeft} /></button>
            </div>
            <div className="converter-1-2">
              <input type="number" onChange={this.inputChange} value={this.state.inputValue} />
              <p>{units[this.state.selected]}</p>
            </div>
          </div>
          <div className="converter-2">
            <button className="converter-2-1" onClick={this.save}><FontAwesomeIcon icon={faHeart} /></button>
            <div className="converter-2-2">
              <p className="result">{this.state.resultValue}</p>
              <p>{units[this.state.selected + 1 - (this.state.selected % 2 * 2)]}</p>
            </div>
          </div>
        </div>

        <div className="saved">
          <h3>saved</h3>
          <div className="saved-1">
            {
              this.state.saved.map((elem, index) => {
                return (
                  <div key={index} className="entry">
                    <button onClick={() => { this.load(index) }}>{elem.input + " " + units[elem.selected] + " - " + (parseFloat(elem.input) * convFactors[elem.selected]).toFixed(2) + " " + (units[elem.selected + 1 - (elem.selected % 2 * 2)])}</button>
                    <button onClick={() => { this.remove(index) }}>x</button>
                  </div>)
              })
            }
          </div>
        </div>

        <footer>
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" target="_blank">Terms of service</a>
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" target="_blank">Privacy Policy</a>
        </footer>
      </div>
    );
  }
}

export default App;