import { React, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { MapContainer, GeoJSON, Circle, Pane, TileLayer, useMap } from 'react-leaflet';
import { TiledMapLayer } from 'react-esri-leaflet';

import { FloatFormat, GetColor } from './Utils';
import { mainConfig, indicatorDef, StateStyle, StateStyle2, DistrictStyle, pIndicator, nIndicator } from './config';
import { ZoomPanel, RadioPanel, LegendPanel } from './MapUtils'
import { Ask } from './pages/Info';

const basemaps = {
  'esri':'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  'label':'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
  'positron': 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
};

var main_map;
const zoomFit = (bounds) => {main_map.fitBounds(bounds)}

export function Map({ param, data, boundary, func }){
  const cfg = mainConfig[param.country]
  const [selectedState, setSelectedState] = useState()
  const defRound = cfg.NoR2.includes(param.indicator) ? 'R1' : 'R2'
  const [opt, setOpt] = useState({
    round: defRound,
    field: param.indicator + '_' + defRound,
    showRaster: false,
    showLabel: false
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
      <RadioPanel p={opt} setP={setOpt} param={param}/>
    )
  }, [param])

  const theLegendPanel = useMemo(() => {
    let c = cfg.indicators[param.indicator]
    c['Definition'] = indicatorDef[param.indicator].Definition
    c['Unit'] = indicatorDef[param.indicator].Unit
    c['Proportional'] = indicatorDef[param.indicator].Proportional
    return <LegendPanel param={c} opt={opt.round}/>
  }, [param, opt])

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

  const TileStyleX = useCallback((feature) => {
    let palette = cfg.indicators[param.indicator]['Palette1']
    let minmax = [cfg.indicators[param.indicator].Min, cfg.indicators[param.indicator].Max]
    if (opt.round === 'CH') {
      palette = cfg.indicators[param.indicator]['Palette2']
      minmax = [cfg.indicators[param.indicator].CHMin, cfg.indicators[param.indicator].CHMax]
    }
    const color = GetColor(feature.properties[opt.field], 
      minmax, palette
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
    if (refState.current) {
      refState.current.clearLayers()
      refState.current.addData(boundary)
    }
  }, [refState, boundary])

  useEffect(() => {
    if (refDistrict.current) {
      refDistrict.current.clearLayers()
      refDistrict.current.addData(district)
    }
  }, [refDistrict, district])

  useEffect(() => {
    if (refSelected.current) {
      const s = boundary.features.filter((item) => (item.properties.state === selectedState));
      refSelected.current.clearLayers()
      refSelected.current.addData(s)
    }
  }, [refSelected, selectedState])

  useEffect(() => {
    const TileStyle = (feature) => {
      let palette = cfg.indicators[param.indicator]['Palette1']
      let minmax = [cfg.indicators[param.indicator].Min, cfg.indicators[param.indicator].Max]
      if (opt.round === 'CH') {
        palette = cfg.indicators[param.indicator]['Palette2']
        minmax = [cfg.indicators[param.indicator].CHMin, cfg.indicators[param.indicator].CHMax]
      }
      const color = GetColor(feature.properties[opt.field], 
        minmax, palette
      );
      return {
          zIndex: 2,
          weight: 0.5,
          opacity: 1,
          color: color,
          fillOpacity: 1,
          fillColor: color
      }
    }

    let filteredData = {...data};
    //filteredData.features = data.features.filter((item) => filterFunc(item.properties));

    if (choropleth.current) {
      choropleth.current.clearLayers()
      choropleth.current.addData(filteredData)
      choropleth.current.setStyle(TileStyle)
    }
  }, [param, opt, data])

  const mainLayer = useMemo(() => {  
    if (opt.showRaster) {
      let url = "https://tiles.arcgis.com/tiles/7vxqqNxnsIHE3EKt/arcgis/rest/services/";
      url += `${opt.field}/MapServer`;
      return <TiledMapLayer name='thisRaster' url={url}/>;
    } else {  
      return <GeoJSON
        data={data}
        ref={choropleth}
        style={TileStyleX}
        attribution='Powered by <a href="https://www.esri.com">Esri</a>'
        />
    }
  }, [opt, param, data])

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

  function DistrictPopup(obj){
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
    <div className='row p-0 m-0'>
      {theLegendPanel}
      <div id='map-container' className='row m-0 p-0 mb-2'>
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
    </div>
  )
}