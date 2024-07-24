import { Badge } from 'react-bootstrap';
import { ArgMin } from './Utils';
import { Ask, MoreInfo } from './pages/Info';
import { colormaps } from './config'
import './index.css';

export function LegendPanel({ param, opt }){
    let minmax = (opt === 'CH') ? [param.CHMin, param.CHMax] : [param.Min, param.Max]
    const colormap = (opt === 'CH') ? colormaps[param.Palette2] : colormaps[param.Palette1]
    const ids = [...Array(20).keys()]
    const unit = param.Unit === 'per cent' ? 'value in %' : param.Unit
    const proportional = param.Proportional ? 'increasing value means better condition' : 'increasing value means worse condition'
    
    let delta = [0.001,0.002,0.005,0.01,0.02,0.05,0.1,0.2,0.5,1,2,5,10,20]
    let digit = [3,3,3,2,2,2,2,1,1,0,0,0,0,0]
    const idx = ArgMin(
      delta.map((item) => (
        Math.abs(6 - (minmax[1] - minmax[0])/item)
    )))
    delta = delta[idx]
    digit = digit[idx]
  
    let ticks = [minmax[0]]
    let sticks = [10]
    const sdelta = 80*delta/(minmax[1]-minmax[0])
    while (ticks[ticks.length-1] <= (minmax[1] - delta)){
      const n = ticks.length
      ticks.push(ticks[n-1] + delta)
      sticks.push(sticks[n-1] + sdelta)
    }

    const cbar = (
      <div className='text-center'>
      <svg width='100%' height='65'>
        {ids.slice(0,20).map((item) => (
          <rect key={item} x={(10+item*4)+'%'} y='0%' rx='3px' ry='3px' width='4%' height='30' stroke='#2b2b2b' fill={colormap[item]}/>
        ))}
        <line x1='10%' x2='90%' y1='40' y2='40' stroke='black' weight='2'/>
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
      <div className='row m-0 p-2 mb-2 rounded-3 bg-secondary-subtle' style={{maxWidth:'800px'}}>
        <div className='p-0'>
          <h5><Badge bg='danger'>{param.Indicator}</Badge></h5>
        </div>
        
        <div className='row p-0 m-0'>
          <div className='col-4 p-0 m-0' style={{fontSize:'75%'}}>
            <p>
              <b>Definition</b><br/>
              {param.Definition}
            </p>

            {param.Remark ? <p>
              <b>Note</b>
              <MoreInfo content={param.Remark}/>
            </p> : <></>}
          </div>
          
          <div className='col-8' style={{fontSize:'75%'}}>
            <div className='row p-0 m-0 justify-content-between'>
              <div className='col-md-6 p-0 m-0'>
                <b>Remarks</b><br/>
                <b>Round 2{'\u25B9'}</b> {(param.R2) ? (param.R2 + ', ' + param.Y2) : 'NA'}<br/>
                <b>Round 1{'\u25B9'}</b> {(param.R1) ? (param.R1 + ', ' + param.Y1) : 'NA'}<br/>
                <b>Change{'\u25B9'}</b> {(param.R1 && param.R2) ? <>Round 2 - Round 1</> : 'NA'}
              </div>

              <div className='col-md-6 p-0 m-0'>
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