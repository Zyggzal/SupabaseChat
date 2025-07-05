export type FormState = {
    success?: boolean,
    errors: string[]
}

export type ChatroomFormState = {
    success?: boolean,
    errors: {
        name?: string[],
        picture?: string[]
    }
}