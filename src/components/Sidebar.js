import React from 'react'

import {} from 'react-icons/io'
import { MdHome, MdAssessment, MdTask} from 'react-icons/md'

export const Sidebardata = [
    {
        title: 'Inicio',
        path:'/',
        icon: <MdHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Pedidos',
        path:'/pedidos',
        icon: <MdAssessment/>,
        cName: 'nav-text'
    },
    {
        title: 'Finalizados',
        path:'/finalizados',
        icon: <MdTask/>,
        cName: 'nav-text'
    },
]