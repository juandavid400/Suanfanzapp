export interface UserI {
    $key: string
    email: string
    telefono?: {
        countryCode: string
        dialCode: string
        e164Number: string
        internationalNumber: string
        nationalNumber: string
        number: string
    };
    name: string
    lname: string
    password?: string
    socketID: string
}