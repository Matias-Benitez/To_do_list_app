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
fecha.innerHTML = FECHA.toLocaleDateString('es-AR',{weekday:'long',month:'short',day:'numeric'})


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