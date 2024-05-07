export default function About() {
  return (
    <div className='bg-light rounded-4 p-3'>
      <h2>About</h2>
      <hr/>
      <p>
        This web application presents a summary of family health conditions at subnational scales. Multiple indicators are presented in map, chart, and tabulated form.
      </p>
      
      <h3>Methods</h3>
      <p>
        The estimates presented in this portal are the result of a standard modelling approach for estimating high resolution maps and there may be deviations from aggregated measures published elsewhere.
      </p>
      <p>
        For more information, please refer to the related previously published work here: <a href='https://doi.org/10.1038/s41597-023-01961-2' target='_blank'>Pezzulo et al. (2023)</a>.
      </p>

      <h3>Disclaimer</h3>
      <p>
        Maps used on this website are for general illustration only, and are not intended to be used for reference purposes.
      </p>
      <p>
        The representation of political boundaries does not necessarily reflect the organization's view on the legal status of a country or territory.
      </p>
      <p>
        In certain areas of Northern India, including Leh in Ladakh and areas of Jammu and Kashmir State, there was a lack of survey data and ancillary covariates for modelling. Predictions were generated for specific portions of the districts in the North, as seen in the gridded maps.  Aggregates at the state and district level are based only on the portions of the areas for which ancillary covariates were available. The entire area is assigned the same value as the portions where predictions were made.
      </p>

      <h3>Acknowledgement</h3>
      <ul>
        <li>
          Administrative Boundary of India: Ministry of Science and Technology, Government of India. Survey of India. Online Maps Portal. Administrative Boundary Database (<a href='https://onlinemaps.surveyofindia.gov.in/Digital_Product_Show.aspx'>OVSF/1M/7</a>). Accessed 09 January 2023.
        </li>
        <li>
          NFHS-4 data: International Institute for Population Sciences (IIPS) and ICF. 2017. National Family Health Survey (NFHS-4), 2015-16: India. Mumbai: IIPS.
        </li>
        <li>
          NFHS-5 data: International Institute for Population Sciences (IIPS) and ICF. 2021. National Family Health Survey (NFHS-5), India, 2019-21: India. Mumbai: IIPS.
        </li>
      </ul>
    </div>
  );
}
