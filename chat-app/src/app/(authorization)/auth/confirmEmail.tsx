export default function ConfirmEmail() {
    return <div className="bg-gray-300 flex flex-col items-center gap-y-5 p-5 pt-25 h-100 shadow-lg w-130">
        <h1 className="font-bold text-3xl mb-5">SUCCESS</h1>

        <h4 className="font-bold text-lg">A confirmation email has been sent to your inbox</h4>
        <p>Please, confirm your email and your registration will be complete!</p>
        {/* <div className="flex flex-col items-center gap-y-10">

            <div className="w-full h-max flex flex-col gap-y-4">
                <label className="px-5 flex justify-between items-center w-full text-2xl">Email: <input className="w-7/10 text-lg rounded-md p-4 bg-gray-400 text-indigo-500 placeholder-white" type="text" name="email" placeholder="somebody@gmail.com"/></label>
                { state.errors.email && <span className="text-red-500 ml-5">{state.errors.email}</span> }
            </div>
            <div className="w-full h-max flex flex-col gap-y-4">
                <label className="px-5 flex justify-between items-center w-full text-2xl">Password: <input className="w-7/10 text-lg rounded-md p-4 bg-gray-400 text-indigo-500 placeholder-white" type="password" name="password" placeholder="your password"/></label>
                { state.errors.password && <span className="text-red-500 ml-5">{state.errors.password}</span> }

            </div> 
        </div>

        <div className="flex flex-col items-center">
            <ActionButton pending={pending}>Sign In</ActionButton>
            { state.message && <span className="text-red-500 pt-4">{state.message}</span> }
        </div> */}
    </div>
}