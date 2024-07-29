import { Accordion, Row, Col, Table, 
    Card, Image, Tab, Tabs } from 'react-bootstrap'
import exceedance from './../assets/exceedance-2.png'
import aggregation from './../assets/aggregation.png'
import disaggregation from './../assets/disaggregation.png'
import type1 from './../assets/type-1.png'
import type2 from './../assets/type-2.png'
import workflow from './../assets/workflow.png'

export function Technical({which}) {
    const content = {
        'zero': ZeroNote(),
        'boundary': FirstNote(),
        'change': SecondNote(),
        'ihme': ThirdNote(),
        'espen': FourthNote(),
    }

    return content[which]
}

function Figure ({src, label, number, caption, width='80%'}){
    return (
        <div id={label} className='m-2 text-center'>
            <div className='text-center'>
                <Image alt={label} src={src}/>
            </div>
            <figcaption className="text-center">
                <b>Figure {number}.</b> {caption}
            </figcaption>
        </div>
    )
}

function DetailCard({obj}) {
    return (
        <div>
            <Card border='primary'>
                <Card.Body>
                    <Card.Title>{obj.title}</Card.Title>
                    <Card.Subtitle>{obj.subtitle ? obj.subtitle : ''}</Card.Subtitle>
                    {obj.items ? 
                    <Card.Text>
                        <div>
                            <ul>
                            {obj.items.map((item, i) => {
                                return (<li key={i}>{item}</li>)
                            })}
                            </ul>
                        </div>
                    </Card.Text>
                    : ''
                    }
                </Card.Body>
            </Card>
        </div>
    )
}

function ContentChanges() {
    return (
        <Row xs={1} md={3} className='g-2'>
            {ListOfChanges.map((obj,i) => {return(
                <Col key={i}>
                    <DetailCard key={i} obj={obj}/>
                </Col>
            )})}
        </Row>
    )
}

function ZeroNote() {
    return (
        <div className='bg-secondary-subtle rounded-4 p-3'>
            <h2>Technical Notes</h2>

            <Row xs={1} md={3} className='g-2'>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title><a href='#/technote-1' className='subtitle'>Technical Note 1</a></Card.Title>
                        <Card.Text>
                        This note explains how we manage and harmonise the changes of administrative boundaries from round 1 to round 2. Careful harmonisation of the boundaries enables us to examine how a particular indicator changes over time.
                        </Card.Text>
                        <a href='#/technote-1'>Go to note<i className='pi pi-arrow-circle-right mx-1'></i></a>
                    </Card.Body>
                </Card>
                    
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title><a href='#/technote-0' className='subtitle'>Technical Note 2</a></Card.Title>
                        <Card.Text>
                        Change of an indicator over time can be appreciated as either improvement or worsening. In this technical note, we explain the use of Exceedance Probability to statistically determine the direction of the change.
                        </Card.Text>
                        <a href='#/technote-0'>Go to note<i className='pi pi-arrow-circle-right mx-1'></i></a>
                    </Card.Body>
                </Card>

                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title><a href='#/technote-3' className='subtitle'>Technical Note 3</a></Card.Title>
                        <Card.Text>
                        Technical note on the use of the Institute for Health Metrics and Evaluation (IHME) data in the modeling.
                        </Card.Text>
                        <a href='#/technote-3'>Go to note<i className='pi pi-arrow-circle-right mx-1'></i></a>
                    </Card.Body>
                </Card>

                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title><a href='#/technote-4' className='subtitle'>Technical Note 4</a></Card.Title>
                        <Card.Text>
                        Technical note on the use of the WHO's Expanded Special Project for Elimination of Tropical Diseases (WHO-ESPEN) data in the modeling.
                        </Card.Text>
                        <a href='#/technote-4'>Go to note<i className='pi pi-arrow-circle-right mx-1'></i></a>
                    </Card.Body>
                </Card>

            </Row>

        </div>
    )
}

function FirstNote() {
    const countries = ['Kenya']
    const content = {
        'India': FirstIndia(),
        'Kenya': FirstKenya(),
    }
    return (
        <div className='bg-secondary-subtle rounded-4 p-3'>
            <h2>Technical Note 1</h2>
            <h3>
            National and subnational boundaries
            </h3>
            <hr/>
            <Tabs className='mb-3'>
                {countries.map((country,i) => {
                    return (
                        <Tab eventKey={country} key={i} title={country}>
                            {content[country]}
                        </Tab>
                    )
                })}
            </Tabs>
        </div>
    )
}

