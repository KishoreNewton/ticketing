import { ExpirationCompleteListner } from '../expiration-complete-listener'
import { OrderStatus, ExpirationCompleteEvent } from '@kntickets/common'
import { Message } from 'node-nats-streaming'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'
import { json } from 'express'

const setup = async() => {
    const listener = new ExpirationCompleteListner(natsWrapper.client)

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'This is a test title',
        price: 20
    })

    await ticket.save()
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'somethingoverhere',
        expiresAt: new Date(),
        ticket,
    })
    await order.save()

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, order, ticket, data, msg }
}

it('updates the order status to cancelled', async() => {
    const { listener, order, ticket, data, msg } = await setup()
    await listener.onMessage(data, msg)
    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an OrderCancelled event', async () => {
    const { listener, order, ticket, data, msg } = await setup()
    await listener.onMessage(data, msg)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(eventData.id).toEqual(order.id)
    console.log(eventData.id, order.id)
})

it('acks the message', async() => {
    const { listener, order, ticket, data, msg } = await setup()
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})