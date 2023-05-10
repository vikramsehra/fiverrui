import React from 'react';
import "./Messages.scss"
import { Link } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import moment from "moment"

const Messages = () => {
    const queryClient = useQueryClient();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const { isLoading, error, data } = useQuery({
        queryKey: ['messages'],
        queryFn: () => newRequest.get(`/conversation`).then(res => {
            return res.data;
        })
    });

    const mutation = useMutation({
        mutationFn: (id) => {
            return newRequest.put(`/conversation${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["conversation"])
        }
    })

    const handleRead = (id) => {
        mutation.mutate(id)
    }

    return (
        <div className='messages'>
            {isLoading ? ("Loading...") : error ? ("Something went wrong!") :
                (<div className="container">
                    <div className="title">
                        <h1>Messages</h1>
                    </div>
                    <table>
                        <tr>
                            <th>{currentUser.isSeller ? "Buyer" : "Seller"}</th>
                            <th>Last Message</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                        {data.map((c) => (
                            <tr className={((currentUser.isSeller && !c.readBySeller) || (!currentUser.isSeller && !c.readByBuyer)) && "active"} key={c.id}>
                                <td>
                                    {currentUser.isSeller ? c.buyerId : c.sellerId}
                                </td>
                                <td><Link to={`/message/${c.id}`} className="link"> {c?.lastMessage?.substring(0, 100)}...</Link></td>
                                <td>{moment(c.updatedAt).fromNow()}</td>
                                <td>
                                    {
                                        ((currentUser.isSeller && !c.readBySeller) || (!currentUser.isSeller && !c.readByBuyer)) &&
                                        (<button onClick={() => handleRead(c.id)} >Mark as Read</button>)
                                    }
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>)}
        </div>
    )
}

export default Messages