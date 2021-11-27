import React, {useState} from 'react';
import axios from 'axios';
import greenonionimg from './assets/green-onion.png';
import {BrowserRouter, Switch, Route, Link, Redirect} from 'react-router-dom';
import CheckShortUrlAndRedir from './CheckShortUrlAndRedir';
import 'bulma/css/bulma.css';

function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [token , setToken] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const copyToClicpboard = async () => {
      if( token.trim() != '') {
         const r = await navigator.clipboard.writeText( `http://localhost:3000/${token}`);
         setIsCopied(true);
      }
  }

  const callUrlShortner = async () => {
    try {
      const response=await axios.post('http://localhost:5000/greenonion/api/makeurlshort',
          {inputurl:inputUrl}
      );
      const { longUrl, token} = response.data;
      setIsCopied(false);
      setToken(token);
    }
    catch(err) {
       console.log(err.response.status)
    }
    
  }

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path='/greenonion/404' exact>
            <div className="columns">
                <div className="column is-3"></div>
                <div className="column is-6">
                    <div className="columns is-vcentered">
                      <div className="column is-4">
                        <img src={greenonionimg} alt="green onion logo"></img> 
                      </div>
                      <div className="column">
                        <h3 className="title is-3" style={{color:'#b3c6c2'}}>404 Page is not found</h3>
                        <Link to="/greenonion/main" className="tag is-link">home</Link>
                      </div>
                    </div>
                  </div>
                  <div className="column is-3"></div>
              </div>
          </Route>
          <Route path='/greenonion/main' exact>
              <div className="columns">
                <div className="column is-3"></div>
                <div className="column is-6">
                    
                    <div className="columns is-vcentered">
                      <div className="column is-3">
                        <img src={greenonionimg} alt="green onion logo"></img> 
                      </div>
                      <div className="column">
                        <h6 className="title is-6">green onion</h6>
                      </div>
                    </div>
                    <div style={{marginTop:'20px'}}>
                      <input className="input is-small" type="text" value={inputUrl} onChange={(e) => { setInputUrl(e.target.value); } }></input>
                      <div style={{textAlign:'right' ,marginTop:'5px'}}>
                        <button className="button is-small is-success" type="button" disabled={inputUrl.trim() == ''} onClick={() => { callUrlShortner(); } }>make url short</button>
                        <button style={{marginLeft:'5px'}} className="button is-small" onClick={()=>{
                            setInputUrl('');
                            setToken('');
                            setIsCopied(false);
                        }}>clear</button>
                      </div>
                    </div>
                    <div style={{marginTop:'50px'}}>
                        {token != '' &&
                        <>
                          <span className="content is-small">http://localhost:3000/{token}</span>
                          { isCopied ? <><span style={{marginLeft:'20px'}}  className="tag is-success is-small">copied</span></> :
                            <button type="button" style={{marginLeft:'20px'}} className="button is-small is-outlined is-success"
                              onClick={copyToClicpboard}
                              >copy to clipboard</button>                 
                          }
                        </>
                        }
                    </div>
                    <div style={{marginTop:'100px'}} className="content is-small">
                        
                        <p><span className="tag is-info">i</span> Built using react js, node js, express, mongodb and bulma.
                        Expiry time is 6 hours from the time of token generation</p>
                        <p>Icons made by <a href="" title="Icongeek26">Icongeek26</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></p>
                    </div>

                </div>
                <div className="column is-3"></div>
              </div>
              
          </Route>
          <Route path='/:shorturl' exact>
              <CheckShortUrlAndRedir></CheckShortUrlAndRedir>
          </Route>
          <Route path='/'>
              <Redirect to='/greenonion/404'></Redirect>    
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
