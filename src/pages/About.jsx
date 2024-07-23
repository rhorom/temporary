import { Accordion } from "react-bootstrap";

const countries = ['Kenya']
const content = {
  'Kenya': AckKenya(),
}

function AckKenya(){
  return <div className='row m-0 p-0 px-3'>
    <ul>
      <li>
        Administrative Boundary of Kenya: Population Division, U.S. Census Bureau. The U.S. Census Bureau's products are open access and can be accessed from <a href='https://www.census.gov/geographies/mapping-files/time-series/demo/international-programs/subnationalpopulation.html'>here</a>.
      </li>
      <li>
        2014 Kenya DHS: Kenya National Bureau of Statistics, Ministry of Health/Kenya, National AIDS Control Council/Kenya, Kenya Medical Research Institute, National Council for Population and Development/Kenya, and ICF International. 2015. Kenya Demographic and Health Survey 2014 [DATASETS]. Rockville, MD, USA: Kenya National Bureau of Statistics, Ministry of Health/Kenya, National AIDS Control Council/Kenya, Kenya Medical Research Institute, National Council for Population and Development/Kenya, and ICF International.
      </li>
      <li>
        2022 Kenya DHS: KNBS and ICF. 2023. Kenya Demographic and Health Survey 2022: [DATASETS]. Nairobi, Kenya, and Rockville, Maryland, USA: KNBS and ICF. 
      </li>
      <li>
        World Health Organisation Regional Office for Africa (2024) Expanded Special Project for Elimination of Neglected Tropical Diseases. Data and more information can be accessed <a href='https://espen.afro.who.int/'>here</a>.
      </li>
      <li>
        Institute for Health Metrics and Evaluation (2024) Global Health Data Exchange (GHDx). Data and more information can be accessed from <a href='https://ghdx.healthdata.org/'>here</a>.
      </li>
    </ul>
  </div>
}

export default function About() {
  return (
    <div className='bg-secondary-subtle rounded-4 p-3'>
      <h2>About</h2>
      <hr/>
      <p>
      This web application presents a summary of maternal and child health characteristics alongside socio-economic and Sustainable Development Goals (SDG)-related indicators at subnational scales. Multiple indicators are presented in map, chart, and tabulated form, and for different time points and data sources.  
      </p>
      
      <h3>Methods</h3>
      <p>
        We have produced 5x5km high-resolution (also referred to as grid level) prediction and uncertainty maps illustrating changes over time for health and development indicators within specific subnational areas, such as districts or similar administrative divisions varying by country.
      </p>
      <p>
        The methodology employs a Bayesian geostatistical modeling approach using the Integrated Nested Laplace Approximation – Stochastic Partial Differential Equation method (INLA-SPDE) statistical method (Rue et al., 2009; Lindgren et al., 2011; Martins et al., 2013) to estimate the indicators.
      </p>
      <p>
        This approach relies on data from the two most recent rounds of the nationally representative Demographic and Health Surveys (DHS), which are available at the cluster level (primary sampling unit), and mapped through GPS coordinates of the cluster centroids. In the modelling process, the cluster locations serve as the primary input data; open-access, raster-based geographical, climatic, and socio-economic datasets are used as covariates.
      </p>
      <p>
        The estimates presented in this portal are the result of a standard modelling approach for estimating high resolution maps and there may be deviations from aggregated measures published elsewhere. 
      </p>
      <p>
        Please consult the <a href='#/technote-0'>Technical Notes</a> section for more information on data sources and specific indicators.
      </p>

      <h3>Disclaimer</h3>
      <p>
        Maps used on this website are for general illustration only, and are not intended to be used for reference purposes.
      </p>
      <p>
        The representation of political boundaries does not necessarily reflect the organization's view on the legal status of a country or territory.
      </p>

      <h3>Acknowledgement</h3>
      <Accordion className="mb-3" flush>
      {countries.map((country,i) => {
        return (
        <Accordion.Item key={i} eventKey={i}>
          <Accordion.Header>{country}</Accordion.Header>
          <Accordion.Body>{content[country]}</Accordion.Body>
        </Accordion.Item>
        )
      })}
      </Accordion>

      <h3>References</h3>
      <div className='row m-0 p-0 px-3'>
        <ul>
          <li>
            Rue, H., Martino, S., & Chopin, N. (2009). Approximate Bayesian inference for latent Gaussian models by using integrated nested Laplace approximations. Journal of the Royal Statistical Society Series B: Statistical Methodology, 71(2), 319-392. DOI: <a href='https://doi.org/10.1111/j.1467-9868.2008.00700.x'>10.1111/j.1467-9868.2008.00700.x</a>.
          </li>
          <li>
            Lindgren, F., Rue, H., & Lindström, J. (2011). An explicit link between Gaussian fields and Gaussian Markov random fields: the stochastic partial differential equation approach. Journal of the Royal Statistical Society Series B: Statistical Methodology, 73(4), 423-498. DOI: <a href='https://doi.org/10.1111/j.1467-9868.2011.00777.x'>10.1111/j.1467-9868.2011.00777.x</a>.
          </li>
          <li>
            Martins, T. G., Simpson, D., Lindgren, F., & Rue, H. (2013). Bayesian computing with INLA: new features. Computational Statistics & Data Analysis, 67, 68-83. DOI: <a href='https://doi.org/10.1016/j.csda.2013.04.014'>10.1016/j.csda.2013.04.014</a>.
          </li>
        </ul>
      </div>

    </div>
  );
}
