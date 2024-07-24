import { React, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { MapContainer, GeoJSON, Pane, TileLayer, useMap } from 'react-leaflet';
import { TiledMapLayer } from 'react-esri-leaflet';
import { Form } from 'react-bootstrap';
import { FaPlusCircle, FaMinusCircle, FaHome, FaChevronUp, FaChevronDown } from 'react-icons/fa'

import { FloatFormat, GetColor } from './Utils';
import { mainConfig, indicatorDef, StateStyle, StateStyle2, DistrictStyle } from './config';
import { LegendPanel } from './MapUtils'

const basemaps = {
  'esri':'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  'label':'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
  'positron': 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
};

export function Map({ param, data, boundary, func, filterFunc }){
  const cfg = mainConfig[param.country]
  const description = cfg.indicators[param.indicator]
  const defRound = cfg.NoR2.includes(param.indicator) ? 'R1' : 'R2'
  const [selectedState, setSelectedState] = useState()
  const [opt, setOpt] = useState(
    {
      round: defRound,
      field: param.indicator + '_' + defRound,
      showRaster: false,
      showLabel: false
    }
  )

  useEffect(() => {
    const defRound = cfg.NoR2.includes(param.indicator) ? 'R1' : 'R2'
    setOpt({
      round: defRound,
      field: param.indicator + '_' + defRound,
      showRaster: false,
      showLabel: false
    })
    setSelectedState()
  }, [param.indicator])

  const refDistrict = useRef()
  const refState = useRef()
  const refSelected = useRef()
  const choropleth = useRef()
  
  var main_map;
  const DefineMap = () => {
    main_map = useMap();
    return null
  }

  const states = boundary.features.map((item) => {return item.properties})
  
  function zoomFit(bounds){main_map.fitBounds(bounds)}
  
  function ZoomPanel(){
    return (
      <div id='zoomPanel' className='leaflet-bottom leaflet-left'>
        <div className='leaflet-control btn-group-vertical'>
          <button className='map-btn' title='Zoom-in' onClick={() => main_map.zoomIn()}><FaPlusCircle /></button>
          <button className='map-btn' title='Zoom-out' onClick={() => main_map.zoomOut()}><FaMinusCircle /></button>
          <button className='map-btn' title='Reset View' onClick={() => main_map.setView(cfg.Center, cfg.Zoom)}><FaHome /></button>
        </div>
      </div>
    )
  }

  function RadioPanel(){
    const [showControl, setShowControl] = useState(true);
    let noGrid = cfg.DistrictOnly.includes(param.indicator) ? true : false;
    let noR1 = cfg.NoR1.includes(param.indicator) ? true : false;
    let noR2 = cfg.NoR2.includes(param.indicator) ? true : false;
  
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
      let par = {...opt}
      par['round'] = val
      par['field'] = param.indicator + '_' + val,
      par['showRaster'] = false
      setOpt(par, {replace:true})
    }
  
    function showHiRes(val){
      let par = {...opt}
      par['showRaster'] = val
      setOpt(par, {replace:true})
    }
    
    function showLabel(){
      let par = {...opt}
      par['showLabel'] = !opt.showLabel
      setOpt(par, {replace:true})
    }
  
    return (
      <div className="leaflet-top leaflet-left">
        <div className='leaflet-control m-1 p-0 m-0'>
          <div className='p-1 m-0 mt-1 rounded-2 bg-secondary-subtle' style={{display:'block'}}>
            <div className='subtitle' onClick={hideLayerControl}
              style={{height:'25px', width:'140px'}}>
              <b>Control</b><i className='float-end'>{showControl ? <FaChevronUp title='minimize'/> : <FaChevronDown title='maximize'/>}</i>
            </div>

            <div id='layerControl'>
              <Form>
                <Form.Check 
                  defaultChecked={opt.round === 'R2'}
                  disabled={noR2}
                  type='radio'
                  id='radio2'
                  label='Round 2'
                  name='optRound'
                  title={noR2 ? 'Unavailable for this indicator' : 'Show round 2 data'}
                  onClick={() => changeOption('R2')}
                />
                <Form.Check
                  defaultChecked={opt.round === 'R1'}
                  disabled={noR1}
                  type='radio'
                  id='radio1'
                  label='Round 1'
                  name='optRound'
                  title={noR1 ? 'Unavailable for this indicator' : 'Show round 1 data'}
                  onClick={() => changeOption('R1')}
                />
                <Form.Check 
                  defaultChecked={opt.round === 'CH'}
                  disabled={noR2 || noR1}
                  type='radio'
                  id='radio3'
                  label='Change'
                  name='optRound'
                  title={noR2 ? 'Unavailable for this indicator' : 'Show change'}
                  onClick={() => changeOption('CH')}
                />
              </Form>
              <hr className='mb-2 mt-0'/>
              <Form>
                <Form.Check 
                  defaultChecked={opt.showRaster === false}
                  type='radio'
                  id='radio_agg'
                  label='Administrative Level'
                  name='optRaster'
                  title='Show aggregated data'
                  onClick={() => showHiRes(false)}
                />
                <Form.Check
                  defaultChecked={opt.showRaster === true}
                  disabled={noGrid}
                  type='radio'
                  id='radio_grid'
                  label='Grid Level'
                  name='optRaster'
                  title={noGrid ? 'Unavailable for this indicator' : 'Show gridded data'}
                  onClick={() => showHiRes(true)}
                />
              </Form>
              <hr className='mb-2 mt-0'/>
              <Form>
                <Form.Check 
                  type='switch'
                  id='showLabel'
                  label='Show label'
                  defaultChecked={opt.showLabel}
                  onChange={showLabel}
                />
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const theLegendPanel = useMemo(() => {
    description['Definition'] = indicatorDef[param.indicator].Definition
    description['Unit'] = indicatorDef[param.indicator].Unit
    description['Proportional'] = indicatorDef[param.indicator].Proportional
    return <LegendPanel param={description} opt={opt.round}/>
  }, [param.indicator, opt.round])

  const theRadioPanel = useMemo(() => {
    return <RadioPanel />
  }, [param.indicator, opt])

  const SelectState = useMemo(() => {
    function changeState(e){
      setSelectedState(e.target.value)
      func(e.target.value)
    }
    return (
      <div>
        <b>Select {param.config.Adm1}</b>
        <Form.Select
          id='selectState'
          onChange={changeState}
          value={selectedState}
        >
          <option value=''></option>
          {states.map((item,i) => {
            return (<option key={i} value={item.state} x={item.x} y={item.y}>
                {item.state}
              </option>)
          })}
        </Form.Select>
      </div>
    )
  }, [selectedState])

  const inspectMap = useMemo(() => {
    return (
      <div className='row'>
        <div className='col-lg-7'></div>
        <div className='col-lg-5'>
          <b>Inspect Map</b>
        </div>
      </div>
    )
  }, [opt])

  const TileStyle = useCallback((feature) => {
    let palette = description['Palette1']
    let minmax = [description['Min'], description['Max']]
    if (opt.round === 'CH') {
      palette = description['Palette2']
      minmax = [description['CHMin'], description['CHMax']]
    }
    const color = GetColor(feature.properties[opt.field], 
      minmax, palette
    );
    return {
        zIndex: 2,
        weight: 0.5,
        opacity: 1,
        color: '#FFFFFF',
        fillOpacity: 1,
        fillColor: color
    }
  }, [param.indicator, opt])

  let district = data ? data.features.filter((item) => (item.properties.state === selectedState)) : []
  district.forEach((item) => {
    const content = opt.round === 'CH' ? (
      {
        'R1': item.properties[param.indicator + '_R1'], 
        'R2': item.properties[param.indicator + '_R2'], 
        'CH': item.properties[param.indicator + '_CH']}
    ) : (
      {
        [opt.round]: item.properties[opt.field],
      }
    )
    item.properties['toDisplay'] = content
  })

  useEffect(() => {
    if (refDistrict.current) {
      refDistrict.current.clearLayers()
      refDistrict.current.addData(district)
    }
  }, [refDistrict, district])

  useEffect(() => {
    if (refState.current) {
      refState.current.clearLayers()
      refState.current.addData(boundary)
    }
  }, [refDistrict, boundary])

  useEffect(() => {
    if (refSelected.current) {
      const s = boundary.features.filter((item) => (item.properties.state === selectedState));
      refSelected.current.clearLayers()
      refSelected.current.addData(s)
    }
  }, [refSelected, selectedState])

  useEffect(() => {
    let filteredData = {...data};
    filteredData.features = data.features.filter((item) => filterFunc(item.properties));

    if (choropleth.current) {
      choropleth.current.clearLayers()
      choropleth.current.addData(filteredData)
      choropleth.current.setStyle(TileStyle)
    }
  }, [choropleth, param.indicator, opt, filterFunc])

  const mainLayer = useMemo(() => {
    if (opt.showRaster) {
      let url = "https://tiles.arcgis.com/tiles/7vxqqNxnsIHE3EKt/arcgis/rest/services/";
      url += `${param.config.Prefix}${opt.field}/MapServer`;
      return <TiledMapLayer name='thisRaster' url={url}/>;
    } else {  
      return <GeoJSON
        data={data}
        ref={choropleth}
        style={TileStyle}
        attribution='Powered by <a href="https://www.esri.com">Esri</a>'
        />
    }
  }, [opt.showRaster, opt.field, param.indicator, data])

  const onEachState = (feature, layer) => {
    layer.on({
      mouseover: function(e){
        const prop = e.target.feature.properties;
        let content = `<div><b>${prop.state}</b></div>`;
        layer.setStyle({weight:3})
        layer.bindTooltip(content)
        layer.openTooltip()
      },
      mouseout: function(e){
        layer.setStyle({weight:0.5})
        //layer.unbindTooltip()
        layer.closeTooltip()
      },
      click: function(e){
        const val = e.target.feature.properties.state
        layer.setStyle({weight:3})
        zoomFit(e.target._bounds)
        setSelectedState(val)
        func(val)
      }
    })
  }

  const onEachDistrict = (feature, layer) => {
    function DistrictPopup(obj){
      let content = `<div><b>${obj.district}</b>`;
      const mapper = {
        'R1': 'R<sub>1</sub>',
        'R2': 'R<sub>2</sub>',
        'CH': 'Change',
      }
      content += `<br/>${obj.state}<br/>`
      Object.keys(obj.toDisplay).forEach((key, i) => {
        content += `<br/> ${mapper[key]}\u25b9 ${FloatFormat(obj.toDisplay[key], 2)}`
      })
      content += '</div>'
      return (content)
    }

    layer.on({
      mouseover: function(e){
        const prop = e.target.feature.properties;
        const content = DistrictPopup(prop);

        layer.setStyle({weight:3, fillOpacity:0.7})
        layer.bindTooltip(content)
        layer.openTooltip()
      },
      mouseout: function(e){
        layer.setStyle({weight:0.5, fillOpacity:0})
        //layer.unbindTooltip()
        layer.closeTooltip()
      },
    })
  }

  return (
    <div id='map-container' className='row p-0 m-0'>
      {theLegendPanel}

      <div className='row m-0 p-0 mb-2'>
        <MapContainer
          zoomControl={false}
          center={param.config.Center}
          zoom={param.config.Zoom}
          minZoom={3}
          maxZoom={9}
          style={{width:'100%', height:'60vh', minHeight:'400px', background:'#fff', borderRadius:'10px'}}
        >

          <DefineMap/>
          <ZoomPanel />
          {theRadioPanel}

          <Pane name='basemap' style={{zIndex:0}}>
            {<TileLayer url={basemaps['positron']}/>}
          </Pane>
          
          {opt.showLabel ? <TileLayer url={basemaps['label']} zIndex={500}/> : <></>}

          <Pane name='tiles' style={{zIndex:55}}>
            {mainLayer}
          </Pane>

          <Pane name='selected' style={{zIndex:60}}>
            <GeoJSON
              data={selectedState}
              ref={refSelected}
              style={StateStyle2}
              zIndex={400}
            />

            <GeoJSON 
              data={boundary}
              ref={refState}
              style={StateStyle}
              onEachFeature={onEachState}
            />
          </Pane>

          {opt.showLabel ? null :
          <Pane name='boundary' style={{zIndex:65}}>    
            <GeoJSON
              data={boundary}
              style={StateStyle}
              onEachFeature={onEachState}
              />

            <GeoJSON
              data={district}
              ref={refDistrict}
              style={DistrictStyle}
              onEachFeature={onEachDistrict}
            />
          </Pane>}

        </MapContainer>
      </div>

      <div className='row m-0 p-0 mb-2 bg-secondary-subtle rounded-3'>
        <div className='col-5 p-2' style={{fontSize:'75%'}}>
          {param.config.Adm1} of interest can be selected by clicking the map or using dropdown menu on the right.
        </div>
        <div className='col-7 p-2'>{SelectState}</div>
      </div>
    </div>
  )
}