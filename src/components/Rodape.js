import React from "react";
import { Navbar} from "react-bootstrap";
import './Rodape.css'

import {MdAssessment} from 'react-icons/md'

const Rodape = () =>{
    return(
        <Navbar className="Rodape" bg="#060b26" fixed="bottom">
        <Navbar.Brand className="text-light" >
           <MdAssessment/>  ControlOrder &copy; - Todos os direitos reservados
        </Navbar.Brand>
    </Navbar>
    )
}

export default Rodape