import ReactPlayer from 'react-player'
import 'primeicons/primeicons.css'
import guide1 from '../assets/guide-1.png'
import guide2 from '../assets/guide-2.png'
import guide3 from '../assets/guide-3.png'

export default function Guide() {
  return (
    <div className='bg-secondary-subtle rounded-4 p-3'>
      <h2>Guide</h2>
      <hr/>

      <div className='row'>
        {/*
          <div className="d-flex justify-content-center mb-4 p-3">
            <ReactPlayer 
              url='https://www.youtube.com/watch?v=kSd3E6FfEeo'
            />
          </div>
          <hr/>
        */}
        <div className='row'>
        <div className='col-lg-5 pb-3'>
          <div className='row'>
          <div className='pb-3'>
          <h4>Basic Usage</h4>
          <ol>
            <li>Select a country and indicator to display. A subnational map of the indicator will be displayed on the left.</li>
            <li>By default, indicator value from the Round 2 survey is displayed on the map.</li>
            <ul>
              <li>Click <kbd>Round 1</kbd> to see the value from the Round 1 survey.</li>
              <li>Click <kbd>Change</kbd> to see the difference between the values from two rounds.</li>
              <li>Click <kbd>Grid Level</kbd> to load the grid level data (5x5 km).</li>
            </ul>

            <li>Click <i className="pi pi-plus-circle"></i> or <i className="pi pi-minus-circle"></i> to zoom-in or zoom-out the map. Click <i className='pi pi-home'></i> to reset the map view.</li>

            <li>Select an administrative unit by clicking any region on the map or use the dropdown menu available below the map.</li>
            <li>Chart and tabulated data for the selected unit is displayed on the right. The data can be sorted according to the sub-unit name or the indicator values.</li>
            <li>By clicking <i className='pi pi-arrow-circle-right'></i>, the aggregated values of all indicators from the selected unit can be displayed.</li>
            <li>Throughout the site, additional information can be accessed by hovering over or clicking on the <i className='pi pi-question-circle'></i> icon where available.</li>
            <li>For a selected number of indicators, additional technical notes were created. These notes can be accessed here and through the menu bar on the top of this site.</li>
            
          </ol>
          </div>

          <div>
          <h4>Filtering by change</h4>
          <ol start={9}>
            <li>If the underlying dataset is statistically sufficient to estimate the significance in change between rounds, "Filtering by change" can be performed. Use the dropdown to display subnational units with significant improvement or worsening through time for the selected indicator. This allows the user to choose the probability that there is meaningful improvement/worsening. The map filters out units where it is unlikely that there have been meaningful improvements.</li>
            <li>Additional information can be found by clicking on the <i className='pi pi-question-circle'></i> icon on top of the change significance slider. <a href='#/technote-0'>Technical Note 2</a> provides details on "Exceedance Probability and Confidence in Changes Over Time", which is the basis of the filtering.</li>
          </ol>
          </div>
          </div>
        </div>

        <div className='col-lg-7 text-center'>
          <img alt='guide' src={guide1} width='100%'/>
          <img alt='guide' src={guide2} width='100%'/>
          <img alt='guide' src={guide3} width='100%'/>
        </div>
        </div>
      </div>
    </div>
  );
}
  