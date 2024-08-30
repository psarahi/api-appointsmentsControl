const mongosee = require('mongoose');
const moment = require('moment');
moment.locale('es');

const clienteSchema = new mongosee.Schema({

    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    fechaRegistro: {
        type: Date,
        default: moment().subtract(6,'hour').format("YYYY-MM-DD HH:mm:ss")
    },
    ultimaCita: {
        type: Date,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
});

const Usuario = mongosee.model('cliente', clienteSchema);

module.exports = Usuario;


/**
Columnas 
aggregable: false
disableExport:true
display:"flex"
field:"avatar"
filterable:false
generateData:() => {…}
groupable:false
headerName:"Avatar"
hide:true 

Rows
avatar:"#f44336"
city:"Onhetef"
company:"Marsh & McLennan Companies Inc."
country:{value: 'KN', code: 'KN', label: 'Saint Kitts and Nevis', phone: '1-869'}
dateCreated:Mon Mar 04 2024 04:54:47 GMT-0600 (hora estándar central) {}
email:"hehok@atako.sh"
id:"dc87d93e-5c2f-530b-bb8e-5223db7aaded"
isAdmin:false
lastUpdated:Mon Aug 26 2024 10:14:46 GMT-0600 (hora estándar central) {}
name:"Norman Chambers"
phone:"(961) 964-1946"
position:"Dancer"
rating:5
salary:77230
username:"@zifvovza"
website:
"http://laz.sd/avozojada"



 */