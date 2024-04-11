import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index';

export const signin = (formData, navigate) => async (dispatch) => {
    try {
        //log in the user 

        const {data} = await api.signIn(formData);

        dispatch({type : AUTH,data});

        navigate('/');
    } catch (error) {
        console.log(error)
    }
}
export const signup = (formData, navigate) => async (dispatch) => {
    try {
        //sign up the user
        console.log("in auth")

        const {result} = await api.signUp(formData);

        // console.log(data);

        dispatch({ type: 'AUTH', data: { result } });

        navigate('/');
    } catch (error) {
        console.log("Something wrong in actions")
        console.log(error)
    }
}