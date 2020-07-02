import { OrderCancelledEvent, Subjects, Listener, OrderStatus } from '@kntickets/common'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'
import { Message } from 'node-nats-streaming'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName: 'payments-service' = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message){
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1 
        })

        if(!order) throw new Error('Order not found')

        order.set({
            status: OrderStatus.Cancelled
        })

        await order.save()
        msg.ack()
    }
}