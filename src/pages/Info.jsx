import { useState } from "react"
import { OverlayTrigger, Popover, Modal, Button } from "react-bootstrap"
import { BsQuestionCircleFill, BsInfoCircleFill } from "react-icons/bs"
import exceedance from '../assets/exceedance.png'

const askTable = (
    <div>
        <b>For indicators where an increase in the value means improvement over time</b>
        <p>
            An area presenting the smallest increase (or a decrease in value) over time of the selected indicator is classified as being <i>the least performing</i>. An area presenting the highest increase over time of the selected indicator is classified as being <i>the highest performing</i>.
        </p>

        <b>For indicators where a decrease in the value means improvement over time</b>
        <p>
            An area presenting the highest decrease over time of the selected indicator is classified as being <i>the highest performing</i>. An area presenting the smallest decrease over time of the selected indicator (or an increase in value) is classified as being <i>the least performing</i>.
        </p>
    </div>
)

const askColorBar = (
    <div>
        <blockquote>
            Irrespective of the direction of each indicator, the legend displays a better condition (improvement over time when looking at time change) in blue, and a worse condition (worsening over time when looking at time change) in red. For example, 
            <ul>
                <li> increasing value meaning better condition like % of contraceptive prevalence </li>
                <li> increasing value meaning worse condition like % of low birth weight </li>
            </ul>
        </blockquote>
    </div>
)

const askChangeN = (
    <div>
        <p>
            The values shown on the map are our "best guess" given the data and modelling but as with any statistics there are a range of plausible values.
        </p>
        <p>
            The user can choose the probability that there is meaningful improvement or worsening. The map filters out units where it is unlikely that there have been meaningful improvements.
        </p>
        <Illustration/>

        <b>Technical:</b>
        <p>
            The <i>exceedance probability</i> is the probability, given the observed data, that the true change in a district is negative for improvement or positive for worsening.
        </p>
        <p>
            We use that to filter which districts to show on the map. Districts where the exceedance probability is less than the selected limit will be filtered out.
        </p>
        <hr/>
        {/*Find out more on the <a href='#technote-2' target='_blank'>Technical Note 2</a> page.*/}
    </div>
)

const askChangeP = (
    <div>
        <p>
            The values shown on the map are our "best guess" given the data and modelling but as with any statistics there are a range of plausible values.
        </p>
        <p>
            The user can choose the probability that there is meaningful improvement or worsening. The map filters out units where it is unlikely that there have been meaningful improvements.
        </p>
        <Illustration/>

        <b>Technical:</b>
        <p>
            The <i>exceedance probability</i> is the probability, given the observed data, that the true change in a district is positive for improvement or negative for worsening.
        </p>
        <p>
            We use that to filter which districts to show on the map. Districts where the exceedance probability is less than the selected limit will be filtered out.
        </p>
        <hr/>
        {/*Find out more on the <a href='#technote-2' target='_blank'>Technical Note 2</a> page.*/}
    </div>
)

const askBoundaries = (
    <div>
        <p>
            While the surveys were designed to be representative at the district level, caution is advised in interpreting and utilizing the findings due to the inherent limitations posed by small sample sizes for the mentioned indicators. Furthermore, it is important to note that the indicators discussed herein are rare events, further emphasizing the need for careful consideration and caution in their interpretation, given the limited sample sizes at the district level.
        </p>
        <p>
            See <a href='#tech-note-1' target='_blank'>Technical Note 1</a> from round 1 (NFHS-4) to round 2 (NFHS-5) and national official boundaries to enable over time comparisons.
        </p>
    </div>
)

const askChildWorker = (
    <div>
        Since census boundaries aligned with NFHS-4 boundaries, the same two-step approached as described in the <a href='#tech-note-1'>Technical Note 1</a> was applied.
    </div>
)

function Illustration(){
    const [show,setShow] = useState(false)
    function handleShow(){setShow(true)}
    function handleHide(){setShow(false)}

    return (
        <div className="text-center m-0 p-0 mb-2">
            <Button variant='danger' size='sm' onClick={handleShow}>Illustration</Button>

            <Modal show={show} onHide={handleHide} size='lg'>
                <Modal.Header closeButton><h4>Illustration</h4></Modal.Header>
                <Modal.Body>
                    <p>
                        How <b>certain</b> are we with the changes? <br/>
                        Example: Change defined as ANC4 (R2) - ANC4 (R1) for Kwale, Kenya.
                    </p>

                    <img alt='exceedance' src={exceedance} width='100%'/>

                    <p className="mt-3">
                        We have varying levels of certainty regarding improvements in different sub-counties. As we move from panels (a) to (c), we see fewer colored sub-counties showing meaningful improvements. For example, without filtering (panel a), we observe ANC4 coverage improvements in <i>Msambweni</i> (circled in <mark style={{color:'red'}}>red</mark>) and <i>Lunga Lunga</i> (circled in <mark style={{color:'orange'}}>orange</mark>). However, with a 95% certainty filter (panel b), we cannot be highly certain that there is an improvement in <i>Msambweni</i>, and with a 99% certainty filter (panel c), we cannot be almost certain that there is an improvement in <i>Lunga Lunga</i>. Further detail can be found in the Technical Note 2.
                    </p>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export function MoreInfo({ content }){
    const overlay = (
        <Popover>
            <Popover.Body><div dangerouslySetInnerHTML={{__html:content}}></div></Popover.Body>
        </Popover>
    )

    return (
        <OverlayTrigger trigger={'click'} placement='bottom-start' overlay={overlay}>
            <span className='mx-1' title={'Click for more'}><BsInfoCircleFill/></span>
        </OverlayTrigger>
    )
}

export function Ask({ about, positive=true, placement='auto-start'}){
    const askAbout = {
        'How to read table': askTable,
        'About this color bar': askColorBar,
        'NNote on the change certainty': askChangeN,
        'Note on the change certainty': askChangeP,
        'Note on changing boundaries': askBoundaries,
        'Note on census boundaries': askChildWorker
    }
    const content = positive ? askAbout[about] : askAbout['N'+about]

    const overlay = (
        <Popover>
            <Popover.Header>{about}</Popover.Header>
            <Popover.Body>{content}</Popover.Body>
        </Popover>
    )

    return (
        <OverlayTrigger trigger={'click'} placement={placement} overlay={overlay}>
            <span className='mx-1' title={about}><BsQuestionCircleFill/></span>
        </OverlayTrigger>
    )
}