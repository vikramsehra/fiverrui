import React from 'react';
import "./Orders.scss"
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';

const Orders = () => {
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const { isLoading, error, data } = useQuery({
        queryKey: ['order'],
        queryFn: () => newRequest.get(`/order`).then(res => {
            return res.data;
        })
    });

    const handleContact = async (order) => {
        const sellerId = order.sellerId;
        const buyerId = order.buyerId;
        const id = sellerId + buyerId;
        try {
            const res = await newRequest.get(`/conversation/single/${id}`);
            navigate(`/message/${res.data.id}`);
        } catch (err) {
            if (err.response.status === 404) {
                const res = await newRequest.post(`/conversation`, { to: currentUser.isSeller ? buyerId : sellerId })
                navigate(`/message/${res.data.id}`);
            }
        }
    }

    return (
        <div className='orders'>
            {isLoading ? ("Loading...") : error ? ("Something went wrong!") :
                (<div className="container">
                    <div className="title">
                        <h1>Orders</h1>
                    </div>
                    <table>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Contact</th>
                        </tr>
                        {data.map((order) => (
                            <tr key={order._id}>
                                <td>
                                    <img className='img' src={order.img} alt="" />
                                </td>
                                <td>{order.title}</td>
                                <td>{order.price}</td>
                                <td>
                                    <img className='delete' src="/img/message.png" alt="" onClick={() => handleContact(order)} />
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>)}
        </div>
    )
}

export default Orders