function SecondNote() {
    return (
      <div className='bg-secondary-subtle rounded-4 p-3'>
        <h2>Technical Note 2</h2>
        <h3>Exceedance probability and confidence in changes over time</h3>
        <hr/>
        <h4>Background</h4>
        <p>
            We have produced 5x5km high-resolution (also referred to as grid level) prediction and uncertainty maps illustrating changes over time for health and development indicators within specific subnational areas, such as districts or similar administrative divisions varying by country. Our methodology relies on data from the two most recent rounds of the nationally representative Demographic and Health Surveys (DHS), which are available at the cluster level, and mapped through GPS coordinates of the cluster centres. In the case of India, we utilised the National Family Health Surveys (NFHS), specifically NFHS-4 (2015-16) denoted as Round 1, and NFHS-5 (2019-22) denoted as Round 2. Measuring changes between these survey rounds allows us to track and assess the progress of the health and development indicators over time
        </p>
        <p>
            To ensure the reliability of our estimates of the changes within each subnational area, we employed exceedance probability to quantify our confidence in these observed changes. Exceedance probability, commonly applied in environmental and risk analysis Richards et al., 2014, assesses the likelihood of an event surpassing a specific limit within a defined period (Soch, 2020). In simpler terms, exceedance probability helps us assess potential improvements or worsening of our health and development indicators. We express this likelihood as a percentage, indicating the probability of an indicator exceeding our defined threshold. For this work, we use the statistical significance levels of 90% (likely), 95% (highly likely), and 99% (almost certain). 
        </p>

        <h4>Outline</h4>
        <p>
            We outline the entire process of implementing and applying exceedance probability using the indicator "Percentage of women who had 4 or more antenatal visits" (ANC4+) in India as an example. For India, the subnational areas are the districts. This outline unfolds in three main steps: (1) preparation, (2) implementation, and (3) application. Further detail can be found in the Methods section. 
        </p>
        <div className="border border-secondary rounded-4 p-3 mb-4">
        <h5>Preparation</h5>
        <div className='row p-0 m-0 px-3'>
        <ol>
            <li>
                Sample grid-level estimates from the posterior distributions of the models. These models, processed through the Integrated Nested Laplace Approximation – Stochastic Partial Differential Equation method (INLA-SPDE) (Rue et al., 2009; Lindgren et al., 2011; Martins et al., 2013), pertain to the two rounds of survey data for ANC4+. 
            </li>
            <li>
                Derive grid-level change estimate samples by calculating the difference between the grid-level estimate samples of Round 2 and Round 1. 
            </li>
            <li>
                Aggregate the grid level change estimate samples to the subnational level, specifically at the district level, to obtain district level change estimate samples (see Figure 1a). 
            </li>
        </ol>
        </div>

        <h5>Implementation</h5>
        <div className='row p-0 m-0 px-3'>
        <ol>
            <li>
                The district level change estimate samples can be depicted using an empirical cumulative density function (ECDF) (Dekking et al., 2005). The ECDF offers insights into the probability, given the data, that the true change is equal to or less than a specified value. It derives from the proportion of samples that are equal to or less than the specified value. For change in ANC4+, we are interested in the district estimate value zero, because we want to observe where there have been meaningful improvements for ANC4+.  
            </li>
            <li>
                The ECDF at zero for each district indicates the proportion of samples equal to or less than zero. This informs us of the probability, given the data, that the true change is less than or equal to zero. 
            </li>
            <li>
                The complement of the ECDF at zero, calculated as 1 - ECDF(0), tells us the proportion of samples greater than zero. This provides the probability, given the data, that the true change is greater than zero (see Figure 1b). 
            </li>
        </ol>
        </div>

        <h5>Application</h5>
        <div className='row p-0 m-0 px-3'>
        <ol>
            <li>
                To ensure a high level of certainty (95% certain) that district level estimates are greater than zero, compare the probability (or proportion) obtained with 95% (or 0.95). Adjust the slider in the Portal to highlight districts where improvements are highly certain (95% certain). 
            </li>
            <li>
                Conversely, if the probability (or proportion) is below 95% (less than 0.95), it indicates a lack of high certainty (95% certain) regarding meaningful improvements in those districts. 
            </li>
            <li>
                Steps 1 and 2 can be repeated for various certainty levels (see Figure 1c).
            </li>
        </ol>
        </div>
        <br/>
        <Figure src={exceedance}
            label='fig-exceedance' 
            number='1'
            caption={'Workflow highlighting some of the key steps of the process described in the Outline for implementing and applying exceedance probability using the indicator ANC4+ in selected districts in India. Panel (a) links to Step 1.3 in the Outline and shows the samples of district level estimates for the change over time between NFHS-4 (Round 1) and NFHS-5 (Round2) for the ANC4+ indicator in the state of Odisha, India. Panel (b) links to Step 2.3 in the Outline and shows the histograms and proportions of samples for estimates of change over time in two districts within the state of Odisha, India. Panel (c) links to Step 3 in the Outline and is a visual representation of how changing significance levels affect the confidence (uncertainty) around the estimated improvement of ANC4+ over time for the selected districts.'}/>
        </div>

        <h4>Methods</h4>
        <p>
            In examining changes in ANC4, we employed the statistical method INLA-SPDE to estimate ANC4+ values. This method generates "best estimations" (posterior distributions) based on available data, enabling us to predict potential ANC4 values. By comparing these values across different survey rounds, we obtain samples representing changes at grid and district levels.
        </p>
        <p>
            To ensure reliability in these estimates, we utilised the ECDF. The ECDF visually represents the likelihood of observing specific changes in ANC4+. For example, the ECDF at zero indicates the likelihood of observing changes equal to or less than zero in ANC4+. Its complement, calculated as 1 minus the ECDF value at zero, informs us about the probability, given the data, of observing changes greater than zero (see Figure 1c). We then apply this information by comparing probabilities from the ECDF at zero against a 95% threshold, illustrated in Figure 1d, to highlight districts where improvements are highly certain (95% certain).  
        </p>

        <h4>Conclusion</h4>
        <p>
            Our utilisation of exceedance probability establishes a robust framework for interpreting changes over time, offering critical insights into trends and the potential for achieving significant improvements within specified timeframes. For example, assessing the exceedance probability associated with the prevalence of stunting provides valuable insights into the reduction of stunting over time. This methodology empowers policymakers by providing a credible assessment of trends, enabling informed decisions for effective interventions. 
        </p>

        <div id='reference'>
        <h4>Reference</h4>
        <div className='row p-0 m-0 px-3'>
        <ul>
            <li>
                Dekking, F. M., Kraaikamp, C., Lopuhaä, H. P., & Meester, L. E. (2005). A Modern Introduction to Probability and Statistics: Understanding why and how (Vol. 488). London: springer. DOI: <a href='https://link.springer.com/book/10.1007/1-84628-168-7' target='_blank'>10.1007/1-84628-168-7</a>.
            </li>
            <li>
                Lindgren, F., Rue, H., & Lindström, J. (2011). An explicit link between Gaussian fields and Gaussian Markov random fields: the stochastic partial differential equation approach. Journal of the Royal Statistical Society Series B: Statistical Methodology, 73(4), 423-498. DOI: <a href='https://doi.org/10.1111/j.1467-9868.2011.00777.x' target='_blank'>10.1111/j.1467-9868.2011.00777.x</a>.
            </li>
            <li>
                Martins, T. G., Simpson, D., Lindgren, F., & Rue, H. (2013). Bayesian computing with INLA: new features. Computational Statistics & Data Analysis, 67, 68-83. DOI: <a href='https://doi.org/10.1016/j.csda.2013.04.014' target='_blank'>10.1016/j.csda.2013.04.014</a>.
            </li>
            <li>
                Richards, K. K., Hazelton, M. L., Stevenson, M. A., Lockhart, C. Y., Pinto, J., & Nguyen, L. (2014). Using exceedance probabilities to detect anomalies in routinely recorded animal health data, with particular reference to foot-and-mouth disease in Viet Nam. Spatial and Spatio-Temporal Epidemiology, 11, 125-133. DOI: <a href='https://doi.org/10.1016/j.sste.2014.08.002' target='_blank'>10.1016/j.sste.2014.08.002</a>
            </li>
            <li>
                Rue, H., Martino, S., & Chopin, N. (2009). Approximate Bayesian inference for latent Gaussian models by using integrated nested Laplace approximations. Journal of the Royal Statistical Society Series B: Statistical Methodology, 71(2), 319-392. DOI: <a href='https://doi.org/10.1111/j.1467-9868.2008.00700.x' target='_blank'>10.1111/j.1467-9868.2008.00700.x</a>.
            </li>
            <li>
                Soch, J. (2020). Definition: Exceedance probability. The Book of Statistical Proofs. Url: <a href='https://statproofbook.github.io/D/prob-exc.html' target='_blank'>https://statproofbook.github.io/D/prob-exc.html</a>
            </li>
        </ul>
        </div>
        </div>
      </div>
    );
}

function ThirdNote() {
    const countries = ['Kenya']
    const content = {
        'Burkina Faso': ThirdBurkinaFaso(),
        'Kenya': ThirdKenya(),
    }
    return (
        <div className='bg-secondary-subtle rounded-4 p-3'>
            <h2>Technical Note 1</h2>
            <h3>
            Data sourced from the Institute for Health Metrics and Evaluation (IHME)
            </h3>
            <hr/>
            <Tabs className='mb-3'>
                {countries.map((country,i) => {
                    return (
                        <Tab eventKey={country} key={i} title={country}>
                            {content[country]}
                        </Tab>
                    )
                })}
            </Tabs>
            <hr/>

            <h4>IHME Data license</h4>
            <p>
                IHME specify that the data made available for download on IHME Websites can be used, shared, modified, or built upon by non-commercial users in accordance with the IHME Free-Of-Charge Non-Commercial User Agreement. <a href='https://www.healthdata.org/Data-tools-practices/data-practices/ihme-free-charge-non-commercial-user-agreement' target='_blank'><i className='pi pi-external-link'></i></a>
            </p>
        </div>
    )
}

