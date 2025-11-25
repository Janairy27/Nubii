import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Grid,
  Container,
  Paper,
  InputAdornment,
  IconButton,
  Slider

} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ArrowBackIosNewOutlined,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import AddBoxIcon from '@mui/icons-material/AddBox';
import LoginIcon from '@mui/icons-material/Login';

export default function Registro() {
  const [form, setForm] = useState({
    nombre: "",
    apaterno: "",
    amaterno: "",
    fecha_nacimiento: null, // Date en lugar de string
    sexo: "",
    telefono: "",
    email: "",
    curp: "",
    estado: "",
    municipio: "",
    calle: "",
    tipo_usuario: 3, // por defecto paciente
    contrasena: "",
    confirmar_contrasena: "",
    nivel_estres_base: 5,
    especialidad: "",
    cedula: "",
  });

  // Estados y municipios
  const estados = [
    { id: "Aguascalientes", nombre: "Aguascalientes" },
    { id: "Baja California", nombre: "Baja California" },
    { id: "Baja California Sur", nombre: "Baja California Sur" },
    { id: "Campeche", nombre: "Campeche" },
    { id: "Coahuila", nombre: "Coahuila" },
    { id: "Colima", nombre: "Colima" },
    { id: "Chiapas", nombre: "Chiapas" },
    { id: "Chihuahua", nombre: "Chihuahua" },
    { id: "Ciudad de México", nombre: "Ciudad de México" },
    { id: "Durango", nombre: "Durango" },
    { id: "Guanajuato", nombre: "Guanajuato" },
    { id: "Guerrero", nombre: "Guerrero" },
    { id: "Hidalgo", nombre: "Hidalgo" },
    { id: "Jalisco", nombre: "Jalisco" },
    { id: "Estado de México", nombre: "Estado de México" },
    { id: "Michoacán", nombre: "Michoacán" },
    { id: "Morelos", nombre: "Morelos" },
    { id: "Nayarit", nombre: "Nayarit" },
    { id: "Nuevo León", nombre: "Nuevo León" },
    { id: "Oaxaca", nombre: "Oaxaca" },
    { id: "Puebla", nombre: "Puebla" },
    { id: "Querétaro", nombre: "Querétaro" },
    { id: "Quintana Roo", nombre: "Quintana Roo" },
    { id: "San Luis Potosí", nombre: "San Luis Potosí" },
    { id: "Sinaloa", nombre: "Sinaloa" },
    { id: "Sonora", nombre: "Sonora" },
    { id: "Tabasco", nombre: "Tabasco" },
    { id: "Tamaulipas", nombre: "Tamaulipas" },
    { id: "Tlaxcala", nombre: "Tlaxcala" },
    { id: "Veracruz", nombre: "Veracruz" },
    { id: "Yucatán", nombre: "Yucatán" },
    { id: "Zacatecas", nombre: "Zacatecas" },

  ];

  const municipios = {
    Aguascalientes: ["Aguascalientes", "Asientos", "Calvillo", "Cosío", "Jesús María", "Pabellón de Arteaga", "Rincón de Romos", "San José de Gracia", "Tepezalá", "El Llano", "San Francisco de los Romo"],
    "Baja California": ["Ensenada", "Mexicali", "Playa Rosarito", "San Felipe", "San Quintín", "Tecate", "Tijuana"],
    "Baja California Sur": ["Comondú", "La Paz", "Loreto", "Los Cabos", "Mulegé"],
    Campeche: ["Calakmul", "Calkiní", "Campeche", "Candelaría", "Carmen", "Champotón", "Dzitbalché", "Escárcega", "Hecelchakán", "Hopelchén", "Palizada", "Seybaplaya", "Tenabo"],
    Coahuila: ["Abasolo", "Acuña", "Allende", "Arteaga", "Candela", "Castaños", "Cuatrociénegas", "Escobedo", "Francisco I. Madero", "Frontera", "General Cepeda", "Guerrero", "Hidalgo", "Jiménez", "Juárez", "Lamadrid", "Matamoros", "Monclova", "Morelos", "Múzquiz", "Nadadores", "Nava", "Ocampo", "Parras de la Fuente", "Piedras Negras", "Progreso", "Ramos Arizpe", "Sabinas", "Sacramento", "Saltillo", "San Buenaventura", "San Juan de Sabinas", "San Pedro de las Colonias", "Sierra Mojada", "Torreón", "Viesca", "Villa Unión", "Zaragoza"],
    Colima: ["Armería", "Colima", "Comala", "Coquimatlán", "Cuauhtémoc", "Ixtlahuacán", "Manzanillo", "Minatitlán", "Tecomán", "Villa de Álvarez"],
    Chiapas: ["Acala", "Acapetahua", "Aldama", "Altamirano", "Amatenango de la Frontera", "Amatenango del Valle", "Amatán", "Arriaga", "Acacoyagua", "Bejucal de Ocampo", "Bella Vista", "Benemérito de las Américas", "Berriozábal", "Bochil", "Cacahoatán", "Calakmul", "Candelaria", "Catazajá", "Chalchihuitán", "Chamula", "Chanal", "Chapultenango", "Chenalhó", "Chiapa de Corzo", "Chiapilla", "Chicoasén", "Chicomuselo", "Chicozapan", "Chilón", "Cintalapa", "Coapilla", "Comitán de Domínguez", "Copainalá", "El Bosque", "El Porvenir", "Escuintla", "Francisco León", "Frontera Comalapa", "Frontera Hidalgo", "Huehuetán", "Huitiupán", "Huixtla", "Huixtán", "Ixhuatán", "Ixtacomitán", "Ixtapa", "Ixtapangajoya", "Jiquipilas", "Jitotol", "Juárez", "La Concordia", "La Grandeza", "La Libertad", "La Trinitaria", "Larráinzar", "Las Margaritas", "Las Rosas", "Mapastepec", "Maravilla Tenejapa", "Marqués de Comillas", "Mazapa de Madero", "Mazatán", "Metapa", "Mitontic", "Montecristo de Guerrero", "Motozintla", "Nicolás Ruíz", "Ocosingo", "Ocotepec", "Ocozocoautla de Espinosa", "Ostuacán", "Osumacinta", "Oxchuc", "Palenque", "Pantelhó", "Pantepec", "Pichucalco", "Pijijiapan", "Pueblo Nuevo Solistahuacán", "Rayón", "Reforma", "Sabanilla", "Salto de Agua", "San Andrés Duraznal", "San Cristóbal de las Casas", "San Fernando", "San Juan Cancuc", "San Lucas", "San Pedro Chenalhó", "Siltepec", "Simojovel", "Sitalá", "Socoltenango", "Solosuchiapa", "Soyaló", "Suchiapa", "Suchiate", "Tapachula", "Tapalapa", "Tecpatán", "Tenejapa", "Teopisca", "Tila", "Tonalá", "Totolapa", "Tumbalá", "Tuxtla Gutiérrez", "Tuxtla Chico", "Tuzantán", "Tzimol", "Unión Juárez", "Venustiano Carranza", "Villa Corzo", "Villaflores", "Yajalón", "Zinacantán", "Ángel Albino Corzo"],
    Chihuahua: ["Ahumada", "Aldama", "Allende", "Aquiles Serdán", "Ascensión", "Bachíniva", "Balleza", "Batopilas", "Bocoyna", "Buenaventura", "Camargo", "Carichí", "Casas Grandes", "Chihuahua", "Chínipas", "Coronado", "Coyame del Sotol", "Cuauhtémoc", "Cusihuiriachi", "Delicias", "Dr. Belisario Domínguez", "El Tule", "Galeana", "Gómez Farías", "Gran Morelos", "Guachochi", "Guadalupe", "Guadalupe y Calvo", "Guazapares", "Guerrero", "Hidalgo del Parral", "Huejotitán", "Ignacio Zaragoza", "Janos", "Jiménez", "Juárez", "Julimes", "La Cruz", "López", "Madera", "Maguarichi", "Manuel Benavides", "Matachí", "Matamoros", "Meoqui", "Morelos", "Moris", "Namiquipa", "Nonoava", "Nuevo Casas Grandes", "Ocampo", "Ojinaga", "Praxedis G. Guerrero", "Riva Palacio", "Rosales", "Rosario", "San Francisco de Borja", "San Francisco de Conchos", "San Francisco del Oro", "Santa Bárbara", "Santa Isabel", "Satevó", "Saucillo", "Temósachic", "Urique", "Uruachi", "Valle de Zaragoza"],
    "Ciudad de México": ["Álvaro Obregón", "Azcapotzalco", "Benito Juárez", "Coyoacán", "Cuajimalpa de Morelos", "Cuauhtémoc", "Gustavo A. Madero", "Iztacalco", "Iztapalapa", "La Magdalena Contreras", "Miguel Hidalgo", "Milpa Alta", "Tláhuac", "Tlalpan", "Venustiano Carranza", "Xochimilco"],
    Durango: ["Canatlán", "Canelas", "Coneto de Comonfort", "Cuencamé", "Durango", "El Oro", "General Simón Bolívar", "Gómez Palacio", "Guadalupe Victoria", "Guanaceví", "Hidalgo", "Indé", "Lerdo", "Mapimí", "Mezquital", "Nazas", "Nombre de Dios", "Nuevo Ideal", "Ocampo", "Otáez", "Pánuco de Coronado", "Peñón Blanco", "Poanas", "Pueblo Nuevo", "Rodeo", "San Bernardo", "San Dimas", "San Juan de Guadalupe", "San Juan del Río", "San Luis del Cordero", "San Pedro del Gallo", "Santa Clara", "Santiago Papasquiaro", "Súchil", "Tamazula", "Tepehuanes", "Tlahualilo", "Topia", "Vicente Guerrero"],
    Guanajuato: ["Abasolo", "Acámbaro", "Allende", "Apaseo el Alto", "Apaseo el Grande", "Atarjea", "Celaya", "Comonfort", "Coroneo", "Cortazar", "Cuerámaro", "Doctor Mora", "Dolores Hidalgo", "Guanajuato", "Huanímaro", "Irapuato", "Jaral del Progreso", "Jerécuaro", "León", "Manuel Doblado", "Moroleón", "Ocampo", "Pénjamo", "Pueblo Nuevo", "Purísima del Rincón", "Romita", "Salamanca", "Salvatierra", "San Diego de la Unión", "San Felipe", "San Francisco del Rincón", "San José Iturbide", "San Luis de la Paz", "San Miguel de Allende", "Santa Catarina", "Santa Cruz de Juventino Rosas", "Santiago Maravatío", "Silao de la Victoria", "Tarandacuao", "Tarimoro", "Tierra Blanca", "Uriangato", "Valle de Santiago", "Victoria", "Villagrán", "Xichú", "Yuriria"],
    Guerrero: ["Acapulco de Juárez", "Ahuacuotzingo", "Ajuchitlán del Progreso", "Alcozauca de Guerrero", "Alpoyeca", "Apaxtla", "Arcelia", "Atenango del Río", "Atlamajalcingo del Monte", "Atlixtac", "Atoyac de Álvarez", "Ayutla de los Libres", "Azoyú", "Benito Juárez", "Buenavista de Cuéllar", "Coahuayutla de José María Izazaga", "Cocula", "Copala", "Copalillo", "Copanatoyac", "Coyuca de Benítez", "Coyuca de Catalán", "Cuajinicuilapa", "Cualác", "Cuautepec", "Cuetzala del Progreso", "Cutzamala de Pinzón", "Chilapa de Álvarez", "Chilpancingo de los Bravo", "Florencio Villarreal", "General Canuto A. Neri", "General Heliodoro Castillo", "Huamuxtitlán", "Huitzuco de los Figueroa", "Iguala de la Independencia", "Igualapa", "Ixcateopan de Cuauhtémoc", "Zihuatanejo de Azueta", "Juan R. Escudero", "Leonardo Bravo", "Malinaltepec", "Mártir de Cuilapan", "Metlatónoc", "Mochitlán", "Olinalá", "Ometepec", "Pedro Ascencio Alquisiras", "Petatlán", "Pilcaya", "Ciudad Altamirano", "Quechultenango", "San Luis Acatlán", "San Marcos", "San Miguel Totolapan", "Taxco de Alarcón", "Tecoanapa", "Tecpan de Galeana", "Teloloapan", "Tepecoacuilco de Trujano", "Tetipac", "Tixtla de Guerrero", "Tlacoachistlahuaca", "Tlacoapa", "Tlalchapa", "Tlalixtaquilla de Maldonado", "Tlapa de Comonfort", "Tlapehuala", "Tomellín", "La Unión de Isidoro Montes de Oca", "Xalpatláhuac", "Xochihuehuetlán", "Xochistlahuaca", "Zapotitlán Tablas", "Zirándaro", "Zitlala", "Eduardo Neri", "Acatepec", "Marquelia", "Cochoapa el Grande", "José Joaquín de Herrera", "Juchitán", "Iliatenco", "Las Vigas", "San Nicolás", " Ñuu Savi", "Santa Cruz del Rincón"],
    Hidalgo: ["Acatlán", "Acaxochitlán", "Actopan", "Agua Blanca de Iturbide", "Ajacuba", "Alfajayucan", "Almoloya", "Apan", "El Arenal", "Atitalaquia", "Atlapexco", "El Arenal", "Atotonilco de Tula", "Calnali", "Cardonal", "Cuautepec de Hinojosa", "Chapantongo", "Chapulhuacán", "Chilcuautla", "Eloxochitlán", "Emiliano Zapata", "Epazoyucan", "Francisco I. Madero", "Huasca de Ocampo", "Huautla", "Huazalingo", "Huehuetla", "Huejutla de Reyes", "Huichapan", "Ixmiquilpan", "Jacala de Ledezma", "Jaltocán", "Juárez Hidalgo", "Lolotla", "Metepec", "Metztitlán", "Mineral del Chico", "Mineral del Monte", "La Misión", "Mixquiahuala de Juárez", "Molango de Escamilla", "Nicolás Flores", "Nopala de Villagrán", "Omitlán de Juárez", "San Agustín Metzquititlán", "San Bartolo Tutotepec", "San Felipe Orizatlán", "Pacula", "Pachuca de Soto", "Pisaflores", "Progreso de Obregón", "Mineral de la Reforma", "San Agustín Tlaxiaca", "San Salvador", "Santiago de Anaya", "Santiago Tulantepec de Lugo Guerrero", "Singuilucan", "Tasquillo", "Tecozautla", "Tenango de Doria", "Tepeapulco", "Tepehuacán de Guerrero", "Tepeji del Río de Ocampo", "Tepetitlán", "Tetepango", "Villa de Tezontepec", "Tezontepec de Aldama", "Tianguistengo", "Tizayuca", "Tlahuelilpan", "Tlahuiltepa", "Tlanalapa", "Tlanchinol", "Tlaxcoapan", "Tolcayuca", "Tula de Allende", "Tulancingo de Bravo", "Xochiatipan", "Xochicoatlán", "Yahualica", "Zacualtipán de Ángeles", "Zapotlán de Juárez", "Zempoala", "Zimapán"],
    Jalisco: ["Acatic", "Acatlán de Juárez", "Ahualulco de Mercado  ", "Amacueca", "Amatitán", "Ameca", "Arandas", "Atemajac de Brizuela", "Atengo", "Atenguillo", "Atotonilco el Alto", "Atoyac", "Autlán de Navarro", "Ayotlán", "Ayutla", "Bolaños", "Cabo Corrientes", "Casimiro Castillo", "Cañadas de Obregón", "Chapala", "Chimaltitán", "Chiquilistlán", "Cihuatlán", "Ciudad Guzmán", "Cocula", "Colotlán", "Concepción de Buenos Aires", "Cuautitlán de García Barragán", "Cuautla", "Cuquío", "Degollado", "Ejutla", "El Arenal", "El Grullo", "El Limón", "El Salto", "Encarnación de Díaz", "Etzatlán", "Gómez Farías", "Guachinango", "Guadalajara", "Hostotipaquillo", "Huejúcar", "Huejuquilla el Alto", "Ixtlahuacán de los Membrillos", "Ixtlahuacán del Río", "Jalostotitlán", "Jamay", "Jesús María", "Jilotlán de los Dolores", "Jocotepec", "Juanacatlán", "Juchitlán", "Lagos de Moreno", "La Barca ", "La Huerta", "La Manzanilla de la Paz", "Lagos de Moreno", "Magdalena", "Mascota", "Mazamitla", "Mexticacán", "Mezquitic", "Mixtlán", "Ocotlán", "Ojuelos de Jalisco", "Pihuamo", "Poncitlán", "Puerto Vallarta", "Quitupan", "San Cristóbal de la Barranca", "San Diego de Alejandría", "San Gabriel", "San Ignacio Cerro Gordo", "San Juan de los Lagos", "San Juanito Escobedo", "San Julián", "San Marcos", "San Martín de Bolaños", "San Martín Hidalgo", "San Miguel el Alto", "San Pedro Tlaquepaque", "San Sebastián del Oeste", "Santa María de los Ángeles", "Santa María del Oro", "Sayula", "Tala", "Talpa de Allende", "Tamazula de Gordiano", "Tapalpa", "Tecalitlán", "Techaluta de Montenegro", "Tecolotlán", "Tenamaxtlán", "Teocaltiche", "Teocuitatlán de Corona", "Tepatitlán de Morelos", "Tequila", "Teuchitlán", "Tizapán el Alto", "Tlajomulco de Zúñiga", "Tolimán", "Tonalá", "Tomatlán", "Tonaya", "Tonila", "Totatiche", "Tototlán", "Tuxcacuesco", "Tuxcueca", "Tuxpan", "Unión de San Antonio", "Unión de Tula", "Valle de Guadalupe ", "Valle de Juárez ", "Villa Corona ", "Villa Guerrero ", "Villa Hidalgo ", "Villa Purificación", "Yahualica de González Gallo ", "Zacoalco de Torres ", "Zapopan ", "Zapotiltic ", "Zapotitlán de Vadillo ", "Zapotlanejo ", "Zapotlán del rey", "Zapotlán el Grande"],
    "Estado de México": ["Acambay de Ruíz Castañeda", "Acolman", "Aculco", "Almoloya de Alquisiras", "Almoloya de Juárez", "Almoloya del Río", "Amanalco", "Amatepec", "Amecameca", "Apaxco", "Atenco", "Atizapán", "Atizapán de Zaragoza", "Atlacomulco", "Atlautla", "Axapusco", "Ayapango", "Calimaya", "Capulhuac", "Coacalco de Berrizábal", "Coatepec Harinas", "Cocotitlán", "Coyotepec", "Cuatitlán", "Cuatitlán Izacalli", "Chalco", "Chapa de Mota", "Chapultepec", "Chiautla", "Chicoloapan", "Chiconcuac", "Chimalhuacán", "Donato Guerra", "Ecatepec de Morelos", "Ecatzingo", "El Oro", "Huehuetoca", "Hueypoxtla", "Huixquilucan", "Isidro Fabela", "Ixtapaluca", "Ixtapan de la Sal", "Ixtapan del Oro", "Ixtlahuaca", "Jaltenco", "Jilotepec", "Jilotzingo", "Jiquipilco", "Jocotitlán", "Joquicingo", "Juchitepec", "La Paz ", "Lerma ", "Luvianos ", "Malinalco ", "Melchor Ocampo ", "Metepec ", "Mexicaltzingo ", "Morelos ", "Naucalpan de Juárez ", "Nezahualcóyotl ", "Nextlalpan ", "Nicolás Romero ", "Nopaltepec ", "Ocoyoacac ", "Ocuilan ", "Otumba ", "Otzoloapan ", "Otzolotepec ", "Ozumba ", "Papalotla ", "Polotitlán ", "Rayón ", "San Antonio la Isla ", "San Felipe del Progreso ", "San Martín de las Pirámides ", "San Mateo Atenco ", "San Simón de Guerrero ", "Santo Tomás ", "Soyaniquilpan de Juárez ", "Sultepec ", "Tecámac ", "Tejupilco ", "Temamatla ", "Temascalapa ", "Temascalcingo ", "Temascaltepec", "Temoaya ", "Tenancingo ", "Tenango del Aire ", "Tenango del Valle ", "Teoloyucan ", "Teotihuacán de Arista ", "Tepetlaoxtoc ", "Tepetlixpa ", "Tepotzotlán ", "Tequixquiac ", "Texcoco ", "Tezoyuca ", "Tianguistenco ", "Timilpan ", "Tlalmanalco ", "Tlalnepantla de Baz ", "Toluca ", "Tonatico ", "Tultepec ", "Tultitlán ", "Valle de Bravo ", "Villa de Allende ", "Villa del Carbón ", "Villa Guerrero ", "Villa Victoria ", "Xonacatlán ", "Zacazonapan ", "Zacualpan ", "Zinacantepec ", "Zumpahuacán ", "Zumpango", "Valle de Chalco Solidaridad", "San José del Rincón", "Tonanitla"],
    Michoacán: ["Acuitzio", "Aguililla", "Álvaro Obregón", "Angamacutiro", "Angangueo", "Apatzingán", "Aporo", "Aquila", "Ario", "Arteaga", "Briseñas", "Buenavista", "Carácuaro", "Charapan", "Charo", "Chavinda", "Cherán", "Chilchota", "Chinicuila", "Chucándiro", "Churintzio", "Churumuco", "Coahuayana", "Coalcomán de Vázquez Pallares", "Coeneo", "Contepec", "Copándaro", "Cotija", "Cuitzeo", "Ecuandureo", "Epitacio Huerta", "Erongarícuaro", "Gabriel Zamora", "Hidalgo", "La Huacana", "Huandacareo", "Huaniqueo", "Huetamo", "Huiramba", "Indaparapeo", "Irimbo", "Ixtlán", "Jacona", "Jiménez", "Jiquilpan", "José Sixto Verduzco", "Juárez", "Jungapeo", "Lagunillas", "Madero", "Maravatío", "Marcos Castellanos", "Lázaro Cárdenas", "Morelia", "Morelos", "Múgica", "Nahuatzen", "Nocupétaro", "Nuevo Parangaricutiro", "Nuevo Urecho", "Numarán", "Ocampo", "Pajacuarán", "Panindícuaro", "Parácuaro", "Paracho", "Pátzcuaro", "Penjamillo", "Peribán", "La Piedad", "Purépero", "Puruándiro", "Queréndaro", "Quiroga", "Cojumatlán de Régules", "Los Reyes", "Sahuayo", "San Lucas", "Santa Ana Maya", "Salvador Escalante", "Senguio", "Susupuato", "Tacámbaro", "Tancítaro", "Tangamandapio", "Tangancícuaro", "Tanhuato", "Taretan", "Tarímbaro", "Tepalcatepec", "Tingambato", "Tingüindín", "Tiquicheo de Nicolás Romero", "Tlalpujahua", "Tlazazalca", "Tocumbo", "Tumbiscatío", "Turicato", "Tuxpan", "Tuxtla", "Tuzantla", "Tzintzuntzan", "Tzitzio", "Uruapan", "Venustiano Carranza", "Villamar", "Vista Hermosa", "Yurécuaro", "Zacapu", "Zamora de Hidalgo", "Zináparo", "Zinapécuaro", "Ziracuaretiro", "Zitácuaro"],
    Morelos: ["Amacuzac", "Atlatlahucan", "Axochiapan", "Ayala", "Coatlán del Río", "Cuautla", "Cuernavaca", "Emiliano Zapata", "Huitzilac", "Jantetelco", "Jiutepec", "Jojutla", "Jonacatepec", "Mazatepec", "Miacatlán", "Ocuituco", "Puente de Ixtla", "Temixco", "Tepalcingo", "Tepoztlán", "Tetecala", "Tetela del Volcán", "Tlalnepantla", "Tlaltizapán de Zapata", "Tlaquiltenango", "Tlayacapan", "Totolapan", "Xochitepec", "Yautepec", "Yecapixtla", "Zacatepec", "Zacualpan de Amilpas", "Coatetelco", "Hueyapan"],
    Nayarit: ["Ahuacatlán", "Amatlán de Cañas", "Bahía de Banderas", "Compostela", "Ixtlán del Río", "Jala", "Xalisco", "Del Nayar", "Rosamorada", "Ruíz", "San Blas", "San Pedro Lagunillas", "Santa María del Oro", "Santiago Ixcuintla", "Tecuala", "Tepic"],
    "Nuevo León": ["Abasolo", "Agualeguas", "Allende", "Anáhuac", "Apodaca", "Aramberri", "Bustamante", "Cadereyta Jiménez", "Carmen", "Cerralvo", "China", "Ciénega de Flores", "Doctor Arroyo", "Doctor Coss", "Doctor González", "García", "General Bravo", "General Escobedo", "General Terán", "General Treviño", "General Zaragoza", "Guadalupe", "Los Herreras", "Higueras", "Hualahuises", "Iturbide", "Juárez", "Lampazos de Naranjo", "Linares", "Marín", "Melchor Ocampo", "Mier y Noriega", "Mina", "Montemorelos", "Monterrey", "Parás", "Pesquería", "Los Ramones", "Rayones", "Sabinas Hidalgo", "Salinas Victoria", "San Nicolás de los Garza", "Hidalgo", "Santa Catarina", "Santiago", "Vallecillo", "Villaldama"],

    Oaxaca: ["Abejones", "Acatlán de Pérez Figueroa", "Ánimas Trujano", "Asunción Cacalotepec", "Asunción Cuyotepeji", "Asunción Ixtaltepec", "Asunción Nochixtlán", "Asunción Ocotlán", "Asunción Tlacolulita", "Ayotezco de Aldama", "Ayotzintepec", "Calihualá", "Candelaria Loxicha", "Capulálpam de Méndez", "Chahuites", "Chalcatongo de Hidalgo", "Chiquitlán de Benito Juárex", "Ciénega de Zimatlán", "Ciudad Ixtepec", "Coatecas Altas", "Coicoyán de las Flores", "Concepción Buenavista",
      "Concepción Pápalo", "Constancia del Rosario", "Cosolapa", "Cosoltepec", "Cuilápam de Guerrero", "Cuyamecalco Villa de Zaragoza", "El Barrio de la Soledad", "El Espinal", "Eloxochitlán de Flores Magón", "Fresnillo de Trujano", "Guadalupe de Ramírez", "Guadalupe Etla", "Guelatao de Juárez", "Guevea de Humboldt", "Heroica Ciudad de Ejutla de Crespo", "Heroica Ciudad de Huajuapan de León", "Heroica Ciudad de Juchitán de Zaragoza", "Heroica Ciudad de Tlaxiaco",
      "Heroica villa Tezoatlán de Segura y Luna, cuna de la independecia de Oaxaca", "Huautepec", "Huautla de Jiménez", "Ixpantepec nieves", "Ixtlán de Juárez", "La compañía", " La PE", "La Reforma", "La Trinidad Vista Hermosa", "Loma Bonita", "Magdalenas Apasco", "Magdalena Jaltepec", "Magdalena Ocotlán", "Magdalena Peñasco", "Magdalena Teitipac", "Magdalena Tequisistlán", "Magdalena Tlacotepec", "Magdalena Yodocono de Porfirio Díaz", "Magdalena Zahuatlán", "Mariscala de Juárez", "Mátires de Tacubaya", "Matías Villa de Flores", "Mesones Hidalgo", "Miahuatlán de Porfirio Díaz", "Mixistlán de la Reforma", "Monjas", "Natividad", "Nazareno Etla", "Nejapa de Madero", "Nuevi Zoquiápam",
      "Oaxaca de Juárez", "Ocotlán de Morelos", "Pinotepa de Don Luis", "Pluma Hidalgo", "Putla Villa de Guerrero", "Reforma de Pineda", "Reyes Etla", "Rojas de Cuauhtémoc", "Salina Cruz", "San Agustín Amatengo", "San Agustín Atenango", "San Agustín Chayuco", "San Agustín Etla", "San Agustín Loxicha", "San Agustín Tlacotepec", "San Agustín Yatareni", "San Andrés Cabecera Nueva", "San Andrés Dinicuiti", "San Andrés Huaxpaltepec", "San Andrés Huayápam", "San Andrés Ixtlahuaca", "San Andrés Lagunas", "San Andrés Nuxiño",
      "San Andrés Paxtlán", "San Andrés Sinaxtla", "San Andrés Solaga", "San Andrés Teotilálpam", "San Andrés Tepetlapa", "San Andrés Yaa", "San Andrés Zautla", "San Antonino Castillo Velasco", "San Antonino el Alto", "San Antonio Acutla",
      "San Antonio Monte Verde", "San Antonio Acutla", "San Antonio de la Cal", "San Antonio Huitepec", "Ocotlán de Morelos", "Pinotepa de Don Luis", "Pluma Hidalgo", "Putla Villa de Guerrero", "Reforma de Pineda", "Rojas de Cuauhtémoc", "Salina Cruz", "San Agustín Amatengo", "San Agustín Atenango", "San Agustín Chayuco", "San Agustín Loxicha", "San Agustín Tlacotepec", "San Agustín Yatareni",
      "San Andrés Cabecera Nueva", "San Andrés Dinicuiti", "San Andrés Huaxpaltepec", "San Andrés Ixtlahuaca", "San Andrés Lagunas", "San Andrés Nuxiño", "San Andrés Paxtlán", "San Andrés Sinaxtla", "San Andrés Solaga", "San Andrés Teotilálpam", "San Andrés Tepetlapa", "San Andrés Yaa", "San Andrés Zautla", "San Antonino Castillo Velasco", "San Antonino el Alto", "San Antonio Acutla",
      "San Antonio de la Cal", "San Antonio Huitepec", "San Antonio Nanahuatípam", "San Antonio Sinicahua", "San Antonio Tepetlapa", "San Baltazar Chichicápam", "San Baltazar Loxicha", "San Baltazar Yatzachi el Bajo", "San Bartolo Coyotepec", "San Bartolo Soyaltepec", "San Bartolo Yautepec", "San Bartolomé Ayautla", "San Bartolomé Loxicha", "San Bartolomé Quialana", "San Bartolomé Yucuañe", "San Barolomé Zoogocho", "San Bernardo Mixtepec", "San Blas Atempa",
      "San Carlos Yautepec", "San Cristóbal Amatlán", "San Cistóbal Amoltepec", "San Cristóbal Lachirioag", "San Cristóbal Suchixtlahuaca", "San Dionisio del Mar", "San Dionisio Ocotepec", "San Esteban Atatlahuca", "San Felipe Jalapa de Díaz", "San Felipe Tejalápam", "San Felipe Usila", "San Francisco Cahuacuá",
      "San Francisco Cajonos", "San Francisco Chapulapa", "San Francisco Chindúa", "San Francisco del Mar", "San Francisco Huehuetlán", "San Francisco Ixhuatán", "San Francisco Jaltepetongo", "San Francisco Lachigoló", "San Francisco Logueche", "San Francisco Nuxaño", "San Francisco Ozolotepec", "San Francisco Sola", "San Francisco Telixtlahuaca", "San Francisco Teopan", "San Francisco Tlapancingo", "San Gabriel Mixtepec", "San Ildefonso Amatlán", "San Ildefonso Sola",
      "San Ildefonso Villa Alta", "San Jacinto Amilpas", "San Jacinto Tlacotepec", "San Jerónimo Coatlán", "San Jerónimo Silacayoapilla", "San Jerónimo Sosola", "San Jerónimo Taviche", "San Jorge Nuchita", "San José Ayuquila", "San José Chiltepec", "San José del Peñasco", "San José del Progreso", "San José Estancia Grande", "San José Independencia", "San José Lachiguiri", "San José Tenango", "San Juan Achiutla", "San Juan Atepec",
      "San Juan Bautista Atatlahuca", "San Juan Bautista Coixtlahuaca", "San Juan Bautista Cuicatlán", "San Juan Bautista Guelache", "San Juan Bautista Jayacatlán", "San Juan Bautista Lo de Soto", "San Juan Bautista Suchitepec", "San Juan Bautista Tlacoatzintepec", "San Juan Bautista Tlachichilco", "San Juan Bautista Tuxtepec",
      "San Juan Bautista Valle Nacional", "San Juan Cacahuatepec", "San Juan Chicomezúchil", "San Juan Chilateca", "San Juan Cieneguilla", "San Juan Coatzóspam", "San Jan Comaltepec", "San Juan Cotzón", "San Juan de los Cués", "San Juan del Estado", "San Juan del Río", "San Juan Diuxi", "San Juan Evangelista Analco", "San Juan Guelavía", "San Juan Guichicovi", "San Juan Ihualtepec", "San Juan Juquila Mixes", "San Juan Juquila Vijanos", "San Juan Lachao", "San Juan Lachigalla", "San Juan Lajarcia", "San Juan Lalana", "San Juan Mazatlán",
      "San Juan Mixtepec -Dto. 08-", "San Juan Mixtepec -Dto. 26-", "San Juan Ñumí", "San Juan Ozolotepec", "San Juan Petlapa", "San Juan Quiahije", "San Juan Quiotepec", "San Juan Sayultepec", "San Juan Tabaá", "San Juan Tamazola", "San Juan Teita", "San Juan Teitipac", "San Juan Tepeuxila", "San Juan Teposcolula", "San Juan Yaeé", "San Juan Yatzona", "San Juan Tucuita", "San Lorenzo", "San Lorenzo Albarradas", "San Lorenzo Cacaotepec", "San Lorenzo Cuaunecuiltitla", "San Lorenzo Texmelúcan",
      "San Lorenzo Victoria", "San Lucas Camotlán", "San Lucas Ojitlán", "San Lucas Quiaviní", "San Lucas Zoquiápam", "San Luis Amatlán", "San Marcial Ozolotepec", "San Marcos Arteaga", "San Martín de los Cansecos", "San Martín Huamelúlpam", "San Martín Itunyoso", "San Martín Lachilá", "San Martín Peras", "San Martín Tilcajete", "San Martín Toxpalan", "San Martín Zacatepec", "San Mateo Cajonos", "San Mateo del Mar",
      "San Mateo Etlatongo", "San Mateo Nejápam", "San Mateo Peñasco", "San Mateo Piñas", "San Mateo Río Hondo", "San Mateo Sindihui", "San Mateo Tlapiltepec", "San Mateo Yoloxochitlán", "San Mateo Yucutindoo", "San Melchor Betaza", "San Miguel Achiutla", "San Miguel Ahuehuetitlán", "San Miguel Aloápam", "San Miguel Amatitlán", "San Miguel Amatlán", "San Miguel Coatlán", "San Miguel Chicahua", "San Miguel Chimalapa",
      "San Miguel del Puerto", "San Miguel del Río", "San Miguel Ejutla", "San Miguel el Grande", "San Miguel Huautla", "San Miguel Mixtepec", "San Miguel Panixtlahuaca", "San Miguel Peras", "San Miguel Piedras", "San Miguel Quetzaltepec", "San Miguel Santa Flor", "San Miguel Soyaltepec", "San Miguel Suchixtepec", "San Miguel Tecomatlán", "San Miguel Tenango", "San Miguel Tequixtepec", "San Miguel Tilquiápam", "San Miguel Tlacamama", "San Miguel Tlacotepec", "San Miguel Tulancingo", "San Miguel Yotao", "San Nicolás", "San Nicolás Hidalgo", "San Pablo Coatlán", "San Pablo Cuatro Venados", "San Pablo Etla", "San Pablo Huitzo", "San Pablo Huixtepec", "San Pablo Macuiltianguis", "San Pablo Tijaltepec", "San Pablo Villa de Mitla",
      "San Pablo Yaganiza", "San Pedro Amuzgos", "San Pedro Apóstol", "San Pedro Atoyac", "San Pedro Cajonos", "San Pedro Comitancillo", "San Pedro Coxcaltepec Cántaros", "San Pedro el Alto", "San Pedro Huamelula", "San Pedro Huilotepec", "San Pedro Ixcatlán", "San Pedro Ixtlahuaca", "San Pedro Jaltepetongo", "San Pedro Jicayán", "San Pedro Jocotipac", "San Pedro Juchatengo", "San Pedro Mártir", "San Pedro Mártir Quiechapa", "San Pedro Mártir Yucuxaco", "San Pedro Mixtepec -Dto. 22-", "San Pedro Mixtepec -Dto. 26-", "San Pedro Molinos", "San Pedro Nopala", "San Pedro Ocopetatillo", "San Pedro Ocotepec", "San Pedro Pochutla", "San Pedro Quiatoni", "San Pedro Sochiápam", "San Pedro Tapanatepec", "San Pedro Taviche", "San Pedro Teozacoalco", "San Pedro Teutila", "San Pedro Tidaá", "San Pedro Topiltepec",
      "San Pedro Totolápam", "San Pedro Yólox", "San Pedro y San Pablo Ayutla", "San Pedro y San Pablo Teposcolula", "San Pedro y San Pablo Tequixtepec", "San Pedro Yaneri", "San Pedro Yucunama", "San Raymundo Jalpan", "San Sebastián Abasolo", "San Sebastián Coatlán", "San Sebastián Ixcapa", "San Sebastián Nicananduta", "San Sebastián Río Hondo", "San Sebastián Tecomaxtlahuaca", "San Sebastián Teitipac", "San Sebastián Tutla", "San Simón Almolongas", "San Simón Zahuatlán",
      "San Vicente Coatlán", "San Vicente Lachixío", "San Vicente Nuñú", "Santa Ana", "Santa Ana Ateixtlahuaca", "Santa Ana Cuauhtémoc", "Santa Ana del Valle", "Santa Ana Tavela", "Santa Ana Tlapacoyan", "Santa Ana Yareni", "Santa Ana Zegache", "Santa Catalina Quierí", "Santa Catarina Cuixtla", "Santa Catarina Ixtepeji", "Santa Catarina Juquila", "Santa Catarina Lachatao", "Santa Catarina Loxicha", "Santa Catarina Mechoacán", "Santa Catarina Minas", "Santa Catarina Quiané", "Santa Catarina Quioquitani", "Santa Catarina Tayata", "Santa Catarina Ticuá", "Santa Catarina Yosonotú", "Santa Catarina Zapoquila", "Santa Cruz Acatepec", "Santa Cruz Amilpas", "Santa Cruz de Bravo", "Santa Cruz Itundujia", "Santa Cruz Mixtepec", "Santa Cruz Nundaco", "Santa Cruz Papalutla", "Santa Cruz Tacache de Mina", "Santa Cruz Tacahua", "Santa Cruz Tayata", "Santa Cruz Xitla", "Santa Cruz Xoxocotlán", "Santa Cruz Zenzontepec",
      "Santa Gertrudis", "Santa Inés de Zaragoza", "Santa Inés del Monte", "Santa Inés Yatzeche", "Santa Lucía del Camino", "Santa Lucía Miahuatlán", "Santa Lucía Monteverde", "Santa Lucía Ocotlán", "Santa Magdalena Jicotlán", "Santa María Alotepec", "Santa María Apazco", "Santa María Atzompa", "Santa María Camotlán", "Santa María Chachoápam", "Santa María Chilchotla", "Santa María Chimalapa", "Santa María Colotepec", "Santa María Cortijo", "Santa María Coyotepec", "Santa María del Rosario", "Santa María del Tule", "Santa María Ecatepec", "Santa María Guelacé",
      "Santa María Guienagati", "Santa María Huatulco", "Santa María Huazolotitlán", "Santa María Ipalapa", "Santa María Ixcatlán", "Santa María Jacatepec", "Santa María Jalapa del Marqués", "Santa María Jaltianguis", "Santa María Asunción", "Santa María Lachixío", "Santa María Mixtequilla", "Santa María Nativitas", "Santa María Nduayaco", "Santa María Ozolotepec", "Santa María Pápalo", "Santa María Peñoles", "Santa María Petapa", "Santa María Quiegolani", "Santa María Sola", "Santa María Tataltepec", "Santa María Tecomavaca", "Santa María Temaxcalapa", "Santa María Temaxcaltepec", "Santa María Teopoxco", "Santa María Tepantlali", "Santa María Texcatitlán", "Santa María Tlahuitoltepec", "Santa María Tlalixtac", "Santa María Tonameca", "Santa María Totolapilla", "Santa María Xadani", "Santa María Yalina", "Santa María Yavesía", "Santa María Yolotepec", "Santa María Yosoyúa", "Santa María Yucuhiti",
      "Santa María Zaniza", "Santa María Zoquitlán", "Santiago Amoltepec", "Santiago Apoala", "Santiago Apóstol", "Santiago Astata", "Santiago Atitlán", "Santiago Ayuquililla", "Santiago Cacaloxtepec", "Santiago Camotlán", "Santiago Comaltepec", "Santiago Chazumba", "Santiago Choápam", "Santiago del Río", "Santiago Huajolotitlán", "Santiago Huauclilla", "Santiago Ihuitlán Plumas", "Santiago Ixcuintepec", "Santiago Ixtayutla", "Santiago Jamiltepec", "Santiago Jocotepec", "Santiago Juxtlahuaca",
      "Santiago Lachiguiri", "Santiago Lalopa", "Santiago Laollaga", "Santiago Laxopa", "Santiago Llano Grande", "Santiago Matatlán", "Santiago Miltepec", "Santiago Minas", "Santiago Nacaltepec", "Santiago Nejapilla", "Santiago Niltepec", "Santiago Nundiche", "Santiago Pinotepa Nacional", "Santiago Suchilquitongo", "Santiago Tamazola", "Santiago Tapextla", "Santiago Tenango", "Santiago Tepetlapa", "Santiago Tetepec", "Santiago Texcalcingo", "Santiago Textitlán", "Santiago Tilantongo",
      "Santiago Tillo", "Santiago Tlazoyaltepec", "Santiago Xanica", "Santiago Xiacuí", "Santiago Yaitepec", "Santiago Yaveo", "Santiago Yolomécatl", "Santiago Yosondúa", "Santiago Yucuyachi", "Santiago Zacatepec", "Santiago Zoochila", "Santo Domingo Ingenio", "Santo Domingo Albarradas", "Santo Domingo Armenta", "Santo Domingo Chihuitán", "Santo Domingo de Morelos", "Santo Domingo Ixcatlán", "Santo Domingo Nuxaá", "Santo Domingo Ozolotepec", "Santo Domingo Petapa", "Santo Domingo Roayaga", "Santo Domingo Tehuantepec",
      "Santo Domingo Teojomulco", "Santo Domingo Tepuxtepec", "Santo Domingo Tlatayápam", "Santo Domingo Tomaltepec", "Santo Domingo Tonalá", "Santo Domingo Tonaltepec", "Santo Domingo Xagacía", "Santo Domingo Yanhuitlán", "Santo Domingo Yodohino", "Santo Domingo Zanatepec", "Santo Tomás Jalieza", "Santo Tomás Mazaltepec", "Santo Tomás Ocotepec", "Santo Tomás Tamazulapan", "Santos Reyes Nopala", "Santos Reyes Pápalo", "Santos Reyes Tepejillo", "Santos Reyes Yucuná",
      "Silacayoápam", "Sitio de Xitlapehua", "Soledad Etla", "Tamazulápam del Espíritu Santo", "Taniche", "Tanetze de Zaragoza", "Tataltepec de Valdés", "Teococuilco de Marcos Pérez", "Teotitlán de Flores Magón", "Teotitlán del Valle", "Teotongo", "Tepelmeme Villa de Morelos", "Tlacolula de Matamoros", "Tlacotepec Plumas", "Tlalixtac de Cabrera", "Totontepec Villa de Morelos", "Trinidad Zaachila", "Unión Hidalgo", "Valerio Trujano",
      "Villa de Chilapa de díaz", "Villa de Etla", "Villa de Tamazulápam de Progreso", "Villa de Tututepec de Melchor Ocampo", "Villa de Zaachila", "Villa Díaz Ordaz",
      "Villa Hidalgo", "Villa Sola de Vega", "Villa Talea de Castro", "Villa Tejúpam de la Unión", "Yaxe", "Yogana", "Yutanduchi de Guerrero", "Zapotitlán Lagunas", "Zapotitlán Palmas", "Zapotitlán Villa de Morelos", "Zimatlán de Álvarez"],

    Puebla: ["Acajete", "Acateno", "Acatlán", "Acatzingo", "Acteopan", "Ahuatlán", "Ahuazotepec", "Ahuehuetitla", "Ajalpan", "Albino Zertuche", "Aljojuca", "Altepexi", "Amixtlán", "Amozoc", "Aquixtla", "Atempan", "Atexcal", "Atlequizayan", "Atlixco", "Atoyatempan", "Atzala", "Atzitzihuacán", "Atzitzintla", "Axutla", "Ayotoxco de Guerrero", "Calpan", "Caltepec", "Camocuautla", "Cañada Morelos", "Caxhuacan", "Coatepec", "Coatzingo", "Cohetzala", "Cohuecan", "Coronango", "Coxcatlán",
      "Coyomeapan", "Cuapiaxtla de Madero", "Cuautempan", "Cuautinchán", "Cuautlancingo", "Cuayuca de Andrade", "Cuetzalan del Progreso", "Cuyoaco", "Chalchicomula de Sesma", "Chapulco", "Chiautla", "Chiautzingo", "Chiconcuautla", "Chichiquila", "Chietla", "Chigmecatitlán", "Chignahuapan", "Chignautla", "Chila de la Sal", "Chila", "Chilchotla", "Chinantla", "Domingo Arenas", "Eloxochitlán", "Epatlán", "Esperanza", "Francisco Z. Mena",
      "General Felipe Ángeles", "Guadalupe", "Guadalupe Victoria", "Hermenegildo Galeana", "Honey", "Huaquechula", "Huatlatlauca", "Huauchinango", "Huehuetla", "Huehuetlán el Chico", "Huehuetlán el Grande", "Huejotzingo", "Hueyapan", "Hueytlalpan", "Hueytamalco", "Huitzilan de Serdán", "Huitziltepec", "Ixcamilpa de Guerrero", "Ixcaquixtla", "Ixtacamaxtitlán", "Ixtepec", "Izúcar de Matamoros", "Jalpan", "Jolalpan", "Jonotla", "Jopala", "Juan C. Bonilla", "Juan Galindo", "Jun N.Méndez", "Lafragua", "Libres", "La Magdalena Tlatlauquitepec", "Los Reyes de Juárez",
      "Mazapiltepec de Juárez", "Mixtla", "Molcaxac", "Naupan", "Nauzontla", "Nealtican", "Nicolás Bravo", "Nopalucan", "Ocotepec", "Ocoyucan", "Olintla", "Oriental", "Pahuatlán", "Palmar de Bravo", "Pantepec", "Petlalcingo", "Piaxtla", "Puebla", "Quecholac", "Quimixtlán", "Rafael Lara Grajales", "San Andrés Cholula", "San Antonio Cañada", "San Diego la Mesa Tochimiltzingo", "San Felipe Teotlalcingo", "San Felipe Tepatlán", "San Gabriel Chilac",
      "San Gregorio Atzompa", "San Jerónimo Tecuanipan", "San Jerónimo Xayacatlán", "San José Chiapa", "San José Miahuatlán", "San Juan Atenco", "San Juan Atzompa", "San Juan Ixcaquixtla", "San Martín Texmelucan", "San Martín Totoltepec", "San Matías Tlalancaleca", "San Miguel Ixitlán", "San Miguel Xoxtla", "San Nicolás Buenos Aires", "San Nicolás de los Ranchos", "San Pablo Anicano", "San Pedro Cholula", "San Pedro Yeloixtlahuaca", "San Salvador el Seco", "San Salvador el Verde",
      "San Salvador Huixcolotla", "San Sebastián Tlacotepec", "Santa Catarina Tlaltempan", "Santa Inés Ahuatempan", "Santa Isabel Cholula", "Santiago Miahuatlán", "Santo Tomás Hueyotlipan", "Soltepec", "Tecali de Herrera", "Tecamachalco", "Tecomatlán", "Tehuacán", "Tehuitzingo", "Tenampulco", "Teopantlán", "Teotlalco", "Tepanco de López", "Tepango de Rodríguez", "Tepatlaxco de Hidalgo", "Tepeaca", "Tepemaxalco", "Tepeojuma", "Tepetzintla", "Tepexco", "Tepexi de Rodríguez",
      "Tepeyahualco", "Tepeyahualco de Cuauhtémoc", "Tetela de Ocampo", "Teteles de Ávila Castillo", "Teziutlán", "Tianguismanalco", "Tilapa",
      "Tlacotepec de Benito Juárez", "Tlacuilotepec", "Tlachichuca", "Tlahuapan", "Tlaltenango", "Tlanepantla", "Tlaola", "Tlapacoya", "Tlapanalá", "Tlatlauquitepec", "Tlaxco",
      "Tochimilco", "Tochtepec", "Totoltepec de Guerrero", "Tulcingo", "Tuzamapan de Galeana", "Tzicatlacoyan", "Venustiano Carranza", "Vicente Guerrero", "Xayacatlán de Bravo", "Xicotepec", "Xicotlán", "Xiutetelco", "Xochiapulco", "Xochiltepec", "Xochitlán de Vicente Suárez", "Xochitlán Todos Santos", "Yaonáhuac", "Yehualtepec", "Zacapala", "Zacapoaxtla",
      "Zacatlán", "Zapotitlán", "Zapotitlán de Méndez", "Zaragoza", "Zautla", "Zihuateutla", "Zinacatepec", "Zongozotla", "Zoquiapan", "Zoquitlán"],
    Querétaro: ["Amealco de Bonfil", "Arroyo Seco", "Cadereyta de Montes", "Colón", "Corregidora", "Ezequiel Montes", "Huimilpan", "Jalpan de Serra", "Landa de Matamoros", "El Marqués", "Pedro Escobedo", "Peñamiller", "Pinal de Amoles", "Querétaro", "San Joaquín", "San Juan del Río", "Tequisquiapan", "Tolimán"],
    "Quintana Roo": ["Cozumel", "Felipe Carrillo Puerto", "Isla Mujeres", "José María Morelos", "Lázaro Cárdenas", "Othón P. Blanco", "Benito Juárez", "Solidaridad", "Tulum", "Bacalar"],

    "San Luis Potosí": ["Ahualulco", "Alaquines", "Aquismón", "Armadillo de los Infante", "Axtla de Terrazas", "Cárdenas", "Catorce", "Cedral", "Cerritos", "Cerro de San Pedro", "Ciudad del Maíz", "Ciudad Fernández", "Ciudad Valles", "Coxcatlán", "Charcas", "Ebano", "El Naranjo", "Guadalcázar", "Huehuetlán", "Lagunillas", "Matehuala", "Matlapa", "Mexquitic de Carmona", "Moctezuma", "Rayón", "Rioverde", "Salinas", "San Antonio", "San Ciro de Acosta", "San Luis Potosí", "San Martín Chalchicuautla",
      "San Nicolás Tolentino", "Santa Catarina", "Santa María del Río", "Santo Domingo", "Soledad de Graciano Sánchez", "San Vicente Tancuayab", "Tamasopo", "Tamazunchale", "Tampacán", "Tampamolón Corona", "Tamuín", "Tanlajás", "Tanquián de Escobedo", "Tierra Nueva", "Tancanhuitz", "Venegas", "Venado", "Villa de Arriaga", "Villa de Guadalupe", "Villa de la Paz", "Villa de Ramos", "Villa de Reyes", "Villa Hidalgo", "Villa Juaréz", "Villa de Arista", "Xilitla", "Zaragoza"],

    Sinaloa: ["Ahome", "Angostura", "Badiraguato", "Concordia", "Cosalá", "Culiacán", "Choix", "Elota", "Escuinapa", "El Fuerte", "Guasave", "Mazatlán", "Mocorito", "Navolato", "Rosario", "Salvador Alvarado", "San Ignacio", "Sinaloa", "Rosario", "Sinaloa de Leyva", "Soyopa", "Surutato"],


    Sonora: ["Aconchi", "Agua Prieta", "Alamos", "Altar", "Arivechi", "Arizpe", "Atil", "Bacadéhuachi", "Bacanora", "Bacerac", "Bacoachi", "Bácum", "Banámichi", "Baviácora", "Bavispe",
      "Benjamín Hill", "Caborca", "Cajeme", "Cananea", "Carbó", "Cucurpe", "Cumpas", "Divisaderos", "Empalme", "Etchojoa", "Fronteras", "Granados", "Guaymas", "Hermosillo", "Huachinera", "Huatabampo", "Huásabas", "Imuris", "La Colorada", "Magdalena de Kino", "Mazatán", "Moctezuma", "Naco", "Nácori Chico", "Nacozari de García", "Navojoa", "Nogales", "Onavas", "Opodepe", "Oquitoa", "Pitiquito", "Puerto Peñasco", "Quiriego", "Rayón",
      "Rosario", "Sahuaripa", "San Felipe de Jesús", "San Javier", "San Luis Río Colorado", "San Miguel de Horcasitas", "San Pedro de la Cueva", "Santa Ana", "Santa Cruz", "Sáric", "Soyopa", "Suaqui Grande", "Tepache", "Trincheras", "Tubutama", "Ures", "Villa Hidalgo", "Villa Pesqueira", "Yécora", "General Plutarco Elías Calles", "Benito Juárez", "San Ignacio Río Muerto"],

    Tabasco: ["Balancán", "Cárdenas", "Centla", "Centro", "Comalcalco", "Cunduacán", "Emiliano Zapata", "Huimanguillo", "Jalapa", "Jalpa de Méndez", "Jonuta", "Macuspana", "Nacajuca", "Paraíso", "Tacotalpa", "Teapa", "Tenosique"],

    Tamaulipas: ["Abasolo", "Aldama", "Altamira", "Antiguo Morelos", "Burgos", "Bustamante", "Camargo", "Casas", "Ciudad Madero", "Cruillas", "El Mante", "Gómez Farías", "González", "Güemez",
      "Guerrero", "Gustavo Díaz Ordaz", "Hidalgo", "Jaumave", "Jiménez", "Llera", "Mainero", "Matamoros", "Méndez", "Mier", "Miguel Alemán", "Miquihuana", "Nuevo Laredo", "Nuevo Morelos", "Ocampo", "Padilla", "Palmillas", "Reynosa", "Río Bravo", "San Carlos", "San Fernando", "San Nicolás", "Soto la Marina", "Tampico", "Tula", "Valle Hermoso", "Victoria", "Villagrán", "Xicoténcatl"],

    Tlaxcala: ["Amaxac de Guerrero", "Apetatitlán de Antonio Carvajal", "Apizaco", "Atlangatepec", "Atltzayanca", "Calpulalpan", "Cuapiaxtla", "Cuaxomulco", "El Carmen Tequexquitla", "Chiautempan", "Muñoz de Domingo Arenas", "Españita", "Huamantla", "Hueyotlipan", "Ixtacuixtla de Mariano Matamoros", "Ixtenco", "Mazatecochco de José María Morelos", "Contla de Juan Cuamatzi", "Tepetitla de Lardizábal", "Nanacamilpa de Mariano Arista", "Acuamanala de Miguel Hidalgo", "Natívitas", "Panotla",
      "Papalotla de Xicohténcatl", "San Damián Texóloc", "San Francisco Tetlanohcan", "San Jerónimo Zacualpan", "San José Teacalco", "San Juan Huactzinco", "San Lorenzo Axocomanitla", "San Lucas Tecopilco", "San Pablo del Monte", "Sanctórum de Lázaro Cárdenas", "Santa Ana Nopalucan", "Santa Apolonia Teacalco", "Santa Catarina Ayometla", "Santa Cruz Quilehtla", "Santa Isabel Xiloxoxtla", "Teolocholco", "Tepeyanco", "Terrenate", "Tetla de la Solidaridad", "Tetlatlahuca", "Tlaxcala", "Tlaxco", "Tocatlán", "Totolac", "Xaloztoc", "Xaltocan", "Xicohtzinco", "Yauhquemehcan", "Zacatelco", "Benito Juárez",
      "Emiliano Zapata", "Lázaro Cárdenas", "La Magdalena Tlaltelulco", "Zitlaltepec de Trinidad Sánchez Santos", "Tzompantepec", "Santa Cruz Tlaxcala", "Tenancingo"],

    Veracruz: ["Acajete", "Acatlán", "Acayucan", "Actopan", "Acula", "Acultzingo", "Alpatláhuac", "Álamo Tempache", "Alto Lucero de Gutiérrez Barrios", "Altotonga", "Alvarado", "Amatitlán", "Amatlán de los Reyes",
      "Angel R. Cabada", "Apazapan", "Aquila", "Astacinga", "Atlahuilco", "Atoyac", "Atzacan", "Atzalan", "Ayahualulco", "Banderilla",
      "Benito Juárez", "Boca del Río", "Calcahualco", "Camarón de Tejada", "Camerino Z. Mendoza", "Carlos A. Carrillo", "Carrillo Puerto", "Castillo de Teayo", "Catemaco", "Cazones de Herrera", "Cerro Azul",
      "Chacaltianguis", "Chalma", "Chiconamel", "Chiconquiaco", "Chicontepec", "Chinameca", "Chinampa de Gorostiza", "Chocamám", "Chontla", "Chumatlán", "Citlaltépetl", "Coacoatzintla", "Coahuitlán", "Coatepec",
      "Coetzala", "Colipa", "Comapa", "Córdoba", "Cosamaloapan de Carpio", "Cosautlán de Carvajal", "Coscomatepec",
      "Cotaxtla", "Coxquihui", "Coyutla", "Cuichapa", "Cuitláhuac", "El Higo", "Emiliano Zapata", "Espinal", "Filomeno Mata", "Fortín", "Gutiérrez Zamora", "Hidalgotitlán", "Huatusco", "Huayacocotla", "Hueyapan de Ocampo", "Huiloapan de Cuauhtémoc", "Ignacio de la Llave", "Ilamatlán", "Isla", "Ixhuacán de los Reyes", "Ixhuatlán del Café", "Ixhuatlancillo", "Ixhuatlán de Madero", "Ixmatlahuacan", "Ixtaczoquitlán",
      "Ixtaczoquitlán", "Jalacingo", "Jalcomulco", "Jáltipan", "Jamapa", "Jesús Carranza", "Jilotepec", "Juan Rodríguez Clara", "Juchique de Ferrer", "La Antigua", "La Perla", "Landero y Coss", "Las Minas", "Las Vigas de Ramírez",
      "Lerdo de Tejada", "Los Reyes", "Magdalena", "Maltrata", "Manlio Fabio Altamirano", "Mariano Escobedo", "Martínez de la Torre", "Mecatlán", "Mecayapan", "Medellín de Bravo", "Miahuatlán", "Minatitlán", "Misantla", "Mixtla de Altamirano", "Moloacán", "Nanchital de Lázaro Cárdenas del Río", "Naolinco", "Naranjal", "Narnajos Amatlán", "Nautla", "Nogales", "Oluta", "Omealca", "Orizaba", "Otatitlán", "Oteapan", "Ozuluama de Mascareñas", "Pajapan", "Pánuco", "Papantla", "Paso del Macho", "Paso de Ovejas", "Perote", "Platón Sánchez", "Playa Vicente", "Poza Rica de Hidalgo", "Presidio", "Pueblo Viejo", "Puente Nacional", "Rafael Delgado", "Rafael Lucio", "Los Reyes", "Río Blanco", "Saltabarranca", "San Andrés Tenejapan", "San Andrés Tuxtla", "San Juan Evangelista", "San Rafael", "Santiago Tuxtla", "San Rafael", "Santiago Sochiapan", "Sayula de Alemán", "Soconusco", "Sochiapa", "Soledad Atzompa", "Soledad de Doblado", "Soteapan", "Tamalín", "Tamiahua", "Tampico Alto", "Tancoco", "Tantima", "Tantoyuca", "Tatahuicapan de Juárez", "Tatatila", "Tecolutla", "Tehuipango", "Temponalcingo", "Tenampa", "Tenochtitlán", "Teocelo", "Tepatlaxco", "Tepetlá", "Tepetzintla", "Tequila", "José Azueta", "Texcatepec", "Texhuacán", "Texistepec", "Tezonapa", "Tierra Blanca", "Tihuatlán", "Tlilapan", "Tlacojalpan", "Tlacolulan", "Tlacotalpan", "Tlacotepec de Mejía", "Tlachichilco", "Tlalixcoyan", "Tlalnelhuayocan", "Tlaltetela", "Tlapacoyan", "Tlaquilpa", "Tomatlán", "Tonayán", "Totutla",
      "Tatatila", "Tecolutla", "Tehuipango", "Temponalcingo", "Tenampa", "Tenochtitlán", "Teocelo", "Tepatlaxco", "Tepetzintla", "Tequila", "José Azueta", "Texcatepec", "Texhuacán", "Texistepec", "Tezonapa", "Tierra Blanca", "Tihuatlán", "Tlacojalpan", "Tlacolulan", "Tlacotalpan", "Tlacotepec de Mejía", "Tlachichilco", "Tlalixcoyan", "Tlalnelhuayocan", "Tlaltetela", "Tlapacoyan", "Tlaquilpa", "Tomatlán", "Tonayán", "Totutla",
      "Tres Valles", "Tuxpan", "Tuxtilla", "Ursulo Galván", "Uxpanapa", "Vega de Alatorre", "Veracruz", "Villa Aldama", "Xalapa", "Xico", "Xoxocotla", "Yanga", "Yecuatla", "Zacualpan", "Zaragoza", "Zentla", "Zongolica", "Zontecomatlán de López y Fuentes", "Zoquitlán", "Zozocolco de Hidalgo"],

    Yucatán: ["Abalá", "Acanceh", "Akil", "Baca", "Bokobá", "Buctzotz", "Cacalchén", "Calotmul", "Cansahcab", "Cantamayec", "Celestún", "Cenotillo", "Conkal", "Cuncunul", "Cuzamá", "Chacsinkín", "Chankom", "Chapab", "Chemax", "Chicxulub Pueblo", "Chichimilá", "Chikindzonot", "Chocholá", "Chumayel", "Dzán", "Dzemul", "Dzidzantún", "Dzilam de Bravo", "Dzilam González",
      "Dzitás", "Dzoncauich", "Espita", "Halachó", "Hocabá", "Hoctún", "Homún", "Huhí", "Hunucmá", "Ixil", "Izamal", "Kanasín", "Kantunil", "Kaua", "Kinchil", "Kopomá", "Mama", "Maní", "Maxcanú", "Mayapán", "Mérida", "Mocochá", "Motul", "Muna", "Muxupip", "Opichén", "Oxkutzcab", "Panabá", "Peto", "Progreso", "Quintana Roo", "Río Lagartos",
      "Sacalum", "Samahil", "Sanahcat", "San Felipe", "Santa Elena", "Seyé", "Sinanché", "Sotuta", "Sucilá", "Sudzal", "Suma", "Tahdziú", "Tahmek", "Teabo", "Tecoh", "Tekal de Venegas", "Tekantó", "Tekax", "Tekit", "Tekom", "Telchac Pueblo", "Telchac Puerto", "Temax", "Temozón", "Tepakán", "Tetiz", "Teya", "Ticul", "Timucuy", "Tinum", "Tixcacalcupul", "Tixkokob", "Tixmehuac", "Tixpéual", "Tizimín", "Tunkás", "Tzucacab", "Uayma", "Ucú", "Umán", "Valladolid", "Xocchel", "Yaxcabá", "Yaxkukul", "Yobaín"],

    Zacatecas: ["Apozol", "Apulco", "Atolinga", "Benito Juárez", "Calera", "Cañitas de Felipe Pescador", "Concepción del Oro", "Cuauhtémoc", "Chalchihuites", "Fresnillo",
      "Genaro Codina", "General Enrique Estrada", "General Francisco R. Murguía", "El Plateado de Joaquín Amaro", "General Pánfilo Natera", "Guadalupe", "Huanusco", "Jalpa", "Jerez", "Jiménez del Teul", "Juan Aldama", "Juchipila",
      "Loreto", "Luis Moya", "Mazapil", "Melchor Ocampo", "Mezquital del Oro", "Miguel Auza", "Momax", "Monte Escobedo", "Morelos", "Moyahua de Estrada", "Nochistlán de Mejía", "Noria de Ángeles", "Ojocaliente", "Pánuco", "Pinos", "Río Grande", "Saín Alto", "El Salvador", "Sombrerete", "Susticacán",
      "Tabasco", "Tepechitlán", "Tepetongo", "Teúl de González Ortega", "Tlaltenango de Sánchez Román", "Trinidad Gracía de la Cadena", "Valparaíso", "Vetagrande", "Villa de Cos", "Villa García", "Villa González Ortega", "Villa Hidalgo", "Villanueva", "Zacatecas", "Trancoso", "Santa María de la Paz"],
  };


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [errorPassword, setErrorPassword] = useState(false);
  const [errorEdad, setErrorEdad] = useState(false);
  const [errores, setErrores] = useState({});
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
   const [tipo, setTipo] = useState("success"); // success | error | warning | info

  const mostrarMensaje = (msg, severity = "info") => {
    setMensaje(msg);
    setTipo(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


    // Color dinámico del slider
const getSliderColor = (value) => {
  if (value > 7) return "error.main"; // rojo(de 7 a 10)
  if (value > 3) return "warning.main"; // amarillo (de 4 a 7)
  return "success.main"; // verde (3 o menos)
};

  // Calcular edad a partir de la fecha
  const calcularEdad = (fecha) => {
    if (!fecha) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };
  const validarCampos = () => {
    const nuevosErrores = {};

    if (!/^\d{10}$/.test(form.telefono))
      nuevosErrores.telefono = "El teléfono debe tener 10 dígitos";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nuevosErrores.email = "Correo electrónico no válido";

    if (!/^[A-Z0-9]{18}$/.test(form.curp))
      nuevosErrores.curp = "La CURP debe tener 18 caracteres válidos";

    if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+\s\d{1,5}$/.test(form.calle))
      nuevosErrores.calle= 'Calle inválida (debe contener letras y un número de casa, ej: "Insurgentes 123"';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "curp" ? value.toUpperCase() : value;
   

    const parsedValue = ["sexo", "tipo_usuario", "nivel_estres_base", "especialidad"].includes(name)
      ? Number(finalValue)
      : finalValue;


    const updatedForm = { ...form, [name]: parsedValue };
    setForm(updatedForm);

  

    // Validar contraseñas sólo cuando al menos uno de los campos tenga algo
    const pass = updatedForm.contrasena ?? "";
    const confirm = updatedForm.confirmar_contrasena ?? "";
    setErrorPassword((pass !== "" || confirm !== "") && pass !== confirm);

    // Validar edad si cambió la fecha
    if (name === "fecha_nacimiento") {
      const edad = calcularEdad(parsedValue);
      setErrorEdad(!(edad >= 17 && edad <= 70));
    }
  };

  const handleTipoUsuario = (tipo) => {
    setForm({ ...form, tipo_usuario: tipo });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (form.contrasena !== form.confirmar_contrasena) {
      mostrarMensaje("Las contraseñas no coinciden", "error");
      return;
    }

    // Validar edad
    const edad = calcularEdad(form.fecha_nacimiento);
    if (edad < 17 || edad > 70) {
      mostrarMensaje("La edad debe estar entre 17 y 70 años", "error");
      return;
    }
  

    try {
      // Preparar datos para enviar (convertir fecha a string)
      const dataToSend = {
        ...form,
        fecha_nacimiento: form.fecha_nacimiento ?
          new Date(form.fecha_nacimiento).toISOString().split('T')[0] : null
      };

      const res = await axios.post(
        "http://localhost:4000/api/auth/register",
        dataToSend
      );
     navigate('/login', { 
          state: { 
              registrationSuccess: true,
              message: "¡Registro exitoso! Ya puedes iniciar sesión.",
              severity: "success"
          }
      });
    } catch (err) {
       //Log completo del error para depuración
        console.error("Error completo de Axios:", err); 

        let mensajeError = "Error al registrar el recordatorio.";
        
        // Verificar que la respuesta 400 tenga datos estructurados
        if (err.response && err.response.data) {
            const dataError = err.response.data;
            
            if (dataError.errores && Array.isArray(dataError.errores) && dataError.errores.length > 0) {
                // Unir  los errores de validación en una sola cadena
                mensajeError = `Errores de validación: ${dataError.errores.join('; ')}`;
            } 
            else if (dataError.message) {
                 mensajeError = dataError.message;
            }
        }

        // Mostrar el mensaje de error específico o el genérico 
        mostrarMensaje(mensajeError, "error");
    }
  };


  const handleBack = () => {
    navigate('/login');
  };
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);





  //const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1470&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(10,35,97,0.55)",
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* Botón volver */}
        <Button
          onClick={handleBack}
          startIcon={<ArrowBackIosNewOutlined />}
          sx={{
           alignSelf: "flex-start",
            color: "#2D5D7B",
            backgroundColor: "rgba(255,255,255,0.9)",
            fontWeight: "bold",
            borderRadius: 3,
            mb: 1,
            "&:hover": { backgroundColor: "#F5E3E9", color: "#67121A" },
          }}
        >
          Volver
        </Button>

        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4 },
             borderRadius: 4,
          backgroundColor: "#F4F6F8",
          border: "2px solid #CBD4D8",
          maxWidth: 600,
          width: "100%",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          }}
        >
          {/* Logo y título */}
          <Box textAlign="center" mb={3}>
            <Box
              component="img"
              src="/logo.png"
              alt="Nubii Logo"
              sx={{
                width: 90,
                height: 90,
                mb: 2,
                borderRadius: "50%",
                backgroundColor: "#F5E3E9",
                padding: 1,
                border: "3px solid #355C7D",
              }}
            />
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#092181",
                letterSpacing: 1,
                fontSize: { xs: "2rem", sm: "2.5rem" },
              }}
            >
              Nubii
            </Typography>
            <Typography
              variant="h6"
              component="h2"
              color="#2D5D7B"
              sx={{ fontWeight: "medium", letterSpacing: 0.5 }}
            >
              Registro de Usuario
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          >

            {/* Inputs */}
            <TextField
              fullWidth
              margin="normal"
              label="Nombre"
              name="nombre"
              placeholder="Ingresa tu nombre"
             // required
              value={form.nombre}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px", // esquinas redondeadas
                  backgroundColor: "#fff", // fondo blanco
                  "& fieldset": {
                    borderColor: "#CBD4D8", // color del borde por defecto
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D", // color al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181", // color cuando está enfocado
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B", // color de la etiqueta
                  fontWeight: "bold",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#777777", // color del placeholder
                  opacity: 1,
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Apellido paterno"
              placeholder="Ingresa tu apellido paterno"
              //required
              name="apaterno"
              value={form.apaterno}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px", // esquinas redondeadas
                  backgroundColor: "#fff", // fondo blanco
                  "& fieldset": {
                    borderColor: "#CBD4D8", // color del borde por defecto
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D", // color al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181", // color cuando está enfocado
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B", // color de la etiqueta
                  fontWeight: "bold",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#777777", // color del placeholder
                  opacity: 1,
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Apellido materno"
              placeholder="Ingresa tu apellido materno"
              name="amaterno"
              value={form.amaterno}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px", // esquinas redondeadas
                  backgroundColor: "#fff", // fondo blanco
                  "& fieldset": {
                    borderColor: "#CBD4D8", // color del borde por defecto
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D", // color al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181", // color cuando está enfocado
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B", // color de la etiqueta
                  fontWeight: "bold",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#777777", // color del placeholder
                  opacity: 1,
                },
              }}
            />

            {/* 📅 Fecha de nacimiento */}
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha de Nacimiento"
                value={form.fecha_nacimiento}
                onChange={(newValue) => {
                  setForm({ ...form, fecha_nacimiento: newValue });

                  // Validar edad al seleccionar fecha
                  if (newValue) {
                    const edad = calcularEdad(newValue);
                    setErrorEdad(!(edad >= 17 && edad <= 70));
                  } else {
                    setErrorEdad(true);
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    //required: true,
                    InputLabelProps: { shrink: true },
                    error: errorEdad,
                    helperText: errorEdad ? "La edad debe ser entre 17 y 70 años" : "",
                    sx: {
                      mt: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px", // bordes redondeados
                        backgroundColor: "#FFFFFF",
                        "& fieldset": {
                          borderColor: "#CBD4D8",
                        },
                        "&:hover fieldset": {
                          borderColor: "#355C7D",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#092181",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#2D5D7B",
                        fontWeight: "bold",
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>

            {/* ⚧ Sexo */}
            <FormControl
              fullWidth
              //required
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  "& fieldset": {
                    borderColor: "#CBD4D8",
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B",
                  fontWeight: "bold",
                },
              }}
            >
          

              <Select
                
                labelId="sexo-label"
                name="sexo"
                value={form.sexo}
                onChange={handleChange}
                displayEmpty
                //label=" Sexo"
                //inputProps={}
              >
                <MenuItem value="">Seleccione sexo</MenuItem>
                <MenuItem value="1">Masculino</MenuItem>
                <MenuItem value="2">Femenino</MenuItem>
                <MenuItem value="3">Otro</MenuItem>
              </Select>
            </FormControl>


            <TextField
              fullWidth
              type="number"
              margin="normal"
              label="Teléfono"
              name="telefono"
              placeholder="Ingresa tu número de teléfono"
              // required
              value={form.telefono}
              onChange={handleChange}
              error={!!errores.telefono}
            helperText={errores.telefono}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px", // esquinas redondeadas
                  backgroundColor: "#fff", // fondo blanco
                  "& fieldset": {
                    borderColor: "#CBD4D8", // color del borde por defecto
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D", // color al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181", // color cuando está enfocado
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B", // color de la etiqueta
                  fontWeight: "bold",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#777777", // color del placeholder
                  opacity: 1,
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              type="email"
              label="Correo"
              name="email"
              placeholder="Ingresa tu correo electrónico"
             // required
              value={form.email}
              onChange={handleChange}
              error={!!errores.email}
            helperText={errores.email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px", // esquinas redondeadas
                  backgroundColor: "#fff", // fondo blanco
                  "& fieldset": {
                    borderColor: "#CBD4D8", // color del borde por defecto
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D", // color al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181", // color cuando está enfocado
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B", // color de la etiqueta
                  fontWeight: "bold",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#777777", // color del placeholder
                  opacity: 1,
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="CURP"
              name="curp"
              placeholder="Ingresa tu CURP"
              //required
              value={form.curp}
              onChange={handleChange}
               error={!!errores.curp}
            helperText={errores.curp}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px", // esquinas redondeadas
                  backgroundColor: "#fff", // fondo blanco
                  "& fieldset": {
                    borderColor: "#CBD4D8", // color del borde por defecto
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D", // color al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181", // color cuando está enfocado
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B", // color de la etiqueta
                  fontWeight: "bold",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#777777", // color del placeholder
                  opacity: 1,
                },
                "& .MuiInputBase-input": {
      textTransform: "uppercase", // 🔥 lo muestra en mayúsculas visualmente
    },
              }}
            />

            {/* 🏙️ Estado */}
            <FormControl
              fullWidth
              //required

              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  "& fieldset": {
                    borderColor: "#CBD4D8",
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B",
                  fontWeight: "bold",
                },
              }}
            >

              <Select
                name="estado"
                value={form.estado}
                //required
                displayEmpty
                //label="Estado"
                onChange={(e) =>
                  setForm({
                    ...form,
                    estado: e.target.value,
                    municipio: "",
                  })
                }
              >
                <MenuItem disabled value="">
                  <em>Seleccione un estado</em>
                </MenuItem>
                {estados.map((estado) => (
                  <MenuItem key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 🏘️ Municipio */}
            {form.estado && (
              <FormControl
                fullWidth
                //required
                margin="normal"
                sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  "& fieldset": {
                    borderColor: "#CBD4D8",
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B",
                  fontWeight: "bold",
                },
              }}
              >
                <InputLabel>Municipio</InputLabel>
                <Select
                  name="municipio"
                  value={form.municipio}
                  required
                  label="Municipio"
                  onChange={handleChange}
                  sx={{
                    "& .MuiSelect-select": {
                      paddingTop: "20px",   // aumenta espacio para que no se encime
                      paddingBottom: "20px",
                    },
                  }}

                >
                   
                  {municipios[form.estado].map((mun, idx) => (
                    <MenuItem key={idx} value={mun}>
                      {mun}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}


            <TextField
              fullWidth
              margin="normal"
              label="Calle"
              name="calle"
              placeholder="Ingresa tu calle"
             // required
              value={form.calle}
              onChange={handleChange}
              error={!!errores.calle}
            helperText={errores.calle}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px", // esquinas redondeadas
                  backgroundColor: "#fff", // fondo blanco
                  "& fieldset": {
                    borderColor: "#CBD4D8", // color del borde por defecto
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D", // color al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181", // color cuando está enfocado
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B", // color de la etiqueta
                  fontWeight: "bold",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#777777", // color del placeholder
                  opacity: 1,
                },
              }}
            />

            <Divider sx={{ mb: 3, borderColor: "#F5E3E9" }} />

            {/* Tipo de usuario */}
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#092181", textAlign: "center" }}
            >
              Selecciona tu tipo de usuario
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}
              alignContent={"center"} alignItems={"center"} justifyContent={"center"}>

              {[
                { tipo: 3, nombre: "paciente" },
                { tipo: 2, nombre: "profesional" },
                { tipo: 1, nombre: "administrador" },
              ].map(({ tipo, nombre }) => (
                <Grid item xs={12} sm={6} key={nombre}>
                  <Button
                    fullWidth
                    variant={form.tipo_usuario === tipo ? "contained" : "outlined"}
                    onClick={() => handleTipoUsuario(tipo)}

                    sx={{
                      height: 120,
                      flexDirection: "column",
                      borderRadius: 3,
                      backgroundColor:
                        form.tipo_usuario === tipo ? "#F5E3E9" : "#FFFFFF",
                      borderColor:
                        form.tipo_usuario === tipo ? "#67121A" : "#CBD4D8",
                      color: form.tipo_usuario === tipo ? "#67121A" : "#2D5D7B",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "#F5E3E9",
                        borderColor: "#67121A",
                        color: "#67121A",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={`/${nombre}.png`}
                      alt={nombre}
                      textTransform='capitalize'
                      sx={{ width: 64, height: 64, mb: 1 }}

                    />
                    <Typography variant="body1" fontWeight="bold"
                      textTransform={"capitalize"}>
                      {nombre.charAt(0) + nombre.slice(1)}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* Contraseña */}
            <TextField
              fullWidth
              placeholder="Ingresa tu contraseña"
              margin="normal"
              type={showPassword ? "text" : "password"}
              label="Contraseña"
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              //required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),

              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px", // esquinas redondeadas
                  backgroundColor: "#fff", // fondo blanco
                  "& fieldset": {
                    borderColor: "#CBD4D8", // color del borde por defecto
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D", // color al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181", // color cuando está enfocado
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B", // color de la etiqueta
                  fontWeight: "bold",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#777777", // color del placeholder
                  opacity: 1,
                },
              }}
            />

            {/* Repetir contraseña */}
            <TextField
              fullWidth
              placeholder="Confirma tu contraseña"
              //required
              margin="normal"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirmar contraseña"
              name="confirmar_contrasena"
              value={form.confirmar_contrasena || ""}
              onChange={handleChange}
              error={errorPassword}
              helperText={errorPassword ? "Las contraseñas no coinciden" : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px", // esquinas redondeadas
                  backgroundColor: "#fff", // fondo blanco
                  "& fieldset": {
                    borderColor: "#CBD4D8", // color del borde por defecto
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D", // color al pasar el mouse
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181", // color cuando está enfocado
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B", // color de la etiqueta
                  fontWeight: "bold",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#777777", // color del placeholder
                  opacity: 1,
                },
              }}
            />

            {/* Campos según tipo de usuario */}
            {form.tipo_usuario === 3 && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  gutterBottom
                  required
                  sx={{
                    fontWeight: "bold",
                    color: "#2D5D7B",
                    mb: 1,
                  }}
                >
                  Nivel de estrés (1 - 10)
                </Typography>

                <Slider
                  value={form.nivel_estres_base || 1}
                  onChange={(e, newValue) =>
                    setForm({ ...form, nivel_estres_base: newValue })
                  }
                  step={1}
                  marks
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                  sx={{
                    color: getSliderColor(form.nivel_estres_base), // color principal
                   "& .MuiSlider-thumb": { borderRadius: "50%" },
                  }}
                />
              </Box>
            )}


            {form.tipo_usuario === 2 && (
              <>
                <FormControl fullWidth 
                //required
                 margin="normal"
                 sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  "& fieldset": {
                    borderColor: "#CBD4D8",
                  },
                  "&:hover fieldset": {
                    borderColor: "#355C7D",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#092181",
                    borderWidth: "2px",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#2D5D7B",
                  fontWeight: "bold",
                },
              }}>
                  <InputLabel>Especialidad</InputLabel>
                  <Select
                    name="especialidad"
                    value={form.especialidad}
                    onChange={handleChange}
                    label="Especiealidad"
                  >
                    <MenuItem value={1}>Psicólogo</MenuItem>
                    <MenuItem value={2}>Psiquiatra</MenuItem>
                    <MenuItem value={3}>Terapeuta</MenuItem>
                    <MenuItem value={4}>Neurólogo</MenuItem>
                    <MenuItem value={5}>Médico General</MenuItem>
                    <MenuItem value={6}>Psicoterapeuta</MenuItem>
                    <MenuItem value={7}>Psicoanalista</MenuItem>
                    <MenuItem value={8}>Consejero en salud mental</MenuItem>
                    <MenuItem value={9}>Trabajador social clínico</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  placeholder="Ingresa tu cédula profesional"
                  //required
                  margin="normal"
                  label="Cédula profesional"
                  name="cedula"
                  value={form.cedula}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px", // esquinas redondeadas
                      backgroundColor: "#fff", // fondo blanco
                      "& fieldset": {
                        borderColor: "#CBD4D8", // color del borde por defecto
                      },
                      "&:hover fieldset": {
                        borderColor: "#355C7D", // color al pasar el mouse
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#092181", // color cuando está enfocado
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#2D5D7B", // color de la etiqueta
                      fontWeight: "bold",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "#777777", // color del placeholder
                      opacity: 1,
                    },
                  }}
                />
              </>
            )}

            {/* Botón de registro */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              textTransform="capitalize"
              disabled={errorPassword || errorEdad}
              startIcon={<AddBoxIcon />}
              sx={{
                mt: 2,
                py: 1.6,
                fontSize: "1.1rem",
                fontWeight: "bold",
                bgcolor: "#2D5D7B",
                borderRadius: 3,
                boxShadow: 4,
                textTransform: 'capitalize',
                "&:hover": { bgcolor: "#355C7D" },
              }}
            >
              Crear cuenta
            </Button>

            {/* Link a login */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={0.5}
            >
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes cuenta?
              </Typography>
              <Link
                component="button"
                variant="body2"
                sx={{
                  color: "#2D5D7B",
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "#092181"
                  },
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5 // Cambiado de "4px" a 0.5 (theme spacing)
                }}
                onClick={() => navigate('/login')}
              >
                Iniciar sesión
                <LoginIcon fontSize="small" />
              </Link>
            </Box>
          </Box>

      {/*  Snackbar con Alert */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={tipo}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {mensaje}
        </Alert>
      </Snackbar>
        </Paper>
      </Container>
    </Box>
  );
}