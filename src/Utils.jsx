import { useState, useMemo } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Modal } from "react-bootstrap";
import { FaPrint, FaFileDownload, FaExpand } from "react-icons/fa";

import colormaps from './colormaps.json';

export async function getFromUrl(url) {
    try {
      let response = await fetch(url);
      let responseJson = await response.json();
      return responseJson;
     } catch(error) {
      console.error(error);
    }
}

export function ArgMax(array) {
    return [].map.call(array, (x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

export function ArgMin(array) {
    return [].map.call(array, (x, i) => [x, i]).reduce((r, a) => (a[0] < r[0] ? a : r))[1];
}

export function DecimalFormat({ value, precision=1 }){
    if (value) {
        return parseFloat(value).toFixed(precision)
    } else {
        return '-'
    }
}

export function FloatFormat(value, precision=3){
    if (value) {
        return parseFloat(value).toFixed(precision)
    } else {
        return '-'
    }
}

export function GetColor(d, minmax, cmapID){
    if ((d === null) || (d < -90)) {
        return '#D3D3D3'
    } else {
        d = (d - minmax[0])/(minmax[1] - minmax[0])
        const palette = colormaps[cmapID]
        const val = Math.min(Math.max(0, parseInt(19*d)), 19)
        const idx = String(val)
        let res = palette[idx]
        return res
    }
}

export function hexToRGB(hex) {
    hex = hex.substring(1);
    let [r, g, b] = hex.split('');

    r = parseInt(r, 16);
    g = parseInt(g, 16);
    b = parseInt(b, 16);

    return [r, g, b];
}

export function GetXFromRGB(rgb, palette, minmax) {
    const len = palette.length;

    let minIndex = 0;
    let minDistance = Infinity;
    for (let i = 0; i < len; i++) {
        //const rgbPalette = hexToRGB(palette[i])
        const rgbPalette = palette[i]
        const distance = Math.sqrt(Math.pow(rgb[0] - rgbPalette[0], 2) +
        Math.pow(rgb[1] - rgbPalette[1], 2) +
        Math.pow(rgb[2] - rgbPalette[2], 2));
        if (distance < minDistance) {
        minIndex = i;
        minDistance = distance;
        }
    }

    let x = minIndex / len;
    let scaledX = x*(minmax[1]-minmax[0]) + minmax[0];
    return scaledX;
}

export function getInfo(title, path){
    let modal = document.getElementById("modal");
    let modalTitle = document.getElementById("modalTitle");
    let modalBody = document.getElementById("modalBody");
  
    modal.style.display = "block";
    modalTitle.innerHTML = `<h4>${title}</h4>`;
    
    fetch(path).then(resp => resp.text()).then(text => {
      let content = text;
      console.log(text)
      modalBody.innerHTML = content;
    });
}

export function LookupTable(props){
    const second = props.second === undefined ? props.first : props.second
    const filtered = props.items.filter((item) => item[props.first].replaceAll(' ','') === props.value.replaceAll(' ',''))
    if (typeof(second) === 'string'){
      return filtered[0] === undefined ? '' : filtered[0][second]
    } else {
      return (
        second.map((item) => (
          filtered[0] === undefined ? '' : filtered[0][item]
        ))
      )
    }
}

export function GroupSelect(props){
    const [itm, setItm] = useState(props.items);
    const fixed = props.fixed ? props.fixed : ['none'];
    const lead = props.lead ? props.lead : props.keys;
    const end = props.end ? props.end : props.keys[-1];
    
    function handleChange(event){
        const value = event.target.value;
        const key = event.target.id.slice(6);
        let filtered = {};
  
        if (end.includes(key)) {
            props.pass(value);
            if (value !== 'default') {
              filtered = props.items.filter((item) => {
                return item[key].replaceAll(' ','').toLowerCase() === value
              })
            }

            lead.forEach((itm) => {
                document.getElementById('select'+itm).value = filtered[0][itm].replaceAll(' ','').toLowerCase()
            })
        }
  
        if (lead.includes(key)) {
            if (value === 'default') {
              setItm(props.items)
            } else {
              filtered = props.items.filter((item) => {
                return item[key].replaceAll(' ','').toLowerCase() === value
              })
              setItm(filtered)    
            }
        } else {
            document.getElementById('select'+key).defaultValue = 'default'
        }
    }
  
    return (
        <div>
            {props.keys.map((key) => {
                let items = (fixed.includes(key)) ? [...new Set(props.items.map((item) => item[key]))] : [...new Set(itm.map((item) => item[key]))];
                items = items.sort();
                const defaultOpt = ((key === end) && (props.defaultOpt)) ? props.defaultOpt : 'default';
                const disabled_ = false //(key === end) ? true : false;
                const formSelect = (
                    <Form.Select id={'select'+key} key={'select'+key} onChange={handleChange} defaultValue={defaultOpt}>
                        <option key={'default'+key} value={'default'} disabled={disabled_}>&#8212; {key} &#8212;</option>
                        {items.map((item) => {
                            const value = item.replaceAll(' ','').toLowerCase()
                            return (
                                <option key={'opt'+value} value={value}>{item}</option>
                            )
                        })}
                    </Form.Select>
                )

                return (
                  <div className='col' key={'div'+key}> {formSelect} </div>
                )
            })}
        </div>
    )
}

export function SimpleSelect({ name, items, defaultOpt, value, pass, noDefault, extras }){
    if (value === undefined) {value = defaultOpt};

    function handleChange(e){
        pass(e.target.value)
        if (extras) {extras()}
    }
  
    return (
        <div>
            <Form.Select id={'select'+name} key={'select'+name} value={value} onChange={handleChange}>
                {noDefault ? '' : <option value={''}></option>}
                {items.map((item, i) => {
                    const value = item.replaceAll(' ','')
                    return (
                        <option key={i} value={value}>{item}</option>
                    )
                })}
            </Form.Select>
        </div>
    )
}

export function BasicSelect({ name, items, defaultOpt, value, pass, noDefault, extras, style={} }){
    if (value === undefined) {value = defaultOpt};

    function handleChange(e){
        if (pass) {pass(e.target.value)}
        if (extras) {extras()}
    }
  
    return (
        <div>
            <select id={'select'+name} key={'select'+name} value={value} onChange={handleChange} style={style}>
                {noDefault ? '' : <option key={'default'+defaultOpt} value={''} defaultChecked>Select {name}</option>}
                {items.map((item) => {
                    const value = item.replaceAll(' ','')
                    return (
                        <option key={'opt'+value} value={value}>{item}</option>
                    )
                })}
            </select>
        </div>
    )
}

function Print({ elemID }){
    function printElement(id) {
        window.print();
    }

    return (
      <div className="text-center m-0 p-0 mb-2">
        <span className='m-0 fs-4 text-danger' title='Print'><FaPrint/></span>
    </div>
    )
}

function DownloadMap({ param }){
    const [show,setShow] = useState(false)
    const [dtype,setType] = useState('Vector')
    const [round,setRound] = useState('R2')
    function handleShow(){setShow(true)}
    function handleHide(){setShow(false)}
    const info = {
        'Country': param.config.Name,
        'Indicator': param.config.indicators[param.indicator].Indicator
    }
    const noR1 = param.config.NoR1.includes(param.indicator)
    const noR2 = param.config.NoR2.includes(param.indicator)
    const noRaster = param.config.DistrictOnly.includes(param.indicator)
    
    const downloadButton = useMemo(() => {
        //const url = `https://data.worldpop.org/repo/prj/CIFF/${param.country}/${param.indicator}/${round}/${dtype}`
        const url = 'https://sdi.worldpop.org'
        return <Button title='click to download' role='link' href={url} target='_blank'>Download</Button>
    }, [round, dtype])

    return (
        <div className="text-center m-0 p-0 mb-2">
        <span className='m-0 fs-4 text-danger' title='Download Data' onClick={handleShow}><FaFileDownload/></span>

        <Modal show={show} onHide={handleHide} size='lg'>
            <Modal.Header closeButton><h4>Download Data</h4></Modal.Header>
            <Modal.Body>
            <p>You are going to download the following dataset:</p>
            <Form>
                {Object.keys(info).map((item,i) => {
                    return <Form.Group key={i} as={Row} className='mb-1'>
                        <Form.Label column sm={2}>{item}</Form.Label>
                        <Col sm={10}><Form.Control type='text' disabled placeholder={info[item]} id='country'/></Col>
                    </Form.Group>
                })}
                <Form.Group as={Row} className='mb-1'>
                    <Form.Label column sm={2}>Round</Form.Label>
                    <Col sm={10}>
                        <Form.Select defaultValue={round} id='round' onChange={(e) => setRound(e.target.value)}>
                            <option value='R1' disabled={noR1}>Round 1</option>
                            <option value='R2' disabled={noR2}>Round 2</option>
                            <option value='CH' disabled={noR1 || noR2}>Change</option>
                        </Form.Select>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className='mb-1'>
                    <Form.Label column sm={2}>Data Type</Form.Label>
                    <Col sm={10}>
                        <Form.Select defaultValue={dtype} id='type' onChange={(e) => setType(e.target.value)}>
                            <option value='Vector'>Vector (unit level)</option>
                            <option value='Raster'disabled={noRaster}>Raster (grid level)</option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Form>
            <br/>
            <div>
                <p>DOI: </p>
                <p>Release note: <a href='#'>Version 1.1</a></p>
            </div>
            </Modal.Body>
            <Modal.Footer>
                {downloadButton}
            </Modal.Footer>
        </Modal>
    </div>
    )
}

function DownloadTable({ param }){
    const [show,setShow] = useState(false)
    const [dtype,setType] = useState('CSV')
    function handleShow(){setShow(true)}
    function handleHide(){setShow(false)}

    const info = {
        'Country': param.config.Name,
        'Indicator': param.config.indicators[param.indicator].Indicator
    }
    
    const downloadButton = useMemo(() => {
        const url = `https://data.worldpop.org/repo/prj/CIFF/${param.config.TLC}/${dtype.toUpperCase()}/data_${param.indicator}.${dtype}`
        //const url = 'https://sdi.worldpop.org'
        return <Button title='click to download' role='link' href={url}>Download</Button>
    }, [dtype])

    return (
        <div className="text-center m-0 p-0 mb-2">
        <span className='m-0 fs-4 text-danger' title='Download Data' onClick={handleShow}><FaFileDownload/></span>

        <Modal show={show} onHide={handleHide} size='lg'>
            <Modal.Header closeButton><h4>Download Data</h4></Modal.Header>
            <Modal.Body>
            <p>You are going to download the following dataset:</p>
            <Form>
                {Object.keys(info).map((item,i) => {
                    return <Form.Group key={i} as={Row} className='mb-1'>
                        <Form.Label column sm={2}>{item}</Form.Label>
                        <Col sm={10}><Form.Control type='text' disabled placeholder={info[item]} id='country'/></Col>
                    </Form.Group>
                })}
                <Form.Group as={Row} className='mb-1'>
                    <Form.Label column sm={2}>Data Type</Form.Label>
                    <Col sm={10}>
                        <Form.Select defaultValue={dtype} id='type' onChange={(e) => setType(e.target.value)}>
                            <option value='CSV'>CSV (no geometry)</option>
                            <option value='json'>GeoJSON (geometry included)</option>
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Form>
            <br/>
            <div>
                <p>DOI: </p>
                <p>Release note: <a href='#'>Version 1.1</a></p>
            </div>
            </Modal.Body>
            <Modal.Footer>
                {downloadButton}
            </Modal.Footer>
        </Modal>
    </div>
    )
}

function FullMap({ element, title }){
    const [show,setShow] = useState(false)
    function handleShow(){setShow(true)}
    function handleHide(){setShow(false)}

    return (
        <div className="text-center m-0 p-0 mb-2">
        <span className='m-0 fs-4 text-danger' title='Fullscreen' onClick={handleShow}><FaExpand/></span>

        <Modal show={show} onHide={handleHide} fullscreen={true}>
            <Modal.Header closeButton>{title}</Modal.Header>
            <Modal.Body>
            {element}
            </Modal.Body>
        </Modal>
    </div>
    )
}

export function ToolBar(){
    return <></>
}

export function ToolBare({element, elemID, param, title}){
    return (
        <div className='row m-0 p-0'>
        <div className='col-sm'>
            <div className='row float-end'>
            <div className='m-0 p-0 px-1 col'>
                {<></>}
                {/*<Print/>*/}
            </div>
            <div className='m-0 p-0 px-1 col'>
                {param[0] === 'map' ? <DownloadMap param={param[1]}/> : <DownloadTable param={param[1]}/>}
                {<></>}
            </div>
            <div className='m-0 p-0 px-1 col'>
                <FullMap element={element} title={title}/>
            </div>
            </div>
        </div>
        </div>
    )
}