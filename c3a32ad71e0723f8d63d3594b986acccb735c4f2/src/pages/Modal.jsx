import { useState } from "react"
import { Modal } from "react-bootstrap"
import { BsPrinterFill, BsCloudDownloadFill, BsArrowsFullscreen } from "react-icons/bs"

function Print({ element }){
  const [show,setShow] = useState(false)
  function handleShow(){setShow(true)}
  function handleHide(){setShow(false)}

  return (
    <div className="text-center m-0 p-0 mb-2">
      <span className='mx-1' title='Print' onClick={handleShow}><BsPrinterFill/></span>

      <Modal show={show} onHide={handleHide} size='lg'>
        <Modal.Header closeButton><h4>Print Map</h4></Modal.Header>
        <Modal.Body>
          Body
        </Modal.Body>
      </Modal>
  </div>
  )
}

function Download({ element }){
  const [show,setShow] = useState(false)
  function handleShow(){setShow(true)}
  function handleHide(){setShow(false)}

  return (
    <div className="text-center m-0 p-0 mb-2">
      <span className='mx-1' title='Download Data' onClick={handleShow}><BsCloudDownloadFill/></span>

      <Modal show={show} onHide={handleHide} size='lg'>
        <Modal.Header closeButton><h4>Download Data</h4></Modal.Header>
        <Modal.Body>
          Body
        </Modal.Body>
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
      <span className='mx-1' title='Fullscreen' onClick={handleShow}><BsArrowsFullscreen/></span>

      <Modal show={show} onHide={handleHide} fullscreen={true}>
        <Modal.Header closeButton>{title}</Modal.Header>
        <Modal.Body>
          {element}
        </Modal.Body>
      </Modal>
  </div>
  )
}

export function ToolBar({element, title}){
  return (
    <div className='row m-0 p-0'>
      <div className='col-sm'>
        <div className='row float-end'>
          <div className='m-0 p-0 px-1 col'>
            <Print element={<></>}/>
          </div>
          <div className='m-0 p-0 px-1 col'>
            <Download element={<></>}/>
          </div>
          <div className='m-0 p-0 px-1 col'>
            <FullMap element={element} title={title}/>
          </div>
        </div>
      </div>
    </div>
  )
}