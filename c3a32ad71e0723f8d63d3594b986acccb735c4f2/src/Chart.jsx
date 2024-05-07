import { useState, useMemo } from 'react';
import { BsBarChartFill} from 'react-icons/bs';
import { useTable, useSortBy } from 'react-table';
import { Vega } from 'react-vega';
import Table from 'react-bootstrap/Table';
import { Tab, Tabs, Modal } from 'react-bootstrap';
import { SimpleSelect, DecimalFormat, FloatFormat, GetColor, ArgMax, ArgMin } from './Utils';
import { Ask } from './pages/Info';
import { pIndicator, nIndicator } from './config';

import specs from './data/chart_spec.json';

function Average(array) {
  return array.reduce((a, b) => a + b) / array.length;
}

function AllIndicators({ input, proportional }){
  let spec = JSON.parse(JSON.stringify(specs['StateAggregate']));
  spec.data[0].values = input;

  if (proportional) {
    spec.title.text = "An increase in the indicator below means improvement";
    spec.data[1].transform[0].expr = "(datum.Proportional === true)";
  } else {
    spec.title.text = "A decrease in the indicator below means improvement";
    spec.data[1].transform[0].expr = "(datum.Proportional === false)";
  }

  spec.signals[0].value = 150;
  return <Vega spec={spec} actions={false} />
}

function transformIndicators(obj){
  const mapper = {'R1':'Round 1', 'R2':'Round 2'}
  let new_obj = []
  pIndicator.forEach((key) => {
    ['R1','R2'].forEach((round) => {
      new_obj.push({
        'State': obj['state'],
        'District': obj['district'],
        'Mean': obj[key+'_'+round],
        'Round': mapper[round],
        'Indicator': '',
        'Abbreviation': key,
        'Proportional': true,
      })})
    }
  )

  nIndicator.forEach((key) => {
    ['R1','R2'].forEach((round) => {
      new_obj.push({
        'State': obj['state'],
        'District': obj['district'],
        'Mean': obj[key+'_'+round],
        'Round': mapper[round],
        'Indicator': '',
        'Abbreviation': key,
        'Proportional': false,
      })})
    }
  )
  return new_obj
}

function ShowIndicators({ obj }){
  const [show,setShow] = useState(false)
  function handleShow(){setShow(true)}
  function handleHide(){setShow(false)}
  
  const new_obj = transformIndicators(obj.original)

  return (
      <div className="text-center m-0 p-0 mb-2">
          <i className='mx-1 pi pi-arrow-circle-right' title='Show all indicator comparison' onClick={handleShow}></i>

          <Modal show={show} onHide={handleHide} size='lg'>
              <Modal.Header closeButton><h4>All Indicator Comparison</h4></Modal.Header>
              <Modal.Body>
                <div>
                  <div className='p-0 m-0 mb-2'>
                    The charts below summarise the average values of all indicators in <b>{obj.original.district}, {obj.original.state}</b>.
                  </div>
                  <hr/>
                  <div>
                    <div className='float-start m-0 p-0'>
                      <AllIndicators input={new_obj} proportional={true}/>
                    </div>
                    <div className='float-end m-0 p-0'>
                    <AllIndicators input={new_obj} proportional={false}/>
                    </div>
                  </div>
                </div>
              </Modal.Body>
          </Modal>
      </div>
  )
}

function MakeTable({ columns, data, palette }) {
  const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
  } = useTable({
      columns,
      data,
  }, useSortBy
  )

  return (
    <div style={{fontSize:'small'}}>
      <Table bordered hover size='sm'>
          <thead>
              {headerGroups.map((headerGroup, i) => (
                  <tr key={i}>
                    <td></td>
                      {headerGroup.headers.map((column, j) => (
                      <th key={j} {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>
                      {column.isSorted ? column.isSortedDesc ? ' \u2bc5' : ' \u2bc6' : ' \u2b24'}
                      </span>
                      </th>
                  ))}
                  </tr>
              ))}
          </thead>
          <tbody>
              {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                      <tr key={i}>
                        <td><ShowIndicators obj={row}/></td>
                          {row.cells.map((cell, j) => {
                            let cstyle = {}
                            if (palette[cell.column.Header]) {
                              const color = GetColor(cell.value, palette[cell.column.Header]['Minmax'], palette[cell.column.Header]['Palette'])
                              cstyle['backgroundColor'] = color;
                              cstyle['fontWeight'] = 'bold';
                              cstyle['textAlign'] = 'center';
                            }
                            return (
                                <td key={j} style={cstyle}>{cell.render('Cell')}</td>
                                )
                          })}
                      </tr>
                  )}
              )}
          </tbody>
      </Table>
    </div>
  )
}

