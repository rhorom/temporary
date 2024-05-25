import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  useNavigate, useLocation
} from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { Chart } from './Chart';
import { Map } from './Map';
import { ToolBar } from './pages/Modal.jsx';
import { Ask } from './pages/Info.jsx';

import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { mainConfig, pIndicator, probOption } from './config.jsx'

const country_paths = Object.keys(mainConfig)
//const countries = country_paths.map((item) => mainConfig[item].Name)
const countries = ['Burkina Faso', 'India', 'Kenya', 'Nigeria']
const disableCountries = ['Burkina Faso', 'Nigeria']

const fetchData = async (url, func) => {
  await fetch(url)
  .then(resp => resp.json())
  .then(json => func(json))
}

export function MainApp() {
  let navigate = useNavigate()
  let location = useLocation()
  const [appParam, setAppParam] = useState({
    country: '',
    indicator: '',
    config: '',
    showData: 'all',
    probLimit: 0.0
  })

  const [boundary, setBoundary] = useState()
  const [aggData, setAggData] = useState()
  const [tabData, setTabData] = useState()
  const [regData, setRegData] = useState()
  const [region, setRegion] = useState()

  const filterFunction = useCallback((feature) => {
    const val = feature[`${appParam.indicator}_CH`];
    const pval = feature[`${appParam.indicator}_CH_P`];
    let res = true
    if (pIndicator.includes(appParam.indicator)){
      res = (appParam.showData === 'pos') ? ((val > 0) && (pval > appParam.probLimit)) : (appParam.showData === 'neg') ? ((val <= 0) && (pval < (100-appParam.probLimit))) : true
    } else {
      res = (appParam.showData === 'neg') ? ((val > 0) && (pval > appParam.probLimit)) : (appParam.showData === 'pos') ? ((val <= 0) && (pval < (100-appParam.probLimit))) : true
    }
    return res
  }, [appParam.showData, appParam.probLimit])

  useEffect(() => {
    const val = location.pathname.split('/')
    let param = {
      country: '',
      indicator: '',
      config: '',
      showData: 'all',
      probLimit: 0.0
    }

    if (country_paths.includes(val[1])){
      param['country'] = val[1]
      param['config'] = mainConfig[val[1]]
      const indicators = Object.keys(param.config.indicators)
    
      if ((val.length === 3) & (indicators.includes(val[2]))){
        param['indicator'] = val[2]
      } else {
        param['indicator'] = ''
      }
    }

    setAppParam(param, {replace:true})
    console.log('change url', val)

    const url = `./public/data/${param.country}`
    fetchData(`${url}/${param.config.TLC}_adm1.json`, setBoundary)
    fetchData(`${url}/${param.config.TLC}_data.json`, setAggData)
    fetchData(`${url}/${param.config.TLC}_table.json`, setTabData)
    console.log('fetch data', url)

  }, [])

  useEffect(() => {
    if (region) {
      const filtered = tabData
        .filter((item) => item.state === region)
      setRegData(filtered, {replace:true})
      
      console.log('change region', region)
    }
  }, [region])

  function changeCountry(e){
    const val = e.target.value
    let param = {
      country: val,
      indicator: '',
      config: mainConfig[val],
      showData: 'all',
      probLimit: 0.0
    }
    setAppParam(param, {replace:true})
    setRegion()
    setAggData()
    setRegData()
    navigate('/'+val, {replace:true})

    console.log('fetch data')
    const url = `./public/data/${param.country}`
    fetchData(`${url}/${param.config.TLC}_adm1.json`, setBoundary)
    fetchData(`${url}/${param.config.TLC}_data.json`, setAggData)
    fetchData(`${url}/${param.config.TLC}_table.json`, setTabData)

    if (document.getElementById('selectIndicator')) {
      document.getElementById('selectIndicator').value = ''  
    }
  }

  function changeIndicator(e){
    const val = e.target.value
    let par = {...appParam}
    par['indicator'] = val
    par['showData'] = 'all'
    par['probLimit'] = 0.0

    setAppParam(par, {replace:true})
    setRegion()
    setRegData()
    navigate(`/${appParam.country}/${val}`, {replace:true})
  }

  function SelectCountry(){
    return (
      <div>
        <b>Select country</b>
        <Form.Select
          id='selectCountry'
          onChange={changeCountry}
          defaultValue={appParam.country}
        >
          <option value=''></option>
          {countries.map((item,i) => {
            const val = item.replace(' ','').toLowerCase()
            return (<option key={i} value={val} 
              disabled={disableCountries.includes(item)}>
                {item}
              </option>)
          })}
        </Form.Select>
      </div>
    )
  }

  const SelectIndicator = useMemo(() => {
    if (appParam.country != '') {
      let indicators = {}
      Object.keys(appParam.config.indicators).forEach((item) => {
        const theme = appParam.config.indicators[item].Theme
        if (Object.keys(indicators).includes(theme)){
          indicators[theme].push({
            'Key':item, 
            'Indicator':appParam.config.indicators[item].Indicator})
        } else {
          indicators[theme] = [{
            'Key':item, 
            'Indicator':appParam.config.indicators[item].Indicator}]
        }
      })
      return (
        <div>
          <b>Select indicator</b>
          <Form.Select
            id='selectIndicator'
            onChange={changeIndicator}
            defaultValue={appParam.indicator}
          >
            <option value=''></option>
            {Object.keys(indicators).sort().map((item,i) => {
              return (
                <optgroup label={item} key={i}>
                  {indicators[item].sort().map((subitem,j) => {
                    return (<option key={j} value={subitem.Key}>{subitem.Indicator}</option>)
                  })}
                </optgroup>
              )
            })}
          </Form.Select>
        </div>
      )  
    } else {
      return <></>
    }
  }, [appParam.country])

  const SelectFilter = useMemo(() => {
    const handleChange = (e) => {
      const val = e.target.value
      let par = {...appParam}
      if (val.slice(0,3) === 'pos') {
        par['showData'] = 'pos'
        par['probLimit'] = probOption['Show Improvement'][val]['limit']
      } else if (val.slice(0,3) === 'neg') {
        par['showData'] = 'neg'
        par['probLimit'] = probOption['Show Worsening'][val]['limit']
      } else {
        par['showData'] = 'all'
        par['probLimit'] = 0.0
      }
      setAppParam(par, {replace:true})
    }

    return (
      <div>
        <b>Filter by Change Significance</b>
        <Ask about='Note on the change certainty' positive={true}/>
        <Form.Select
            id='selectChange'
            onChange={handleChange}
            defaultValue={'all'}
          >
            <option value='all'>Show all</option>
            {Object.keys(probOption).map((item,i) => {
              return (
                <optgroup key={i} label={item}>
                  {Object.keys(probOption[item]).map((opt, j) => {
                    return (
                      <option key={j} value={opt}>{probOption[item][opt]['label']}</option>
                    )
                  })}
                </optgroup>
              )
            })}
          </Form.Select>
      </div>
    )
  }, [appParam.indicator])

  const MapPanel = useMemo(() => {
    if (aggData) {
      console.log('render map')
      return <Map param={appParam} boundary={boundary} data={aggData} func={setRegion}/>
    } else {
      return <></>
    }
  }, [aggData, appParam.indicator])

  const ChartPanel = useMemo(() => {
    if (regData) {
      //return <Chart data={regData} param={appParam}/>
      return <></>
    } else {
      return <></>
    }
  }, [region, regData])
  
  return (
    <div className='container-fluid'>
      <blockquote className='blockquote text-center p-2'>
        <h2 className='display-6'>Subnational mapping of child and maternal health and development indicators in selected low- and <br/>middle-income countries</h2>
      </blockquote>
      
      <div className='row mt-3 p-2 mb-3 rounded-3 bg-secondary-subtle'>
        <div className='row d-flex justify-content-between'>
          <div className='col-lg-8'>
            <p>This web application presents a summary of the child and maternal health and development indicators calculated at subnational level (geographic areas below the national level) for a selection of countries of interest to CIFF.</p>
            <p>Multiple indicators are presented in map, chart, and tabulated form, and for multiple time points based on data availability. Changes over time for each indicator are also presented.</p>
            <p>Please consult the <a href='/guide'>Guide</a> and the <a href='/about'>About</a> sections for more information on how to use this portal.</p>
          </div>
          <div className='col-lg-4 px-3' id='selection'>
            <SelectCountry />
            <br/>
            {SelectIndicator}
          </div>
        </div>
      </div>

      {appParam.indicator === '' ? <></> : 
      <div className='p-0 m-0'>
        <div className='row mt-3 p-2 mb-3 rounded-3 bg-secondary-subtle'>
          <div className='row d-flex justify-content-between'>
            <h5 className='mt-2'>Map of {appParam.config.Name}</h5>
            <hr/>
            <div className='col-lg-8'>
              <p>The map below displays surfaces of subnational areas (either at {appParam.config.Adm1.toLowerCase()} and {appParam.config.Adm2.toLowerCase()} level or high-resolution 5x5km - pixel level data) of a particular indicator in {appParam.config.Name}.</p>
              <p>Data from Round 1 ({appParam.config.indicators[appParam.indicator].R1}, {appParam.config.indicators[appParam.indicator].Y1}), Round 2 ({appParam.config.indicators[appParam.indicator].R2}, {appParam.config.indicators[appParam.indicator].Y2}), or the change between rounds (Round 2 - Round 1) for {appParam.config.Name} can be selected and displayed.</p>
              <p>To get deeper information on a specific {appParam.config.Adm1.toLowerCase()} or {appParam.config.Adm2.toLowerCase()} in {appParam.config.Name}, click on an area on the map or use the drop-down menu below. Once an area on the map has been selected, an additional set of information including tables or graphs to facilitate the interpretation of the data is displayed on the right side panel (Summary, Chart, and Table tabs).</p>
            </div>
            <div className='col-lg-4 px-3' id='selection'>
              {SelectFilter}
            </div>
          </div>
        </div>
        
        <div className='row mt-3 p-0 mb-3'>
          <div className='col-xl-7 p-0 m-0'>
            {MapPanel}
          </div>

          <div className='col p-0' style={{marginLeft:'15px'}}>
            {ChartPanel}
          </div>
        </div>
      </div>
      }
    </div>
  )
}