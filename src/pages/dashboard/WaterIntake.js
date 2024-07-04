import React, { useState, useEffect } from 'react';
import addIntakeImage from "../../images/addIntake.jpg"
import doneIntakeImage from "../../images/doneIntake.jpg"
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { db, auth } from '../../config/firebase';
import { addDoc, getDocs, collection, query, where } from 'firebase/firestore';
import checkAuth from '../../components/authorize/checkAuth';

 const WaterIntake=() =>{
    const [intake, setIntake] = useState(false);

    const intakeCollectionRef = collection(db, "water-intakes");

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const entryToday = query(intakeCollectionRef, where("userId", "==", auth.currentUser?.uid || " "), where("entryDate", ">", startOfToday));

    const getentryToday = () => {
        getDocs(entryToday).then((data) => {
            if (data.docs.length > 0) {
                setIntake(true);
            }
        });
    }

    useEffect(() => {
        getentryToday();
    }, []);

    const formSchema = yup.object().shape({
        intake: yup.number().integer().min(0).typeError("Enter the number of glasses!").required("You must enter today's water intake !")
    })

    const { register,
        handleSubmit,
        formState: { errors } } = useForm({ resolver: yupResolver(formSchema) });

    const postCollectionRef = collection(db, "water-intakes");

    const onAddIntake = (data) => {
        addDoc(postCollectionRef, {
            entryDate: new Date(),
            intake: data.intake,
            userId: auth.currentUser?.uid
        }).then(() => {
            console.log("Date entered!!");
            setIntake(true);

        }).catch(error => {
            console.error(error);
        });
    }

    return (
        <div>
            <h1 className='mt-4'>Add Water Intake</h1>
            {intake ? (<><div className="my-5 w-25 mx-auto">
                <img src={doneIntakeImage} alt="No more entries." width="100" className="rounded-circle shadow-4-strong" />
                <div className="alert alert-success my-3" role="alert">
                    You have enterd today's water intake!
                </div>
            </div>
            </>) : (<><div className="my-5 w-25 mx-auto">
                <form onSubmit={handleSubmit(onAddIntake)}>
                    <img src={addIntakeImage} alt="Add water intake." width="100" className="rounded-circle shadow-4-strong" />
                    <input type='text' className='form-control my-3' placeholder='How many glasses of water did you drink today?' {...register("intake")} />
                    <p className='text-danger'>{errors ? errors.intake?.message : " "}</p>
                    <input className='btn btn-secondary btn-lg' type='submit' />
                </form>
            </div>

            </>)}


        </div>
    )
}

export default checkAuth(WaterIntake);