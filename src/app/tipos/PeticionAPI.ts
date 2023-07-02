export type PeticionAPI = {
    method: TipoPeticion,
    
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    
    body: string
}

type TipoPeticion = 'GET' | 'POST';