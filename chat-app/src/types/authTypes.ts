export type UserProfile = {
    id: number,
    name: string,
    email: string,
    image_url: string
}

export type AuthFormState = {
    success?: boolean, 
    message?: string,
    errors: {
        email?: string[],
        password?: string[]
    }
}

export type ProfileState = {
    success?: boolean,
    errors: string[]
}