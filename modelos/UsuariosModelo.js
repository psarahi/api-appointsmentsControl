const mongoose = require('mongoose');
const moment = require('moment');
const jwt = require('jsonwebtoken');
moment.locale('es');

const usuarioSchema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    sucursales: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sucursales',
        required: true 
    },
    fechaRegistro: {
        type: Date,
        default: moment().format("YYYY-MM-DD HH:mm:ss")
    },
    estado: {
        type: Boolean,
        default: true
    }
});

const Usuario = mongoose.model('usuarios', usuarioSchema);

function obtenerMenu(perfil) {
    console.log(perfil, 'Perfil');
    var menu;
    if (perfil != '5e8e222fce7ae6c0d4926b88') {
        menu = [{
                titulo: 'Tablero',
                icon: 'dashboard',
                submenu: [{
                        titulo: 'Actividad',
                        url: '/actividadActiva'
                    },
                    {
                        titulo: 'Calendario',
                        url: '/dashboard'
                    },
                    {
                        titulo: 'Asiganciones',
                        url: '/asinacion'
                    },
                ]
            },
            {
                titulo: 'Reportes',
                icon: 'bar-chart',
                submenu: [{
                        titulo: 'Diario',
                        url: '/reporteDiarioAdmin'
                    },
                    {
                        titulo: 'Detalle por miembros',
                        url: '/reportePorMiembro'
                    },
                    // { titulo: 'Tus Proyectos', url: '/proyecto' }
                ]
            },
            {
                titulo: 'Mantenimiento',
                icon: 'tool',
                submenu: [{
                        titulo: 'Tus Miembros',
                        url: '/equipo'
                    },
                    {
                        titulo: 'Tus Actividades',
                        url: '/actividades'
                    },
                    {
                        titulo: 'Tus Proyectos',
                        url: '/proyecto'
                    }
                ]
            }
        ];
    } else {

        menu = [{
                titulo: 'Tablero',
                icon: 'dashboard',
                submenu: [{
                        titulo: 'Actividad',
                        url: '/actividadActiva'
                    },
                    {
                        titulo: 'Calendario',
                        url: '/dashboard'
                    },
                    {
                        titulo: 'Asiganciones',
                        url: '/asinacion'
                    },
                ]
            },
            {
                titulo: 'Reportes',
                icon: 'bar-chart',
                submenu: [{
                        titulo: 'Diario',
                        url: '/reporteDiario'
                    },
                    // { titulo: 'Tus Actividades', url: '/actividades' },
                    // { titulo: 'Tus Proyectos', url: '/proyecto' }
                ]
            },
        ];
    }


    return menu;
}

module.exports = Usuario;