function FourthNote() {
    const countries = ['Kenya']
    const content = {
        'Kenya': FourthKenya(),
    }
    return (
        <div className='bg-secondary-subtle rounded-4 p-3'>
            <h2>Technical Note 4</h2>
            <h3>Data sourced from ESPEN programme from WHO</h3>
            <hr/>

            <Tabs className='mb-3'>
                {countries.map((country,i) => {
                    return (
                        <Tab eventKey={country} key={i} title={country}>
                            {content[country]}
                        </Tab>
                    )
                })}
            </Tabs>
            <hr/>
        </div>
    )
}

function FirstIndia() {
    return (
      <div className='bg-secondary-subtle rounded-4 p-3'>
        <h4>Background</h4>
        <p>
            The India NFHS surveys are constructed to be representative at national, province and district level for most of the indicators. In the case of rare events indicators such as stillbirth rates, or where more sophisticated estimation methods were needed such as mortality rates (child and neonatal mortality rates), indicators were constructed and mapped at district level using the surveys. Specifically, for four indicators named, unsafe abortion, neonatal mortality rate, child mortality rate and stillbirth rate we used a two-step approach: <b>Step 1</b>. We followed the methods described in Subramaniam et al. (2021) and Ulahannan et al. (2022) to match the 2015-16 NFHS-4 data to 2019-21 NFHS-5 boundaries (ICF. The Demographic and Health Surveys Program Spatial Data Repository), in order to be able to compare changing districts over time; <b>Step 2</b>. Once all data were available at NFHS-5 boundaries, we rasterised the data for the whole country and then aggregated the data using the district level official boundaries of India (Ministry of Science and Technology, Government of India), which were used for final display on the online portal. Average values for districts were used for aggregation.
        </p>
        <p>
            For child worker, census estimates were used to calculate the indicator, and only had one point in time was available. Since census boundaries aligned with NFHS-4 boundaries, the same two-step approached as described above was applied.
        </p>
        <p>
            While the surveys were designed to be representative at the district level, caution is advised in interpreting and utilizing the findings due to the inherent limitations posed by small sample sizes for the mentioned indicators
        </p>
        <p>
            Furthermore, it is important to note that the indicators discussed herein are rare events, further emphasizing the need for careful consideration and caution in their interpretation, given the limited sample sizes at the district level.
        </p>

        <h5>Step 1. Harmonising boundaries from round 1 (NFHS-4) to round 2 (NFHS-5) to match round 2 (NFHS-5)</h5>
        <p>
            The administrative boundaries of India for the year 2015-2016 (NFHS-4) count a total of 640 districts while the administrative boundaries of India for the year 2019-2021 (NFHS-5) count a total of 707 districts (67 additional districts) (ICF. The Demographic and Health Surveys Program Spatial Data Repository). However, there are 36 states in both years with changes. The boundary changes begin with the addition of new states and the removal of some states, for example, at the state level, a new state Ladakh was created in 2019-2021 from Jammu and Kashmir, as shown in Figure 1 below.
        </p>

        <Figure src={disaggregation} label='dissagregation' number='1' width='600px'
            caption={'States dissagregation example'}/>
        
        <p>
            Meanwhile, Dadra and Nagar Haveli and Daman and Diu, two distinct states have now merged to form a new state called Dadra & Nagar Haveli & Daman & Diu as shown below in Figure 2.
        </p>

        <Figure src={aggregation} label='aggregation' number='2' width='550px'
            caption={'States agregation example'}/>

        <p>
            For the additional 67 districts, data from NFHS-4 are not available therefore, to be able to compare changes in indicators aggregated at the district level, we applied a simple methodology to harmonize geographical boundaries across the two time periods and assign the corresponding indicator value following Subramaniam et al. (2021) and Ulahannan et al. (2022). The methodology that we applied involves re-assigning indicators' values calculated from NFHS-4 data to all the 2019-21 NFHS-5 districts. This approach therefore does not make any alterations to the 2019-21 NFHS-5 data that are reported at the district level.
        </p>

        <p>
            The newly created 67 districts were formed from one or more districts included in the NFHS-4 dataset and can be divided into two different categories: type 1 and type 2. Type 1 districts (55 districts) were formed by altering the boundaries of one single district from 2015-16 NFHS-4 administrative boundaries and creating one new district. In comparison, type 2 districts (12 districts) were formed by adding geographical units from two or more parent districts. For the type 1 districts formed from one single parent district we assigned the same indicator's value as the parent district (Figure 3 and Table 1)
        </p>

        <Figure src={type1} label='type1' number='3' width='400px'
            caption={'Example of type 1 districts (Assam State)'}/>

        <p>
            In the example above the type 1 districts Biswanath and Hojai were formed from the parent district Sonitpur and Nagaon, respectively. For example, to calculate the NFHS-5 Unsafe abortion values, the new district (Biswanath) takes the same value for its parent district (Sonitpur). The same is applicable to the 95% Lower and Upper Confidence Intervals (CI) as shown in the table below:
        </p>

        <div id='table1' className='px-5'>
            <div className='text-center'><b>Table 1.</b> Example of indicator's value assignment for type 1 districts</div>
            <Table hover striped='columns'>
                <thead>
                    <tr>
                        <td></td>
                        <td colSpan={4} className='text-center'>Unsafe Abortion Value</td>
                    </tr>
                    <tr>
                        <td>District</td>
                        <td>NFHS-4 (mean)</td>
                        <td>NFHS-4 (lower CI)</td>
                        <td>NFHS-4 (upper CI)</td>
                        <td>NFHS-5 (mean)</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Sonitpur</td><td>21.3</td><td>8.8</td><td>43.0</td><td>35.9</td>
                    </tr>
                    <tr>
                        <td>Biswanath</td><td>21.3</td><td>8.8</td><td>43.0</td><td>35.9</td>
                    </tr>
                    <tr>
                        <td>*Sonitpur</td><td>21.3</td><td>8.8</td><td>43.0</td><td>35.9</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5}>
                        Notes: *Sonitpur is the altered version of Sonitpur from NFHS-4 after Biswanath was created from it.
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </div>

        <p>
            For type 2 districts, which were formed by adding areas from two or more parent districts, we assigned the average indicator's value of the respective parent district (Figure 4 and Table 2).
        </p>

        <Figure src={type2} label='type2' number='4' width='450px'
            caption={'Example of type 2 districts (Gujarat State)'}/>

        <p>
            In the example above the type 2 district Botad was formed from the parent districts Ahmadabad and Bhavnagar.
        </p>
        
        <div id='table2' className='px-5'>
            <div className='text-center'><b>Table 2.</b> Example of indicator's value assignment for type 2 districts</div>
            <Table hover striped='columns'>
                <thead>
                    <tr>
                        <td></td>
                        <td colSpan={4} className='text-center'>Total Fertility Rate</td>
                    </tr>
                    <tr>
                        <td>District</td>
                        <td>NFHS-4 (mean)</td>
                        <td>NFHS-4 (lower CI)</td>
                        <td>NFHS-4 (upper CI)</td>
                        <td>NFHS-5 (mean)</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Ahmadabad</td><td>0.256</td><td>0.067</td><td>0.621</td><td>0.284</td>
                    </tr>
                    <tr>
                        <td>Bhavnagar</td><td>0.000</td><td>n/a</td><td>n/a</td><td>0.000</td>
                    </tr>
                    <tr>
                        <td>Botad</td><td>0.128</td><td>0.067</td><td>0.621</td><td>0.000</td>
                    </tr>
                    <tr>
                        <td>*Ahmadabad</td><td>0.256</td><td>0.067</td><td>0.621</td><td>1.712</td>
                    </tr>
                    <tr>
                        <td>*Bhavnagar</td><td>0.000</td><td>0.067</td><td>0.621</td><td>1.794</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5}>
                        Notes: *Ahmadabad and *Bhavnagar are the altered versions of Ahmadabad and Bhavnagar from NFHS-4 after Botad was created from it.
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={5}>
                        n/a = not applicable, only *Ahmadabad and *Bhavnagar are part of NFHS-5
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </div>

        <p>
            Out of 36 states, 22 states have neither type 1 nor type 2 boundaries, these states are listed below with their numbers of unchanging district boundaries, that is, same number of boundaries in 2015-16 and 2019-21 (Table 3).
        </p>
        <div id='table3' className='px-5'>
            <div className='text-center'><b>Table 3.</b> Number of districts in each state in 2019-21</div>

            <Table hover striped='columns' size='lg'>
                <thead>
                    <tr>
                        <td>No.</td>
                        <td>State</td>
                        <td>Total Districts in 2019-2021</td>
                    </tr>
                </thead>
                <tbody>
                    {ContentTab3.map((row,i) => {
                        return (
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{row.State}</td>
                                <td>{row.Count}</td>
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr style={{fontWeight:'bold'}}>
                        <td colSpan={2}>SUM</td><td>307</td>
                    </tr>
                </tfoot>
            </Table>
        </div>

        <p>
            These constitute 307 out of 707 districts that have not changed boundaries to either type 1 or type 2. The remaining 400 districts fall within 14 states, and all have type 1 districts, the only states without type 2 district boundaries are Assam, Chhattisgarh, Haryana, Madhya Pradesh, Maharashtra, Meghalaya, Punjab, Tripura, and West Bengal states.
        </p>
        <p>
            The following are the number of type 1 and type 2 districts with the total districts in each respective year, stating the number of new districts created in each state (Table 4).
        </p>

        <div id='table4' className='px-5'>
            <div className='text-center'><b>Table 4.</b> Number of districts in each state in 2019-21</div>
            <Table hover striped='columns' size='lg'>
                <thead>
                    <tr>
                        <td>No.</td>
                        <td>State</td>
                        <td>Type-1 Districts</td>
                        <td>Type-2 Districts</td>
                        <td>Total Districts in 2015-2016</td>
                        <td>Total Districts in 2019-2021</td>
                        <td>New Districts</td>
                    </tr>
                </thead>
                <tbody>
                    {ContentTab4.map((row, i) => {
                        return (
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{row.State}</td>
                                <td>{row.Type1}</td>
                                <td>{row.Type2}</td>
                                <td>{row.Count15}</td>
                                <td>{row.Count19}</td>
                                <td>{row.New}</td>
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr style={{fontWeight:'bold'}}>
                        <td colSpan={2}>Total</td>
                        <td></td>
                        <td></td>
                        <td>333</td>
                        <td>400</td>
                        <td>67</td>
                    </tr>
                </tfoot>
            </Table>
        </div>

        <Accordion className='mb-3'>
            <Accordion.Item eventKey='0'>
                <Accordion.Header>
                    Click to show the details on the changes.
                </Accordion.Header>
                <Accordion.Body>
                    <ContentChanges />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>

        <h5>Step 2. Rasterization and harmonisation to national official boundaries to enable over time comparisons</h5>

        <p>
            With indicator values for the 707 NFHS-5 districts in table format, these are joined to the NFHS-5 district boundary shapefile using a common attribute (State_District). For each indicator and confidence intervals within the joined table, the shapefile is rasterized, to match the raster properties (coordinate system, cell size and grid alignment) derived from a common mastergrid of the national boundaries (WorldPop et al, 2018). The rasterized indicator values are then summarized using the district level official boundaries of India (Ministry of Science and Technology, Government of India) by using a GIS tool that calculates the zonal statistics using R (2021) software. This produces statistics (mean and median) from all the raster cells that sit within each district boundary so that indicator values are generated for each of the 742 districts. Medians were used to summarise the indicators of interest. This outputted table can be exported as a csv file or shapefile. A flowchart of the steps can be found in Figure 5.
        </p>
        <Figure src={workflow} label='flowchart' number='5' 
            caption={'Flowchart illustrating the process of convering indicator values from NFHS-5 district boundaries to official distric boundaries'}/>

        <div id='reference'>
        <h4>Reference</h4>
        <ul>
            <li id='subramaniam2021'>Subramaniam SV, Kumar A, Tripathi N. Geographic insights lab. NFHS policy Tracker for districts. Cambridge, USA: Harvard Center for Population and Development Studies and Center for Geographic Analysis at Harvard, 2021.</li>
            <li id='ulahannan2022'><a href='https://gh.bmj.com/content/7/4/e007798.abstract' target='_blank'>Ulahannan, Sabu Kochupurackal, et al. "Alarming level of severe acute malnutrition in Indian districts." BMJ global health 7.4 (2022): e007798.</a></li>
            <li id='worldpop2018'><a href='https://hub.worldpop.org/geodata/summary?id=29691' target='_blank'>WorldPop (www.worldpop.org - School of Geography and Environmental Science, University of Southampton; Department of Geography and Geosciences, University of Louisville; Departement de Geographie, Universite de Namur) and Center for International Earth Science Information Network (CIESIN), Columbia University (2018). Global High Resolution Population Denominators Project - Funded by The Bill and Melinda Gates Foundation (OPP1134076). https://hub.worldpop.org/geodata/summary?id=29691 . [Accessed 09 January 2023].</a></li>
            <li id='rcoreteam2021'><a href='https://R-project.org' target='_blank'>R Core Team (2021). R: A language and environment for statistical. computing. R Foundation for Statistical Computing, Vienna, Austria</a></li>
        </ul>
        </div>
        <br/>
        <hr/>
        <h4>.</h4>
      </div>
    );
}

function FirstKenya() {
    return (
      <div className='bg-secondary-subtle rounded-4 p-3'>
        <p>
            For this work, Population Division, United States Census Bureau (USCB) open access boundaries were used for geographical aggregations and for displaying purposes. USCB produced administrative level 1 and 2 boundaries in line with the subnational administrative structure used for Kenya’s 2019 census. Kenya national boundaries as reported by the USCB datasets were made to align to the Large Scale International Boundary Line (LSIB) dataset from the United States. The U.S. Census Bureau’s products are open access and can be accessed from <a href='https://www.census.gov/geographies/mapping-files/time-series/demo/international-programs/subnationalpopulation.html' target='_blank'>here</a>.
        </p>
        <p>
            For modelled-based indicators (5x5km high resolution maps), official national country boundaries were used to model and summarise the estimates at sub-county level (US Census Bureau). Pixels coinciding with known water bodies were left as NAs and were ignored when aggregating to administrative boundaries. 
        </p>
        <p>
            For selected indicators where high resolution modelling of the DHS data was not appropriate (e.g. rare events indicators such as stillbirth rate, exclusive breastfeeding, and low birth weight), county level only estimates were used. The DHS data are representative of counties as defined by the DHS (KNBS and ICF, 2023). This required processing to join the tabular data to the DHS county-level boundaries used in the original data collection for both round 1 (Kenya DHS-7, 2014) and 2 (Kenya DHS-8, 2022, DHS Spatial Data Repository), before rasterizing in line with a Kenya mastergrid and re-summarising using the USCB county-level boundaries, taking the mean pixel value falling within a given boundary. KPHC data (Child Labour) was joined to the USCB county-level boundaries based on name. Changes in the areas between DHS-7 and DHS-8 in selected counties were inspected and considered negligible for this work. All GIS processing was carried out in ArcGIS Pro 2.7.3.
        </p>

        <div id='reference'>
        <h4>Reference</h4>
        <div className='row p-0 m-0 px-3'>
            <ul style={{marginBottom:'20px'}}>
                <li>
                    Population Division, U.S. Census Bureau. The U.S. Census Bureau's products are open access and can be accessed from <a href='https://www.census.gov/geographies/mapping-files/time-series/demo/international-programs/subnationalpopulation.html' target='_blank'>here</a>.
                </li>
                <li>
                    KNBS and ICF. 2023. Kenya Demographic and Health Survey 2022: Volume 1. Nairobi, Kenya, and Rockville, Maryland, USA: KNBS and ICF. 
                </li>
                <li>
                    Spatial Data Repository: Kenya 2014 & 2020 DHS - National and Sub-National Boundaries. <a href='https://spatialdata.dhsprogram.com' target='_blank'>spatialdata.dhsprogram.com</a>. [Accessed 01-01-2024]. ICF, The Demographic and Health Surveys Program Spatial Data Repository. Funded by USAID.
                </li>
            </ul>
            </div>
        </div>
      </div>
    );
}

function ThirdBurkinaFaso(){
    return <></>
}

function ThirdKenya() {
    return (
        <div className='bg-secondary-subtle rounded-4 p-3'>
            <div id='table1' className='px-5'>
                <Table striped>
                    <thead>
                        <tr>
                            <td>Indicator</td>
                            <td>Definition</td>
                            <td>Year(s)</td>
                            <td>Geographical level</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Onchocerciasis infection</td>
                            <td>
                                Prevalence (%) of onchocerciasis infection in the population 
                            </td>
                            <td>2014 and 2018</td>
                            <td>5x5km and sub-county</td>
                        </tr>
                        <tr>
                            <td>Lymphatic filariasis infection</td>
                            <td>
                                Prevalence (%) of lymphatic filariasis infection in the population 
                            </td>
                            <td>2014 and 2018</td>
                            <td>5x5km and sub-county</td>
                        </tr>
                        <tr>
                            <td>Under five mortality</td>
                            <td>
                                Probability of death amongst children aged under 5 years, multiplied by 1,000 to calculate mortality rates. The indicator is therefore expressed as a mortality rate per 1,000 live births. 
                            </td>
                            <td>2014 and 2017</td>
                            <td>5x5km and sub-county</td>
                        </tr>
                        <tr>
                            <td>Neonatal mortality</td>
                            <td>
                                Probability of death amongst children aged 0-28 days, multiplied by 1,000 to calculate mortality rates. The indicator is therefore expressed as a mortality rate per 1,000 live births.
                            </td>
                            <td>2014 and 2017</td>
                            <td>5x5km and sub-county</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <h4>Introduction</h4>
            <p>
                In this work, 5x5 km cell-level estimates for two separate time points—2014 and 2018 for the two NTDs, and 2014 and 2017 for the two mortality indicators—were sourced and downloaded from <a href='https://ghdx.healthdata.org/' target='_blank'>the IHME websites</a>. The data were further aggregated to sub-counties (second-level administrative units) of Kenya using the Population Division. US Census Bureau national and subnational boundaries.
            </p>

            <h4>Data</h4>
            <h5>Prevalence (%) of onchocerciasis infection in the population</h5>
            <p>
                The source data used to populate this indicator describe onchocerciasis prevalence across Africa and Yemen from 2000 to 2018, and were produced by the Institute for Health Metrics and Evaluation (IHME, 2022; Schmidt et al. 2022). To produce these data a systematic review of published literature on onchocerciasis-related infection and prevalence from 1975-2017 was first undertaken by IHME. Prevalence data linked to 14,043 unique locations across the Americas, Africa and Yemen were extracted from 259 peer-reviewed articles identified by the review. These data were modelled alongside several ecological, environmental and epidemiological covariates in a Bayesian geostatistical framework to estimate the annual prevalence of onchocerciasis from 2000 to 2018 in 5km2 spatial resolution grid cells. Mean, 2.5% quantile (lower) and 97.5% quantile (upper) cell-level estimates were extracted from the predictive posterior distribution, and represent the estimated percentage of the (all ages and both sexes) population at that location who are prevalent with onchocerciasis at the relevant timepoint. Prevalent cases are those with presence of microfiladermia, detected by skin snip microscopy. Estimates were not generated for any cells whose: (i) land cover was classified as "barren or sparsely vegetated" by Moderate Resolution Imaging Spectroradiometer satellite data for 2015; or (ii) total population density was less than ten persons per 1km2 grid cell according to WorldPop population estimates for 2015. 
            </p>
            <p>
                The data shown represent the prevalence (%) of onchocerciasis infection in the population, indicated by the presence of microfiladermia as detected by skin snip microscopy (%) 
            </p>

            <h5>Prevalence (%) of lymphatic filariasis infection in the population</h5>
            <p>
                The source data used to populate this indicator describe global lymphatic filariasis prevalence from 2000 to 2018 and were produced by the Institute for Health Metrics and Evaluation (IHME, 2020; Local burden of Disease NTD collaborators, 2020). To produce these data a systematic review of published literature on lymphatic filariasis-related infection and prevalence from 1990 onwards was first undertaken by IHME. This was further supplemented by additional programme monitoring data obtained from: (i) the WHO's Global Programme to Eliminate Lymphatic Filariasis; and (ii) the WHO's Expanded Special Project for Elimination of Neglected Tropical Diseases. Prevalence data linked to 15,829 unique global locations were extracted from 301 peer-reviewed articles identified by the review. These data were modelled alongside several covariates representing ecological, demographic, and programmatic factors related to lymphatic filariasis in a Bayesian geostatistical framework to estimate the annual prevalence from 2000 to 2018 in 5km2 spatial resolution grid cells. Mean, 2.5% quantile (lower) and 97.5% quantile (upper) cell-level estimates were extracted from the predictive posterior distribution, and represent the estimated percentage of the (all ages and both sexes) population at that location who are prevalent at the relevant timepoint. Prevalent cases are those with lymphatic filariasis as measured by the immunochromatographic (ICT) antigen test. Estimates were not generated for any cells whose: (i) land cover was classified as "barren or sparsely vegetated" by Moderate Resolution Imaging Spectroradiometer satellite data for 2015; or (ii) total population density was less than ten persons per 1km2 grid cell according to WorldPop population estimates for 2015.
            </p>
            <p>
                The data shown represent the prevalence (%) of lymphatic filariasis infection in the population, as measured by the ICT antigen test.
            </p>

            <h5>Under five mortality</h5>
            <p>
                The source data used to populate this indicator describe estimated child mortality rates across 99 low-and middle-income countries from 2000 to 2017 and were produced by the Institute for Health Metrics and Evaluation (IHME, 2019; Burstein et al. 2019). To produce estimates in 5km2 spatial resolution grid cells, input data from the Global Burden of Disease study were modelled by IHME alongside several sociodemographic, environmental and epidemiological covariates in a Bayesian geostatistical framework. Mean, 2.5% quantile (lower) and 97.5% quantile (upper) cell-level mortality probabilities amongst children aged 0-28 days (neonates), under 1 year (infants), and under 5 years (under 5s) were separately estimated from the posterior probability distribution. Estimated probabilities were not generated for any cells whose: (i) land cover was classified as "barren or sparsely vegetated" by Moderate Resolution Imaging Spectroradiometer satellite data for 2015; or (ii) total population density was less than ten persons per 1km2 grid cell according to WorldPop population estimates for 2015. 
            </p>
            <p>
                The data shown represent the modelled probability of death amongst children aged under 5 years, multiplied by 1,000 to calculate mortality rates. The indicator is therefore expressed as a mortality rate per 1,000 live births.
            </p>

            <h5>Neonatal mortality</h5>
            <p>
                The source data used to populate this indicator describe estimated child mortality rates across 99 low-and middle-income countries from 2000 to 2017 and were produced by the Institute for Health Metrics and Evaluation (IHME, 2019; Burstein et al. 2019). To produce estimates in 5km2 spatial resolution grid cells, input data from the Global Burden of Disease study were modelled by IHME alongside several sociodemographic, environmental and epidemiological covariates in a Bayesian geostatistical framework. Mean, 2.5% quantile (lower) and 97.5% quantile (upper) cell-level mortality probabilities amongst children aged 0-28 days (neonates), under 1 year (infants), and under 5 years (under 5s) were separately estimated from the posterior probability distribution. Estimated probabilities were not generated for any cells whose: (i) land cover was classified as "barren or sparsely vegetated" by Moderate Resolution Imaging Spectroradiometer satellite data for 2015; or (ii) total population density was less than ten persons per 1km2 grid cell according to WorldPop population estimates for 2015.
            </p>
            <p>
                The data shown represent the modelled probability of death amongst children aged 0-28 days, multiplied by 1,000 to calculate mortality rates. The indicator is therefore expressed as a mortality rate per 1,000 live births. 
            </p>

            <h4>Processing</h4>
            <p>
                IHME data is provided at a resolution of 5km. Data was resampled and re-projected to align with a 1km mastergrid covering the full extent of Kenya. Sub-county level summaries were captured using this resampled 1km data, whilst high-resolution output maps (raster) were produced from the original 5km resolution data aligned to the mastergrid.
            </p>
            <p>
                Where there were missing/NA pixels in the original raster's due to differing coastline definitions between datasets, cell values were interpolated. Otherwise, all other missing/NA pixels present in the original data were left as missing/NA.
            </p>
            <p>
                All processing was carried out in ArcGIS Pro 2.7.3 
            </p>

            <h4>References</h4>
            <div className='row p-0 m-0 px-3'>
            <ul style={{marginBottom:'20px'}}>
                <li>
                    Population Division, U.S. Census Bureau. The U.S. Census Bureau's products are open access and can be accessed from <a href='https://www.census.gov/geographies/mapping-files/time-series/demo/international-programs/subnationalpopulation.html' target='_blank'>here</a>.
                </li>
                <li>
                    Institute for Health Metrics and Evaluation (IHME). Africa and Yemen Onchocerciasis Prevalence Geospatial Estimates 2000-2018. Seattle, United States of America: Institute for Health Metrics and Evaluation (IHME), 2022. DOI: <a href='https://doi.org/10.6069/11JK-D224'>10.6069/11JK-D224</a>. Data are visualised <a href='https://vizhub.healthdata.org/lbd/oncho#' target='_blank'>here</a>.
                </li>
                <li>
                    Schmidt et al. (2022) The prevalence of onchocerciasis in Africa and Yemen, 2000–2018: a geospatial analysis. BMC Med 20, 293. DOI: <a href='https://doi.org/10.1186/s12916-022-02486-y' target='_blank'>10.1186/s12916-022-02486-y</a>.
                </li>
                <li>
                    Institute for Health Metrics and Evaluation (IHME). Global Lymphatic Filariasis Prevalence Geospatial Estimates 2000-2018. Seattle, United States of America: Institute for Health Metrics and Evaluation (IHME), 2020. DOI: 
                    <a href='https://doi.org/10.6069/8NA6-6Z2' target='_blank'>10.6069/8NA6-6Z2</a>. Data are visualised <a href='https://vizhub.healthdata.org/lbd/lf#' target='_blank'>here</a>.
                </li>
                <li>
                    Local Burden of Disease 2019 Neglected Tropical Diseases Collaborators (2020) The global distribution of lymphatic filariasis, 2000–18: a geospatial analysis. The Lancet Global Health 8(9): e1186-e1194. DOI: <a href='https://doi.org/10.1016/S2214-109X(20)30286-2' target='_blank'>10.1016/S2214-109X(20)30286-2</a>
                </li>
                <li>
                    Institute for Health Metrics and Evaluation (IHME). Low- and Middle-Income Country Neonatal, Infant, and Under-5 Mortality Geospatial Estimates 2000-2017. Seattle, United States of America: Institute for Health Metrics and Evaluation (IHME), 2019. DOI: 
                    <a href='https://doi.org/10.6069/9ABZ-XG84' target='_blank'>10.6069/9ABZ-XG84</a>. Data are visualised <a href='https://vizhub.healthdata.org/lbd/under5#' target='_blank'>here</a>
                </li>
                <li>
                    Burstein et al. (2019) Mapping 123 million neonatal, infant, and child deaths between 2000 and 2017. Nature 574: 353–358. DOI: <a href='https://doi.org/10.1038/s41586-019-1545-0' target='_blank'>10.1038/s41586-019-1545-0</a>. 
                </li>
            </ul>
            </div>
        </div>
    )
}

function FourthKenya() {
    return (
        <div className='bg-secondary-subtle rounded-4 p-3'>
            <div id='table1' className='px-5'>
                <Table striped>
                    <thead>
                        <tr>
                            <td>Indicator</td>
                            <td>Definition</td>
                            <td>Year(s)</td>
                            <td>Geographical level</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Soil-transmitted helminth infections</td>
                            <td>
                            Prevalence (%) of soil-transmitted helminth infection in the population (STH)
                            </td>
                            <td>2010-2015</td>
                            <td>5x5km and sub-county</td>
                        </tr>
                        <tr>
                            <td>Schistosomiasis</td>
                            <td>
                                Prevalence (%) of schistosomiasis infection (SCHI) 
                            </td>
                            <td>2010-2018</td>
                            <td>5x5km and sub-county</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <h4>Introduction</h4>
            <p>
                In this work, 5x5 km high spatial resolution surfaces for Soil-transmitted helminth infection (STH) and Schistosomiasis (SCHI) in Kenya were produced using Bayesian geostatistical models. These geostatistical models were constructed using WHO’s Expanded Special Project for Elimination of Tropical Diseases (ESPEN) site units’ locations for a range of years (WHO-ESPEN). All clusters surveyed between 2010 and 2015 (for soil-transmitted helminth infection) and between 2010 and 2018 (for schistosomiasis infection) were employed as input data in the model; while we used a range of environmental, climatic, geographical, and socio-economic datasets as covariates.
            </p>
            <p>
                A Bayesian geostatistical modeling approach was employed to construct 5x5 km high spatial resolution surfaces, including the prediction (mean) and uncertainty (standard deviation) surfaces. Also, using the grid-level high-resolution modelled outputs and uncertainty surfaces produced, we performed population-weighted aggregation up to the county and subcounty levels (US Census Bureau).
            </p>

            <h4>Data</h4>
            <p>
                The source data used to populate this indicator describe STH and SCHI in Kenya, and were sourced from the WHO’s Expanded Special Project for Elimination of Tropical Diseases (ESPEN) database. ESPEN covers all 47 countries of the WHO AFRO region and five countries of the WHO EMRO region (Sudan, Egypt, Somalia, Djibouti and Yemen). The source STH and SCHI prevalence data had been extracted from the Global Atlas of Helminth Infections (see Pullan et al., 2011) and were available at the level of ‘site units’, which are the sites of cross-sectional prevalence surveys conducted in representative research or sentinel populations. Relevant surveys were identified through structured searches of electronic bibliographic databases, manual searches of local archives and libraries, and direct contact with researchers. Any data based on hospital or clinic surveys, post-intervention surveys, or surveys among sub-populations (such as refugees, prisoners or nomads) were excluded from the ESPEN database. The database collects all surveys found to meet the inclusion criteria, regardless of the year of collection/publication, many of which reported a prevalence value linked to GPS coordinates. While most surveys had included participants of all ages, some were limited to a specific age group only; surveys of the latter type usually involved a population of children and/or adolescents, but alternate age ranges were sometimes used. All available survey data were used to fit the models described below.  
            </p>
            <p>
                Also, a range of environmental, climatic, geographical, and socioeconomic covariates were selected and incorporated within the statistical models for predicting the health indicators.
            </p>

            <h4>Methods</h4>
            <p>
                The geospatial modelling methodology utilised in this work made use of data for the STH and SCHI from WHO ESPEN, along with environmental, climatic, geographical, and socioeconomic variables incorporated as predictors within the statistical model for predicting health and development indicators from household surveys. These covariates represent the candidate covariates on which robust covariate selection was performed.  
            </p>
            <p>
                These data were employed using the disease site units' locations as inputs in our analyses, with the indicator being STH and SCHI used as the outcome variables to be predicted, and the geospatial covariates used as predictors in the model.
            </p>
            <p>
                For STH the modelled indicator was the cumulative infection by any of the soil transmitted helminths Ascaris lumbricoides, Trichuris trichiura and the hookworms Ancylostoma duodenale and Necator americanus. This was calculated from the individual infection rates using the method suggested in de Silva and Hall (2010).
            </p>
            <p>
                A geostatistical model was fitted using the integrated nested Laplace approximation – stochastic partial differential equations (INLA-SPDE) method. From this model 5x5 km high spatial resolution surfaces, including the prediction (mean) and uncertainty (standard deviation) surfaces, were constructed (Rue et al., 2009; Lindgren et al., 2011; Martins et al., 2013). The high-resolution outputs of the model were also aggregated to county and subcounty level using population weighted averaging using unadjusted population counts for Kenya.  
            </p>

            <h4>Notes</h4>
            <p>
                Estimates for counties for which there were fewer than 5 clusters were disregarded, while counties where surveyed points were between 5 and 30 were flagged as showing high uncertainty.  
            </p>
            <p>
                Counties which do not have environmental suitability for STH infection (defined as maximum daytime land surface temperature exceeding 40 degrees Celsius) were not modelled and are marked grey. This is based on indications described in the Pullan et al. (2011). 
            </p>

            <h4>References</h4>
            <div className='row p-0 m-0 px-3'>
            <ul style={{marginBottom:'20px'}}>
                <li>
                    Population Division, U.S. Census Bureau. The U.S. Census Bureau's products are open access and can be accessed from <a href='https://www.census.gov/geographies/mapping-files/time-series/demo/international-programs/subnationalpopulation.html' target='_blank'>here</a>.
                </li>
                <li>
                    World Health Organisation Regional Office for Africa (2024) Expanded Special Project for Elimination of Neglected Tropical Diseases. Data and more information can be accessed from <a href='https://espen.afro.who.int/' target='_blank'>here</a>.
                </li>
                <li>
                    Rue, H., Martino, S., & Chopin, N. (2009). Approximate Bayesian inference for latent Gaussian models by using integrated nested Laplace approximations. Journal of the Royal Statistical Society Series B: Statistical Methodology, 71(2), 319-392. DOI: <a href='https://doi.org/10.1111/j.1467-9868.2008.00700.x' target='_blank'>10.1111/j.1467-9868.2008.00700.x</a>.
                </li>
                <li>
                    Lindgren, F., Rue, H., & Lindström, J. (2011). An explicit link between Gaussian fields and Gaussian Markov random fields: the stochastic partial differential equation approach. Journal of the Royal Statistical Society Series B: Statistical Methodology, 73(4), 423-498. DOI: <a href='https://doi.org/10.1111/j.1467-9868.2011.00777.x' target='_blank'>10.1111/j.1467-9868.2011.00777.x</a>.
                </li>
                <li>
                    Martins, T. G., Simpson, D., Lindgren, F., & Rue, H. (2013). Bayesian computing with INLA: new features. Computational Statistics & Data Analysis, 67, 68-83. DOI: <a href='https://doi.org/10.1016/j.csda.2013.04.014' target='_blank'>10.1016/j.csda.2013.04.014</a>
                </li>
                <li>
                    de Silva N, Hall A. Using the prevalence of individual species of intestinal nematode worms to estimate the combined prevalence of any species. PLoS Negl Trop Dis. 2010 Apr 13;4(4):e655. DOI: <a href='https://doi.org/10.1371/journal.pntd.0000655' target='_blank'>10.1371/journal.pntd.0000655</a>. 
                </li>
            </ul>
            </div>
        </div>
    )
}

const ContentTab3 = [
    {"State": "Andaman & Nicobar Islands", "Count": "3"},
    {"State": "Andhra Pradesh", "Count": "13"},
    {"State": "Bihar", "Count": "38"},
    {"State": "Chandigarh", "Count": "1"},
    {"State": "Dandra & Nagar Haveli & Daman & Diu", "Count": "3"},
    {"State": "Goa", "Count": "2"},
    {"State": "Himachal Pradesh", "Count": "12"},
    {"State": "Jammu and Kashmir", "Count": "20"},
    {"State": "Jharkhand", "Count": "24"},
    {"State": "Karnataka", "Count": "30"},
    {"State": "Kerala", "Count": "2"},
    {"State": "Ladakh", "Count": "1"},
    {"State": "Lakshadweep", "Count": "14"},
    {"State": "Manipur", "Count": "9"},
    {"State": "Mizoram", "Count": "8"},
    {"State": "Nagaland", "Count": "11"},
    {"State": "Odisha", "Count": "30"},
    {"State": "Puducherry", "Count": "4"},
    {"State": "Rajasthan", "Count": "33"},
    {"State": "Sikkim", "Count": "4"},
    {"State": "Tamil Nadu", "Count": "32"},
    {"State": "Uttarakhand", "Count": "13"}
]

const ContentTab4 = [
    {"State": "Arunachal Pradesh", "Type1": "6", "Type2": "1", "Count15": "16", "Count19": "20", "New": "4"},
    {"State": "Assam", "Type1": "12", "Type2": "-", "Count15": "27", "Count19": "33", "New": "6"},
    {"State": "Chhattisgarh", "Type1": "15", "Type2": "-", "Count15": "18", "Count19": "27", "New": "9"},
    {"State": "Gujarat", "Type1": "8", "Type2": "3", "Count15": "26", "Count19": "33", "New": "7"},
    {"State": "Haryana", "Type1": "1", "Type2": "-", "Count15": "21", "Count19": "22", "New": "1"},
    {"State": "Madhya Pradesh", "Type1": "2", "Type2": "-", "Count15": "50", "Count19": "51", "New": "1"},
    {"State": "Maharashtra", "Type1": "2", "Type2": "-", "Count15": "35", "Count19": "36", "New": "1"},
    {"State": "Meghalaya", "Type1": "8", "Type2": "-", "Count15": "7", "Count19": "11", "New": "4"},
    {"State": "NCT of Delhi", "Type1": "4", "Type2": "4", "Count15": "9", "Count19": "11", "New": "2"},
    {"State": "Punjab", "Type1": "4", "Type2": "-", "Count15": "20", "Count19": "22", "New": "2"},
    {"State": "Telangana", "Type1": "23", "Type2": "7", "Count15": "10", "Count19": "31", "New": "21"},
    {"State": "Tripura", "Type1": "7", "Type2": "-", "Count15": "4", "Count19": "8", "New": "4"},
    {"State": "Uttar Pradesh", "Type1": "4", "Type2": "2", "Count15": "71", "Count19": "75", "New": "4"},
    {"State": "West Bengal", "Type1": "2", "Type2": "-", "Count15": "19", "Count19": "20", "New": "1"}
]

const ListOfChanges = [
    {
        title: 'Arunachal Pradesh',
        items: [
            'A new district (Kra Daadi) was formed from Kurung Kumey district.',
            'Longding district was created from Tirap district.',
            'Namsai district was created from Lohit district.',
            'A new Siang district was created from Parent districts West Siang and East Siang.'
        ]
    },
    {
        title: 'Assam',
        subtitle: 'All 6 new districts created from type 1 Parent districts include:',
        items: [
            'Biswanath district was created from Sonitpur', 
            'Charaideo from Sivasagar', 
            'Hojai from Nagaon', 
            'Majuli from Jorhat', 
            'South Salmara Mancachar from Dhubri',
            'West Karbi Anglong from Karbi Anglong' 
            ]
    },
    {
        title: 'Gujarat',
        subtitle: 'New districts formed include:',
        items: [
            'Botad from Bhavnagar and Ahmadabad',
            'Chhota Udaipur from Vadodara',
            'Devbhumi Dwarka from Jamnagar',
            'Gir Somnath from Junagadh',
            'Mahisagar from Panchmahal and Kheda',
            'Morbi from Rajkot and Surrendranagar'
        ]
    },
    {
        title: 'Chhattisgarh',
        subtitle: 'Dakshin Bastar Dantewada district in 2015-16 no longer exists, as two new districts: Dantewada and Sukma were created from it in 2019-21. Balod and Bemetara districts were also created from Durg district, thus forming three new districts including Durg.  Surguja district in 2015-16 has also been divided into three: Balarampur, Surajpur, and Surguja. Other districts formed include:',
        items: [
            'Baloda Bazar from Raipur',
            'Kodagaon from Bastar',
            'Mungeli from Bilaspur'
        ]
    },
    {
        title: 'NCT of Delhi',
        subtitle: 'Two entirely new districts: Shahdara (formed from North East and East districts), and South East Delhi (formed from South district) have been added. Although other districts bear the same name as in 2015-16, they have changed boundaries, for example,',
        items: [
            'Central district and North district boundaries have been merged to form a new Central district in 2019-21',
            'With the 2015-16 North merging as stated above, the 2015-16 North West district was also divided into new North and North West districts',
            'New Delhi district in 2019-21 now includes a part of the 2015-16 South West boundaries with the 2015-16 New Delhi boundary',
            '2015-16 South district is now divided into two 2019-21 districts- South and South East'
        ]
    },
    {
        title: 'Telangana',
        subtitle: 'The following type 1 and type 2 districts exist in Telangana state in 2019-21:',
        items: [
            'Komaram Bheem Asifabad, Mancherial, and Nirmal from Adilabad district in 2015-16',
            'Jagitial, Peddapalli, and Rajanna Sircilla districts from Karimnagar 2015-16 district',
            'Kothagudem from Khammam',
            'Jogulamba Gadwal and Nagarkurnool from Mahbubnagar',
            'Kamareddy from Nizamabad',
            'Medchal-Malkajgiri from RangaReddy',
            'Sangareddy from Medak',
            'Suryapet and Yadadri Bhuvanagiri from Nalgonda',
            'Warangal Rural from Warangal',
            'Jangoan from Warangal and Nalgonda',
            'Jayashankar Bhupalapally from Karimnagar, Warangal, and Khammam',
            'Mahabubabad from Warangal and Khammam',
            'Ranga Reddy and Vikarabad from RangaReddy and Mahabubnagar',
            'Siddipet from Medak, Warangal, and Karimnagar',
            'Warangal Urban from Warangal and Karimnagar'
        ]
    },
    {
        title: 'Haryana',
        subtitle: 'The only new district formed is Charkhi Dadri from Bhiwani district.',
        items: ''
    },
    {
        title: 'Madhya Pradesh',
        subtitle: 'Only one new district was formed: Agar Malwa from Shajapur district.',
        items: ''
    },
    {
        title: 'Punjab',
        subtitle: 'The two new districts formed are:',
        items: [
            'Fazilka from Firozpur',
            'Pathankot from Gurdaspur'
        ]
    },
    {
        title: 'Meghalaya',
        subtitle: 'Jaintia Hills no longer exists in 2015-16 as the district now includes two new districts: East Jaintia Hills and West Jaintia Hills. Other new districts formed include:',
        items: [
            'North Garo Hills from East Garo Hills',
            'South West Garo Hills from West Garo Hills',
            'South West Khasi Hills from West Khasi Hills'
        ]
    },
    {
        title: 'Uttar Pradesh',
        subtitle: 'Four new districts formed are:',
        items : [
            'Amethi from Sultanpur and Rae Bareli',
            'Hapur from Ghaziabad',
            'Sambhal from Moradabad and Budaun',
            'Shamli from Muzaffarnagar'
        ]
    },
    {
        title: 'West Bengal',
        subtitle: 'Barddhaman district no longer exists, but has two new districts created from it:',
        items : [
            'Paschim Barddhaman and Purba Barddhaman'
        ]
    },
    {
        title: 'Tripura',
        subtitle: 'The new districts formed include:',
        items : [
            'Khowai and Sepahijala from West district',
            'Unakoti from North district'
        ]
    },
]
