import { OrderCreatedEvent, OrderStatus } from '@kntickets/common'
import { Message } from 'node-nats-streaming'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCreatedListener } from '../order-created-listener'
import mongoose  from 'mongoose'
import { Order } from '../../../models/order'

const setup = async() => {
    const listener = new OrderCreatedListener(natsWrapper.client)
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'randomTime',
        userId: 'randomUserId',
        status: OrderStatus.Created,
        ticket: {
            id: 'randomId',
            price: 10
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
}

it('replicates the order info', async () => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    console.log(data.id)

    const order = await Order.findById(data.id)

    console.log(order?.price, data.ticket.price)

    expect(order!.price).toEqual(data.ticket.price)
})

it('acks the message', async() => {
    const { listener, data, msg } = await setup()

    await listener.onMessage(data, msg)

    msg.ack()

    expect(msg.ack).toHaveBeenCalled()
})

