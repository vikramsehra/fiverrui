import React from 'react';
import "./Message.scss";
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest.js';

const Message = () => {

    const { id } = useParams();

    const queryClient = useQueryClient();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const { isLoading, error, data } = useQuery({
        queryKey: ['message'],
        queryFn: () => newRequest.get(`/message/${id}`).then(res => {
            return res.data;
        })
    });

    const mutation = useMutation({
        mutationFn: (message) => {
            return newRequest.post(`/message`, message)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["message"])
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({
            conversationId: id,
            desc: e.target[0].value,
        });

        e.target[0].value = "";
    }

    return (
        <div className='message'>
            <div className="container">
                <span className="breadcrumbs">
                    <Link to="/messages">MESSAGES</Link> - Vikram
                </span>
                {isLoading ? ("Loading...") : error ? ("Something went wrong!") :
                    (<div className="messages">
                        {data.map((m) => (
                            <div className={m.userId === currentUser._id ? "owner item" : "item"} key={m._id}>
                                <img
                                    src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                                    alt=""
                                />
                                <p>{m.desc}</p>
                            </div>
                        ))}
                    </div>)}

                <hr />
                <form className="write" onSubmit={handleSubmit}>
                    <textarea type="text" placeholder='write a message' id="" cols="30" rows="10"></textarea>
                    <button type='submit'>Send</button>
                </form>
            </div>
        </div>
    )
}

export default Message