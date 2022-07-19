const fecha = document.querySelector('#fecha');
const lista = document.querySelector('#lista');
const input = document.querySelector('#input');
const botonEnter = document.querySelector('#enter');
const check = 'fa-check-circle';
const uncheck = 'fa-circle';
const lineThrough = 'line-through';
let id
let LIST

//creacion de fecha
const FECHA = new Date()
fecha.innerHTML = FECHA.toLocaleDateString('es-AR',{weekday:'long',month:'long',day:'numeric'})

//Clima
window.addEventListener('load', ()=> {
    let lon 
    let lat 
    let temperaturaValor = document.getElementById('temperatura-valor')
    let temperaturaDescripcion = document.getElementById('temperatura-descripcion')
    let ubicacion = document.getElementById('ubicacion')
    let iconoAnimado = document.getElementById('icono-animado')
    let vientoVelocidad = document.getElementById('viento-velocidad')

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition( posicion => {
            lon = posicion.coords.longitude
            lat = posicion.coords.latitude

            //ubicacion actual
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=839a3bf3798c48a3df5195e3151f4b73`

            fetch(url)
                .then( response => {return response.json();})
                .then( data => {
                    let temp = Math.round(data.main.temp)
                    temperaturaValor.textContent = `${temp}°C`
                    let desc = data.weather[0].description;
                    temperaturaDescripcion.textContent = desc.toUpperCase()
                    ubicacion.textContent = data.name
                    vientoVelocidad.textContent = `${data.wind.speed} m/s`

                    switch (data.weather[0].main) {
                        case 'Thunderstorm':
                          iconoAnimado.src='animated/thunder.svg'
                          break;
                        case 'Drizzle':
                          iconoAnimado.src='animated/rainy-2.svg'
                          break;
                        case 'Rain':
                          iconoAnimado.src='animated/rainy-7.svg'
                          break;
                        case 'Snow':
                          iconoAnimado.src='animated/snowy-6.svg'
                          break;                        
                        case 'Clear':
                            iconoAnimado.src='animated/day.svg'
                          break;
                        case 'Atmosphere':
                          iconoAnimado.src='animated/weather.svg'
                            break;  
                        case 'Clouds':
                            iconoAnimado.src='animated/cloudy-day-1.svg'
                            break;  
                        default:
                          iconoAnimado.src='animated/cloudy-day-1.svg'
                      }
                })
        })
    }
})


//funcion agregar tarea
function agregarTarea (tarea,id,realizado,eliminado){

    if(eliminado){return};

    const REALIZADO = realizado ?check :uncheck;
    const LINE = realizado ?lineThrough :'';

    const elemento = `
        <li id="elemento">
            <i class="far ${REALIZADO}" data="realizado" id=${id}></i>
            <p class="text ${LINE}">${tarea}</p>
            <i class="fas fa-trash de" data="eliminado" id=${id}></i>
        </li>
        `;
    lista.insertAdjacentHTML("beforeend",elemento);
}

//funcion de tarea realizada
function tareaRealizada(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector('.text').classList.toggle(lineThrough)
    LIST[element.id].realizado = LIST[element.id].realizado ?false :true;
}

//funcion de tarea eliminada
function tareaEliminada(element){
    element.parentNode.parentNode.removeChild(element.parentNode)
    LIST[element.id].eliminado = true;
}

//acciones
botonEnter.addEventListener('click',()=> {
    const tarea = input.value;
    if (tarea){
        agregarTarea(tarea,id,false,false);
        LIST.push({
            nombre: tarea,
            id:id,
            realizado:false,
            eliminado:false
        })
    }
    localStorage.setItem('TODO',JSON.stringify(LIST))
    input.value='';
    id++;
})

document.addEventListener('keyup',function(event){
    if(event.key=='Enter'){
        const tarea = input.value;
        if (tarea){
            agregarTarea(tarea,id,false,false);
            LIST.push({
                nombre: tarea,
                id:id,
                realizado:false,
                eliminado:false
            })
        }
    localStorage.setItem('TODO',JSON.stringify(LIST))
    input.value='';
    id++;
    }
})

lista.addEventListener('click',function(event){
    const element = event.target;
    const elementData = element.attributes.data.value;
    if (elementData==='realizado'){
        Swal.fire({
            position: 'ceneter',
            icon: 'success',
            title: 'Genial! Pudiste realizar dicha tarea!',
            showConfirmButton: false,
            timer: 1500
          })
        tareaRealizada(element);
    }
    else if (elementData==='eliminado'){
        Swal.fire({
            title: 'Estás seguro de borrar?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar tarea!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Tarea borrada!',
                'Tu tarea fue borrada exitosamente.',
                'success'
              )
            }
          })
        tareaEliminada(element);
    }
    localStorage.setItem('TODO',JSON.stringify(LIST))
})

//local storage get item

let data = localStorage.getItem('TODO')
    if(data){
        LIST=JSON.parse(data);
        id = LIST.length;
        cargarLista(LIST);
    }else {
        LIST = []
        id=0
    }

    function cargarLista(DATA) {
        DATA.forEach(function(i){
            agregarTarea(i.nombre,i.id,i.realizado,i.eliminado)
    })
}
