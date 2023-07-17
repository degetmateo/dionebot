export type PeticionAPI = {
    method: TipoConsulta,
    
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    
    body: string
}

export type TipoConsulta = 'GET' | 'POST';