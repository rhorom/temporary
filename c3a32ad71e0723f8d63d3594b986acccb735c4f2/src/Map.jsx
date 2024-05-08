import { React, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { MapContainer, GeoJSON, Circle, Pane, TileLayer, useMap } from 'react-leaflet';
import { BsQuestionCircleFill, BsCaretUpFill, BsArrowDownCircleFill, BsPrinterFill, BsDashCircleFill, BsPlusCircleFill, BsHouseFill, BsCaretDownFill } from 'react-icons/bs';
import { TiledMapLayer } from 'react-esri-leaflet';
import { Form } from 'react-bootstrap';

import { ArgMin, FloatFormat, LookupTable, GetColor, GetXFromRGB, SimpleSelect, BasicSelect } from './Utils';
import { mainConfig, indicatorDef, StateStyle, StateStyle2, DistrictStyle } from './config';
import { ZoomPanel, RadioPanel, LegendPanel } from './MapUtils'

const basemaps = {
  'esri':'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  'label':'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
  'positron': 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
};
var main_map;

export function Map({param}){
  let cfg = mainConfig[param.country]
  
  const [boundary, setBoundary] = useState()
  const [opt, setOpt] = useState({
    round: 'R2',
    showRaster: false,
    showLabel: false,
    showImprove: false,
    probLimit: 0
  })

  const ref = useRef()
  
  const DefineMap = () => {
    main_map = useMap();
    return null
  }

  useEffect(() => {
    const url = `./public/data/${param.country}/adm0.json`
    console.log(url)
    //const url = `https://github.com/rhorom/grid_viewer/tree/main/src/data/${param.country}/adm0.json`
    fetch(url)
      .then(resp => resp.json())
      .then(json => {
        setBoundary(json)
      })
  }, [param])

  useEffect(() => {
    if (ref.current) {
      ref.current.clearLayers()
      ref.current.addData(boundary)
    }
  }, [ref, boundary])

  const theRadioPanel = useMemo(() => {
    return (
      <RadioPanel pass={setOpt} param={param}/>
    )
  }, [param])

  const theLegendPanel = useMemo(() => {
    let c = cfg.indicators[param.indicator]
    c['Definition'] = indicatorDef[param.indicator].Definition
    c['Unit'] = indicatorDef[param.indicator].Unit
    c['Proportional'] = indicatorDef[param.indicator].Proportional
    return <LegendPanel param={c} opt={opt.round}/>
  }, [param, opt])

  return (
    <div className='row'>
      <div className='row' style={{minHeight:'120px'}}>
        <div className='title'>Map of {cfg.Name}</div>
        <div className='frame' style={{fontSize:'100%'}}>
          <div>
            <p>The map below displays surfaces of subnational areas (either at {cfg.Adm1} and {cfg.Adm2} level or high-resolution 5x5km - pixel level data) of a particular indicator in {cfg.Name}.</p>
            <p>Data from Round 1 ({cfg.indicators[param.indicator].R1}, {cfg.indicators[param.indicator].Y1}), 
              Round 2 ({cfg.indicators[param.indicator].R2}, {cfg.indicators[param.indicator].Y2}), 
              or the change between rounds (Round 2 - Round 1) for {cfg.Name} can be selected and displayed.</p>
            <p>To get deeper information on a specific {cfg.Adm1} or {cfg.Adm2} in {cfg.Name}, 
              click on an area on the map or use the drop-down menu below. Once an area on the map has been selected, 
              an additional set of information including tables or graphs to facilitate the interpretation 
              of the data is displayed on the right side panel (Summary, Chart, and Table tabs).</p>
          </div>
        </div>
      </div>

      <div id='map-container' className='row m-0 mb-5'
        style={{paddingLeft:'0px', paddingRight:'25px'}}
      >
        {theLegendPanel}

        <MapContainer
          zoomControl={false}
          center={param.config.Center}
          zoom={param.config.Zoom}
          minZoom={3}
          maxZoom={9}
          style={{width:'100%', height:'60vh', minHeight:'400px', background:'#fff', borderRadius:'10px'}}
        >

          <DefineMap/>
          <ZoomPanel map={main_map} param={param.config}/>
          {theRadioPanel}
          {/* 
          <Pane name='basemap' style={{zIndex:0}}>
            {<TileLayer url={basemaps['positron']}/>}
          </Pane>
          */}

          <Pane name='selected' style={{zIndex:60}}>
            <GeoJSON data={boundary} ref={ref}/>
          </Pane>
        </MapContainer>
      </div>
  
    </div>
  )
}