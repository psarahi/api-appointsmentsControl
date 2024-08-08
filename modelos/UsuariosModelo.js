const mongosee = require('mongoose');
const moment = require('moment');
const jwt = require('jsonwebtoken');
moment.locale('es');

const usuarioSchema = new mongosee.Schema({

    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        trim: true,
        required: true,
        unique: true
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
    empresa: {
        type: String
    },
    lugar: {
        type: String,
        required: true
    },
    fechaRegistro: {
        type: Date,
        default: moment().format("YYYY-MM-DD HH:mm:ss")
    },
    perfiles: {
        type: mongosee.Schema.Types.ObjectId,
        ref: 'perfiles',
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

usuarioSchema.methods.generarJWT = () => {

    return jwt.sign({
        id: this._id,
        nombre: this.nombre,
        apellido: this.apellido,
        usuario: this.usuario,
        idCuenta: this._id,
        fecha: this.fechaRegistro,
        perfil: this.perfiles,
        token: '',
        menu: obtenerMenu(this.perfiles)
    }, process.env.KEY_API_JWT);
};

const Usuario = mongosee.model('usuarios', usuarioSchema);

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