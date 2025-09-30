import { message } from "antd"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { baseURL } from "../api/private.client"

const useSignUp = () => {
    const {login} = useAuth()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const registerUser = async (values) => {
        if (values.password !== values.passwordConfirm) {
            return setError('Passwords do not match')
        }
        try{
            setError(null)
            setLoading(true)
            const res = await fetch(baseURL + '/auth/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(values),
            })
            const data = await res.json()

            console.log(res.status)
            if(res.status === 201){
                message.success(data.message)
                login(data.token, data.user)
            }else if(data.status === 'fail' || res.status === 400){
                return setError(data.message)
            }
            else{
                message.error('Registration Failed')
            }
        }  catch (error) {
            console.log(error);
            setError('Registration Failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }
  return{ loading, error, registerUser }
}

export default useSignUp