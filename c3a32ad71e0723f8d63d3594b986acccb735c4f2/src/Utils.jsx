import { useState } from 'react';
import Form from 'react-bootstrap/Form';

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
    if (d < -90) {
        return null
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