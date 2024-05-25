import { useState } from "react";
import { Accordion, Form } from "react-bootstrap";
import { BsQuestionCircleFill, BsCaretUpFill, BsArrowDownCircleFill, BsPrinterFill, BsDashCircleFill, BsPlusCircleFill, BsHouseFill, BsCaretDownFill } from 'react-icons/bs';
import { ArgMin, FloatFormat, LookupTable, GetColor, GetXFromRGB, SimpleSelect, BasicSelect } from './Utils';
import { Ask } from './pages/Info';
import { colormaps } from './config'
import './index.css';

export function ZoomPanel({ map, param }){
  return (
    <div id='zoomPanel' className='leaflet-bottom leaflet-left'>
      <div className='leaflet-control btn-group-vertical'>
        <button className='map-btn' title='Zoom-in' onClick={() => map.zoomIn()}><BsPlusCircleFill /></button>
        <button className='map-btn' title='Zoom-out' onClick={() => map.zoomOut()}><BsDashCircleFill /></button>
        <button className='map-btn' title='Reset View' onClick={() => map.setView(param.Center, param.Zoom)}><BsHouseFill /></button>
      </div>
    </div>
  )
}

export function RadioPanel({ p, setP, param }){
  const [showControl, setShowControl] = useState(true);
  let noGrid = param.config.DistrictOnly.includes(param.indicator) ? true : false;
  let noR1 = param.config.NoR1.includes(param.indicator) ? true : false;
  let noR2 = param.config.NoR2.includes(param.indicator) ? true : false;

  function hideLayerControl(){
    let elem = document.getElementById('layerControl');
    if (elem.getAttribute('style') === 'display: block;') {
      elem.style.display = 'none';
      setShowControl(false);
    } else {
      elem.style.display = 'block';
      setShowControl(true);
    }
  }

  function changeOption(val){
    let par = {...p}
    par['round'] = val
    par['field'] = param.indicator + '_' + val,
    par['showImprove'] = 'all'
    par['probLimit'] = 0
    setP(par)
  }

  function showHiRes(val){
    let par = {...p}
    par['showRaster'] = val
    setP(par)
  }

  return (
    <div className="leaflet-top leaflet-left">
      <div className='leaflet-control m-2 pb-0 mb-0'>
          <div id='layerButton' className='p-1 m-0 text-light' onClick={hideLayerControl}
            style={{minHeight:'20px', width:'100px', borderRadius:'7px', background:'#e9546e'}}>
            Layers <span className='float-end'>{showControl ? <BsCaretUpFill/> : <BsCaretDownFill/>}</span>
            </div>
  
          <div id='layerControl' style={{display:'block'}}>
          <Form style={{padding:'5px 5px 0px 5px', borderRadius:'7px', background:'#f0f0f0'}}>
            <div className='m-0'>
              <Form.Check
                defaultChecked={noR2 ? true : false}
                disabled={noR1}
                type='radio'
                id='radio1'
                label='Round 1'
                name='optRound'
                title={noR1 ? 'Unavailable for this indicator' : 'Show round 1 data'}
                onClick={() => changeOption('R1')}
              />
            </div>
            <div className='m-0'>
              <Form.Check 
                defaultChecked={noR2 ? false : true}
                disabled={noR2}
                type='radio'
                id='radio2'
                label='Round 2'
                name='optRound'
                title={noR2 ? 'Unavailable for this indicator' : 'Show round 2 data'}
                onClick={() => changeOption('R2')}
              />
            </div>
            <div className='m-0'>
              <Form.Check 
                disabled={noR2 || noR1}
                type='radio'
                id='radio3'
                label='Change'
                name='optRound'
                title={noR2 ? 'Unavailable for this indicator' : 'Show change'}
                onClick={() => changeOption('CH')}
              />
            </div>
          </Form>
          <Form style={{padding:'5px 5px 0px 5px', borderRadius:'7px', background:'#f0f0f0'}}>
            <div>
              <Form.Check 
                defaultChecked={true}
                type='radio'
                id='radio_agg'
                label='District Level'
                name='optRaster'
                title='Show aggregated data'
                onClick={() => showHiRes(false)}
              />
            </div>
            <div>
              <Form.Check 
                disabled={noGrid}
                type='radio'
                id='radio_grid'
                label='Grid Level'
                name='optRaster'
                title={noGrid ? 'Unavailable for this indicator' : 'Show gridded data'}
                onClick={() => showHiRes(true)}
              />
            </div>
          </Form>
        </div>
        </div>
    </div>
  )
}

