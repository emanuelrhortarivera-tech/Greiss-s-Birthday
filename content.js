// =========================================================================
// 🎂 CONTENIDO PERSONALIZABLE DEL REGALO DE CUMPLEAÑOS PARA GREISS
// =========================================================================
// Puedes modificar fácilmente cualquier dato de este archivo sin romper el juego.
// Busca los comentarios con el icono 🔴 para saber exactamente qué cambiar.
// =========================================================================

// 🔴 CAMBIA AQUÍ EL CÓDIGO DE 4 DÍGITOS DE ACCESO (Por defecto: 2004)
const ACCESS_CODE = "2004";

// 🔴 CAMBIA AQUÍ EL NOMBRE DE LA CUMPLEAÑERA Y SU EDAD
const BIRTHDAY_PERSON = "Greiss";
const AGE = 20;

// 🔴 CAMBIA AQUÍ EL MENSAJE DE ERROR CUANDO INGRESA UN CÓDIGO INCORRECTO
const ERROR_CODE_MESSAGE = "❌ Código incorrecto";

// 🔴 CAMBIA AQUÍ LOS RECUERDOS (FOTOGRAFÍAS, MEMES, TÍTULOS Y TEXTOS)
const RECUERDOS_CONFIG = [
    {
        id: 1,
        titulo: "📸 Punto 1: Un Momento Inolvidable",
        texto: "¡Felices 20 años, Greiss! Aqui esta una hermosa imagen de mi y nosotros en Punta Cana. Buenos tiempos inolvidables muaajajaja",
        imagen: "assets/images/foto1.jpeg",
        icono: "📸",
        misionTexto: "✨ Recuerdo 1 desbloqueado: ¡Juntaste tus primeras 3 Monedas Mágicas! 🪙"
    },
    {
        id: 2,
        titulo: "😂 Punto 2: Una foto random",
        texto: "Cuando le tomaba fotos desprevenida, extraño sacarle las peores fotos del mundo sjjnsaf",
        imagen: "assets/images/foto2.jpeg",
        icono: "😂",
        misionTexto: "✨ Recuerdo 2 desbloqueado: ¡Juntaste 6 Monedas y abriste la caja de memes! 🪙"
    },
    {
        id: 3,
        titulo: "❤️ Punto 3: Nuestra Hermosa Amistad",
        texto: "Se que soy el mejor amigo que puede tener, asi que agradeceme por existir y poder ser mi amiga jijii",
        imagen: "assets/images/foto3.jpeg",
        icono: "💜",
        misionTexto: "✨ Recuerdo 3 desbloqueado: ¡Juntaste 9 Monedas de la Amistad! 🪙"
    },
    {
        id: 4,
        titulo: "🔑 Punto 4: La Llave Mágica del Cofre",
        texto: "Si sabe jugar, ahora abra el cofre pa ver la carta, sin llorar porfa.",
        imagen: "assets/images/foto4.jpeg",
        icono: "🔑",
        misionTexto: "✨ ¡Colección Completa de Monedas! ¡Obtuviste la Llave Mágica! 🔑"
    }
];

// 🔴 CAMBIA AQUÍ LA CARTA FINAL DE CUMPLEAÑOS
const FINAL_LETTER = `¡Querida Greiss! 💜

¡Felices 20 años! 🎂✨

Espero que puedas seguir cumpliendo muchos años más, que tenga salud, dinero y lo que mas le falta, amor. AJKSKASK mentiras. En este año espero cumpla sus metas y objetivos. Es una nueva decada de nuevas oportunidades, espero tambien que le vaya super en la carrera, sera tedioso pero nada en la vida es sencillo.
Gracias por permitirme ser su amigo jsjs, aunque deberia agradecerme a mi por aguantarme su desprecio, nunca olvidare un año para un abrazo KASKD. Igual hay que vivir la vida como si cada dia fuera el ultimo. Ojala podamos compartir tambien mas momentos juntos, pero como nunca sale con nadota pues como que moriremos asi, tipo salidas tranqui, ir a meter tussi, volvernos locos, pero no, esas salidas son muy tranquis para la niña. Espero le haya gustado mi regalo, o sea esta hermosa pagina con su YoungCock y los BTSIDA, espero reconozca mi desvelada. 
BYEE

-Emanuel (El mas hermoso de Neiva) 💜✨`;

// 🔴 CAMBIA AQUÍ LOS MENSAJES DE LA PANTALLA CELEBRACIÓN FINAL
const FINAL_SCREEN_CONFIG = {
    tituloBadge: "✨ MISIÓN COMPLETADA ✨",
    tituloPrincipal: "¡Feliz cumpleaños, Greiss! 💜",
    subtituloEdad: "¡Felices 20 años! 🎂✨",
    mensajeFinal: "Espero le haya gustado mi regalitooooooooo",
    fraseExtra: "¡Que tengas un día muy especial como tuuu! 🌟",
    botonReiniciar: "Jugar de nuevo 🔄"
};

// 🔴 DIÁLOGOS DE LOS NPCS DECORATIVOS DE BTS
const BTS_NPCS_DIALOGS = [
    { name: "RM 🐨", text: "¡Hola Greiss! ¡Recoge las monedas mágicas brillantes por el mapa para desbloquear todos tus recuerdos! ¡Felices 20! 💜" },
    { name: "Jin 🐹", text: "¡Worldwide Handsome te desea feliz cumpleaños! Junta 3 monedas por cada zona para abrir los recuerdos especiales. 🎂" },
    { name: "Suga 🐱", text: "¡Hey Greiss! Hay 12 monedas doradas escondidas. ¡Encuéntralas todas para conseguir la llave del cofre! 🪙" },
    { name: "J-Hope 🐿️", text: "¡I'm your hope! ¡Sigue juntando monedas brillantes con mucha energía, Greiss! ✨" },
    { name: "Jimin 🐥", text: "¡Greiss! Cada moneda recolectada guardará un recuerdo hermoso de tu cumpleaños. 💜" },
    { name: "V 🐻", text: "¡Borahae Greiss! 💜 Las monedas doradas iluminan el camino hacia la carta final de cumpleaños." },
    { name: "Jungkook 🐰", text: "¡Felices 20 Greiss! ¡Consigue las 12 monedas y abre el gran cofre mágico! Fighting! 💪💜" }
];
