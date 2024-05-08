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
const zoomFit = (bounds) => {main_map.fitBounds(bounds)}

export function Map({ param, data, func }){
  let cfg = mainConfig[param.country]

  const [boundary, setBoundary] = useState()
  const [selectedState, setSelectedState] = useState()
  
  const [opt, setOpt] = useState({
    round: 'R2',
    field: param.indicator + '_R2',
    showRaster: false,
    showLabel: false,
    showImprove: false,
    probLimit: 0
  })

  const refDistrict = useRef()
  const refState = useRef()
  const refSelected = useRef()
  const choropleth = useRef()
  
  const DefineMap = () => {
    main_map = useMap();
    return null
  }

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

  const TileStyle = useCallback((feature) => {
    const palette = (opt.round === 'CH') ? 'Palette2' : 'Palette1';
    const color = GetColor(feature.properties[opt.field], 
      [param.config.indicators[param.indicator].Min, param.config.indicators[param.indicator].Max], 
      param.config.indicators[param.indicator][palette]
    );
    return {
        zIndex: 2,
        weight: 0.5,
        opacity: 1,
        color: color,
        fillOpacity: 1,
        fillColor: color
    }
  }, [param, opt])

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
    const url = `./public/data/${param.country}/${param.config.TLC}_adm1.json`
    fetch(url)
      .then(resp => resp.json())
      .then(json => setBoundary(json))
  }, [param])

  useEffect(() => {
    if (refState.current) {
      refState.current.clearLayers()
      refState.current.addData(boundary)
    }
    if (refDistrict.current) {
      refDistrict.current.clearLayers()
      refDistrict.current.addData(district)
    }
  }, [refState, boundary, district])

  useEffect(() => {
    if (refSelected.current) {
      const s = boundary.features.filter((item) => (item.properties.state === selectedState));
      refSelected.current.clearLayers()
      refSelected.current.addData(s)
    }
  }, [refSelected, selectedState])

  useEffect(() => {
    const filterData = (feature) => {
      //const val = feature.properties[`${param.indicator}_CH`];
      //const pval = feature.properties[`${param.indicator}_CH_P`];
      let res = true
      return res
    }

    let filteredData = data ? data.features.filter(filterData) : [];
    
    if (choropleth.current) {
      choropleth.current.clearLayers()
      choropleth.current.addData(filteredData)
      choropleth.current.setStyle(TileStyle)
    }
  }, [param, data, TileStyle])

  const mainLayer = useMemo(() => {  
    if (opt.showRaster) {
      let url = "https://tiles.arcgis.com/tiles/7vxqqNxnsIHE3EKt/arcgis/rest/services/";
      url += `${opt.field}/MapServer`;
      //return <TiledMapLayer name='thisRaster' url={url}/>;
      return <></>
    } else {  
      return <GeoJSON
        data={data}
        ref={choropleth}
        style={TileStyle}
        attribution='Powered by <a href="https://www.esri.com">Esri</a>'
        />
    }
  }, [opt, param, data, TileStyle])

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
    layer.on({
      mouseover: function(e){
        const prop = e.target.feature.properties;
        const content = DistrictPopup(prop, param.indicator);

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

  function DistrictPopup(obj, col){
    let content = `<div><b>${obj.district}</b>`;
    const mapper = {
      'R1': 'R<sub>1</sub>',
      'R2': 'R<sub>2</sub>',
      'CH': 'Change',
    }
    content += `<br/>${obj.state}<br/>`
    Object.keys(obj.toDisplay).forEach((key, i) => {
      content += `<br/> ${mapper[key]}\u25b9 ${FloatFormat(obj.toDisplay[key], 1)}`
    })
    content += '</div>'
    return (content)
  }

  return (
    <div className='row'>
      <div className='row' style={{minHeight:'120px'}}>
        <div className='title'>Map of {cfg.Name}</div>
        <div className='frame' style={{fontSize:'100%'}}>
          <div>
            <p>The map below displays surfaces of subnational areas (either at {cfg.Adm1.toLowerCase()} and {cfg.Adm2.toLowerCase()} level or high-resolution 5x5km - pixel level data) of a particular indicator in {cfg.Name}.</p>
            <p>Data from Round 1 ({cfg.indicators[param.indicator].R1}, {cfg.indicators[param.indicator].Y1}), 
              Round 2 ({cfg.indicators[param.indicator].R2}, {cfg.indicators[param.indicator].Y2}), 
              or the change between rounds (Round 2 - Round 1) for {cfg.Name} can be selected and displayed.</p>
            <p>To get deeper information on a specific {cfg.Adm1.toLowerCase()} or {cfg.Adm2.toLowerCase()} in {cfg.Name}, 
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
          {
          <Pane name='basemap' style={{zIndex:0}}>
            {<TileLayer url={basemaps['positron']}/>}
          </Pane>
          }

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
  
    </div>
  )
}