export function LegendPanel({ param, opt }){
    let minmax = (opt === 'CH') ? [param.CHMin, param.CHMax] : [param.Min, param.Max]
    const colormap = colormaps['CIFF20_r']
    const ids = [...Array(20).keys()]
    const unit = param.Unit === 'percent' ? 'value in %' : param.Unit
    const proportional = param.Proportional ? 'increasing value means better condition' : 'increasing value means worse condition'
    
    let delta = [0.1,0.2,0.5,1,2,5,10,20]
    let digit = [1,1,1,0,0,0,0,0]
    const idx = ArgMin(
      delta.map((item) => (
        Math.abs(6 - (minmax[1] - minmax[0])/item)
    )))
    delta = delta[idx]
    digit = digit[idx]
  
    let ticks = [minmax[0]]
    let sticks = [5]
    const sdelta = 90*delta/(minmax[1]-minmax[0])
    while (ticks[ticks.length-1] < minmax[1]){
      const n = ticks.length
      ticks.push(ticks[n-1] + delta)
      sticks.push(sticks[n-1] + sdelta)
    }

    const cbar = (
      <div className='text-center'>
      <svg width='100%' height='65'>
        {ids.slice(0,18).map((item) => (
          <rect key={item} x={(5+item*5)+'%'} y='0%' rx='5px' ry='5px' width='5%' height='30' stroke='#2b2b2b' fill={colormap[item]}/>
        ))}
        <line x1='0' x2='100%' y1='40' y2='40' stroke='black' weight='2'/>
        {sticks.map((item, id) => (
          <line key={id} x1={item+'%'} x2={item+'%'} y1='37' y2='43' stroke='black' weight='2'/>
        ))}
        {ticks.map((item, id) => (
          <text key={id} x={sticks[id]+'%'} y='55' textAnchor='middle' fontSize='90%'>{parseFloat(item).toFixed(digit)}</text>
        ))}
      </svg>
      <span><b>{unit}</b></span><br/>
      <span><i>{proportional}</i></span>
      </div>
    )
    
    //const updateIndicator = (value) => {}

    return (
      <div className='row m-0 p-2 mb-2 rounded-3 bg-secondary-subtle'>
        <div className='p-0'>
          <div className='subtitle'>
          {param.Indicator}
          </div>
        </div>
        
        <div className='row p-0 m-0'>
          <div className='col-5 p-0 m-0' style={{fontSize:'75%'}}>
            <p>
              <b>Definition</b><br/>{param.Definition}
            </p>
          </div>
          
          <div className='col-7' style={{fontSize:'75%'}}>
            <div className='row p-0 m-0 justify-content-between'>
              <div className='col-md-5 p-1 m-0'>
                <b>Remarks</b><br/>
                <b>R<sub>1</sub>{'\u25B9'}</b> {param.R1}, {param.Y1}
                <br/><b>R<sub>2</sub>{'\u25B9'}</b> {param.R2}, {param.Y2}
                <br/><b>Ch{'\u25B9'}</b> (R<sub>2</sub> - R<sub>1</sub>)
              </div>

              <div className='col-md-7 p-1 m-0' style={{maxWidth:'400px'}}>
                <div className='float-end'>
                  <Ask about='About this color bar' />
                </div>
                {cbar}
              </div>
            </div>
          </div>

        </div>
      </div>
    )
}