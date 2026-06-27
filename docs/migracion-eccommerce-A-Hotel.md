 
 
 
 
 product: => suitCategory
    se quitan las siguientes columnas:
        -outStock
        -topProduct

    se agregan las siguientes columnas:
        -signPrice number "representa el costo de reservar una habitacion de esa categoria, si es 0 no tiene costo de reserva y por lo tanto no hay que pagar"

product images => suitCategoryImages
    se mantiene igual solo con un cambio de nombre y con relacion a suit en vez de product

suit: "nueva entidad que va a representar la habitacion fisica"
    -id number
    -number number
    -status  disponible, no disponible, en mantenimiento, en limpieza, ocupada
    -deleted

 orders: => booking
    se quitan las siguientes columnas:
        -products
        -Total
        -address
        -trackingNumber
    se agregan las siguientes columnas:
        -suitId => se le asigna una automanticamente pero que sea editable por el admin
        -startDate => fecha de ingreso de la suit
        -endDate => fecha de egreso de la suit
        -suitId => relacion a la suit reservada
        -TotalPrice => es el pago total que tendrá que hacer el cliente por su reserva
        -surchargePrice => es el recargo por cualquier daño que pudiera causar el cliente, opcional
        -totalClientPayment => se va sumando toda la plata que puso el cliente incluyendo recargos, costo de reserva, pago por los dias u horas
        





backoffice: "todas las modificaciones del portal del administrador"

Suits "nuevo boton en el home"
Bookings "nuevo boton en el home"

    vista suits:
        -vemos el suitCategory con imagen ilustrativa como botón e informacion basica a mano
            -vista de suitCategory:
                -cuadricula de suits con vistazo rapido de status con color, number, time stamp con dias, horas y minutos para finalizar el hospedaje
                    -modal de suit:
                        -muestra los datos de la entidad suit y tambien de la reserva en curso en caso de haberla
                        -boton de ir a la reserva
                        -switch de status (validar si hay reserva)

    vista bookings:
        -boton de crear reserva
        -tabla de bookings estilo devExtreme o similar, cambiar status, editar reserva => "debe haber un menu desplegable para modificar el status"

        vista crear booking:
            -datos del cliente (si corresponde, en telo no)
            -seleccionar habitacion con un select de numeros (solo las disponibles)
            -fecha de inicio, fecha de fin
        