export function Chart({ param, data}){
  const [sortChart, setSortChart] = useState('SortbyName');
  const [sorttype, setSorttype] = useState('ascending');

  const stateName = 'stateName'// data[0].state;
  const nodata = data.length === 0 ? <kbd>No data displayed. Modify the filter.</kbd> : ''

  const adm1 = String(param.Adm1).toLowerCase()
  const adm2 = String(param.Adm2).toLowerCase()
  const adm2s = adm2.slice(-1) === 'y' ? adm2.slice(0,-1) + 'ies' : adm2 + 's'

  const columns = [
    {Header:`${param.Adm2} Name`, accessor:'district'},
    {Header:`R1`, accessor: `${param.indicator}_R1`, Cell:DecimalFormat, sortType:'basic'},
    {Header:`CI_R1`, accessor: `${param.indicator}_R1CI`, disableSortBy: true},
    {Header:'R2', accessor:`${param.indicator}_R2`, Cell:DecimalFormat, sortType:'basic'},
    {Header:`CI_R2`, accessor: `${param.indicator}_R2CI`, disableSortBy: true},
    {Header:'CH', accessor:`${param.indicator}_CH`, Cell:DecimalFormat, sortType:'basic'},
    {Header:`CI_CH`, accessor: `${param.indicator}_CHCI`, disableSortBy: true}
  ]
  
  const districtchart = useMemo(() => {
    return (
    <></>
  )}, [data, param, sortChart, sorttype])
  
 
  const sortButton = (
    <div className=' p-2'>
      <button className='map-btn' title={'reverse sort'} onClick={() => {setSorttype(sorttype === 'ascending' ? 'descending' : 'ascending')}}>
        {(sorttype === 'ascending') ? ' \u2bc6' : ' \u2bc5'}
      </button>
    </div>
  )

  //const round2 = (description['R2'] !== 'No data') ? ` In round 2, (${description['R2']}, ${description['Y2']}) the figure was ${hilite[1]['avg']}${description['Unit']}.` : ''

  const hilite = []

  const summaryTab = (
    <div style={{fontSize:'90%'}}>
      <div className='row p-2'>
      </div>
    </div>
  )

  const chartTab = (
    <div id="charte">
      <p style={{fontSize:'90%'}}>
      The chart below summarises the indicator values aggregated at {adm2} level. Credible intervals <b>(CIs)</b> with 95% significance for round 1 <b>(R1)</b> and round 2 <b>(R2)</b> are represented as washout rectangles around the mean values.
      </p>
      <p style={{fontSize:'80%'}}>
      The data can be sorted by name, round 1 <b>(R1)</b> values, round 2 <b>(R2)</b> values and change <b>(CH)</b> values by clicking on each heading.
      </p>
      <hr/>
      <div className='row'>
      <div className='d-flex justify-content-between'>
        <div className='col-6 pt-2'><h6>{param.indicator}</h6></div>
        <div className='col-4' style={{width:'180px'}}>
          <SimpleSelect 
            items={['Sort by Name', 'Sort by R1', 'Sort by R2', 'Sort by Change']} 
            defaultOpt={'SortbyName'}
            noDefault={true}
            name={'sortChart'}
            value={sortChart}
            pass={setSortChart}
          />
        </div>
        {sortButton}
      </div>
      <div style={{maxHeight:'440px', overflowY:'auto'}}>
        {districtchart}
      </div>
      <div style={{fontSize:'90%'}}>
        {nodata}
      </div>
      </div>
    </div>
  )

  const tableTab = (
    <div>
      <p style={{fontSize:'90%'}}>
      The table below summarises the indicator values aggregated at {adm2} level. Credible intervals <b>(CIs)</b> with 95% significance for round 1 <b>(R1)</b> and round 2 <b>(R2)</b> can be found in brackets.
      </p>
      <p style={{fontSize:'80%'}}>
      The data can be sorted by name, round 1 <b>(R1)</b> values, round 2 <b>(R2)</b> values and change <b>(CH)</b> values by clicking on each heading.
      </p>
      <hr/>
      <div className='row'>
      <div className='float-start pt-2'><h6>{param.indicator}</h6></div>
      <div style={{maxHeight:'490px', overflowY:'auto'}}>
        {/*<MakeTable columns={columns} data={data} palette={palette}/>*/}
      </div>
      <div style={{fontSize:'90%'}}>
        {nodata}
      </div>
      </div>
    </div>
  )

  return (
    <div className='row m-0 p-0'>
      <div className='title'>Detailed Data</div>
      <div className='pt-1 pb-2 frame' style={{fontSize:'100%'}}>
        <h5>{stateName} ({data.length} {adm2s})</h5>
        <div>
          <p>{param.Adm2} and {adm1} level summary estimates are presented for the selected indicators and for each survey round and for the change between the two rounds.</p>
        </div>
      </div>
    
      <Tabs
        defaultActiveKey="summary"
        id="data-tabs"
        className="mt-3"
      >
        <Tab eventKey="summary" title="Summary">
          {summaryTab}
        </Tab>
        <Tab eventKey="table" title="Table">
          {tableTab}
        </Tab>
        <Tab eventKey="chart" title="Chart">
          {chartTab}
        </Tab>
      </Tabs>

    </div>
  )
}