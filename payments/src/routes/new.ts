import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@kntickets/common'
import { Order } from '../models/order'
import { stripe } from '../stripe'
import { Payment } from '../models/payment'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post('/api/payments', requireAuth, [
    body('token').not().isEmpty().withMessage('Something missing'),
    body('orderId').not().isEmpty().withMessage('Something does not look right')
],
validateRequest,
async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if(!order) throw new NotFoundError()

    console.log(order.userId, req.currentUser!.id)

    if(order.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    if(order.status === OrderStatus.Cancelled) throw new BadRequestError('Ticket Cancelled')

    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token,
        description: "Order placed",
        shipping: {
            name: 'Jenny Rosen',
            address: {
              line1: '510 Townsend St',
              postal_code: '98140',
              city: 'San Francisco',
              state: 'CA',
              country: 'US',
            },
          },
    })

    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    })

    await payment.save()

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    })

    res.status(201).send({ id: payment.id })
})

export { router as createChargeRouter }