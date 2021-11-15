import React from "react";
import { HashRouter, Switch, Route } from 'react-router-dom'


import Inicio from '../pages/Inicio'
import Pedidos from '../pages/Pedidos'
import Finalizados from '../pages/Finalizados'

export default function Rotas(){
    return(
        <HashRouter>
            <Switch>
                <Route exact path="/" component={Inicio}/>
                <Route exact path="/Pedidos" component={Pedidos}/>    
                <Route exact path="/Finalizados" component={Finalizados}/>     
            </Switch>
        </HashRouter>
    )
}