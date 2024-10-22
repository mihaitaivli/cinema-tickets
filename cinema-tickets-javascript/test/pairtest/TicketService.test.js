import TicketService from '../../src/pairtest/TicketService.js'
import TicketTypeRequest from '../../src/pairtest/lib/TicketTypeRequest.js'
import InvalidPurchaseException from '../../src/pairtest/lib/InvalidPurchaseException.js'
import {
  PRICES,
  MAX_NUMBER_OF_TICKETS,
} from '../../src/pairtest/ticketServiceConfig.js'
import TicketPaymentService from '../../src/thirdparty/paymentgateway/TicketPaymentService.js'
import SeatReservationService from '../../src/thirdparty/seatbooking/SeatReservationService.js'

const SINGLE_INFANT_TICKET = new TicketTypeRequest('INFANT', 1)
const SINGLE_CHILD_TICKET = new TicketTypeRequest('CHILD', 1)
const SINGLE_ADULT_TICKET = new TicketTypeRequest('ADULT', 1)

const FIVE_INFANT_TICKETS = new TicketTypeRequest('INFANT', 5)
const THREE_CHILD_TICKETS = new TicketTypeRequest('CHILD', 3)
const FIVE_ADULT_TICKET = new TicketTypeRequest('ADULT', 5)

describe('TicketService', () => {
  let ticketService
  let spy
  const accountId = 1

  beforeEach(() => {
    ticketService = new TicketService()
  })

  describe('exceptions', () => {
    describe('accountId', () => {
      it('should throw InvalidPurchaseException if not provided', () => {
        const t = () => ticketService.purchaseTickets()

        expect(t).toThrow(InvalidPurchaseException)
        expect(t).toThrow('A valid accountId is required')
      })

      it('should throw InvalidPurchaseException if is zero', () => {
        const t = () => ticketService.purchaseTickets(0)

        expect(t).toThrow(InvalidPurchaseException)
        expect(t).toThrow('A valid accountId is required')
      })

      it('should throw InvalidPurchaseException if negative', () => {
        const t = () => ticketService.purchaseTickets(-2)

        expect(t).toThrow(InvalidPurchaseException)
        expect(t).toThrow('A valid accountId is required')
      })

      it('should throw InvalidPurchaseException if accountId is not a number', () => {
        const t = () => ticketService.purchaseTickets('2')

        expect(t).toThrow(InvalidPurchaseException)
        expect(t).toThrow('A valid accountId is required')
      })
    })

    describe('ticketTypeRequest', () => {
      it('should throw InvalidPurchaseException if ticketTypeRequests are not provided', () => {
        const t = () => ticketService.purchaseTickets(accountId)

        expect(t).toThrow(InvalidPurchaseException)
        expect(t).toThrow('The array of ticketTypeRequests cannot be empty')
      })

      it('should throw InvalidPurchaseException if ticketTypeRequests are invalid', () => {
        const t = () => ticketService.purchaseTickets(accountId, {})

        expect(t).toThrow(InvalidPurchaseException)
        expect(t).toThrow(
          'ticketTypeRequests must be an instance of TicketTypeRequest'
        )
      })
    })

    describe('business logic', () => {
      it('should throw InvalidPurchaseException if no adult ticket is purchased', () => {
        const t = () =>
          ticketService.purchaseTickets(accountId, SINGLE_INFANT_TICKET)

        expect(t).toThrow(InvalidPurchaseException)
        expect(t).toThrow('At least one adult ticket must be purchased')
      })

      it(`should throw InvalidPurchaseException if more than ${MAX_NUMBER_OF_TICKETS} tickets are purchased`, () => {
        const moreTicketsThanMaxAllowed = [
          SINGLE_ADULT_TICKET,
          new TicketTypeRequest('INFANT', MAX_NUMBER_OF_TICKETS),
        ]
        const t = () =>
          ticketService.purchaseTickets(accountId, ...moreTicketsThanMaxAllowed)

        expect(t).toThrow(
          `The maximum number of tickets that can be purchased was exceeded. Max allowed: ${MAX_NUMBER_OF_TICKETS}`
        )
        expect(t).toThrow(InvalidPurchaseException)
      })

      it('should throw InvalidPurchaseException if more infants than adults', () => {
        const t = () =>
          ticketService.purchaseTickets(
            accountId,
            SINGLE_ADULT_TICKET,
            FIVE_INFANT_TICKETS
          )

        expect(t).toThrow('There are more infant tickets than adult tickets')
        expect(t).toThrow(InvalidPurchaseException)
      })
    })
  })

  describe('integration', () => {
    describe('should call the paymentService with the correct amount', () => {
      beforeEach(() => {
        spy = jest.spyOn(TicketPaymentService.prototype, 'makePayment')
      })

      afterEach(() => {
        spy.mockRestore()
      })

      it('for an adult', () => {
        ticketService.purchaseTickets(accountId, SINGLE_ADULT_TICKET)

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(accountId, PRICES.ADULT)
      })

      it('for an adult and an infant', () => {
        ticketService.purchaseTickets(
          accountId,
          SINGLE_ADULT_TICKET,
          SINGLE_INFANT_TICKET
        )

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(accountId, PRICES.ADULT)
      })

      it('for an adult and a child', () => {
        ticketService.purchaseTickets(
          accountId,
          SINGLE_ADULT_TICKET,
          SINGLE_CHILD_TICKET
        )

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(accountId, PRICES.ADULT + PRICES.CHILD)
      })

      it('for a combination of adults, children and infants', () => {
        const expectedAmount =
          PRICES.ADULT * 5 + PRICES.CHILD * 3 + PRICES.INFANT * 5

        ticketService.purchaseTickets(
          accountId,
          FIVE_ADULT_TICKET,
          THREE_CHILD_TICKETS,
          FIVE_INFANT_TICKETS
        )

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(accountId, expectedAmount)
      })
    })

    describe('should call the seatReservationService with the correct number of seats', () => {
      beforeEach(() => {
        spy = jest.spyOn(SeatReservationService.prototype, 'reserveSeat')
      })

      afterEach(() => {
        spy.mockRestore()
      })

      it('for an adult', () => {
        ticketService.purchaseTickets(accountId, SINGLE_ADULT_TICKET)

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(accountId, 1)
      })

      it('for an adult and an infant', () => {
        ticketService.purchaseTickets(
          accountId,
          SINGLE_ADULT_TICKET,
          SINGLE_INFANT_TICKET
        )

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(accountId, 1)
      })

      it('for an adult and a child', () => {
        ticketService.purchaseTickets(
          accountId,
          SINGLE_ADULT_TICKET,
          SINGLE_CHILD_TICKET
        )

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(accountId, 2)
      })

      it('for a combination of adults, children and infants', () => {
        ticketService.purchaseTickets(
          accountId,
          FIVE_ADULT_TICKET,
          THREE_CHILD_TICKETS,
          FIVE_INFANT_TICKETS
        )

        expect(spy).toHaveBeenCalledTimes(1)
        expect(spy).toHaveBeenCalledWith(accountId, 8)
      })
    })
  })
})
