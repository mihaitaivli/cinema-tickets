import TicketTypeRequest from './lib/TicketTypeRequest.js'
import InvalidPurchaseException from './lib/InvalidPurchaseException.js'
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js'
import { PRICES, MAX_NUMBER_OF_TICKETS } from './ticketServiceConfig.js'
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js'

export default class TicketService {
  #paymentService = new TicketPaymentService()
  #seatReservationService = new SeatReservationService()

  #numberOfInfantTickets = 0
  #numberOfChildTickets = 0
  #numberOfAdultTickets = 0
  #totalToPay = 0

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // validate the request
    this.#validateRequest(accountId, ticketTypeRequests)

    // calculate totals and count tickets
    this.#tallyUp(ticketTypeRequests)

    // validate business logic
    this.#validateBusinessLogic()

    // call the payment service
    this.#paymentService.makePayment(accountId, this.#totalToPay)

    // call the seat reservation service
    this.#seatReservationService.reserveSeat(
      accountId,
      this.#numberOfAdultTickets + this.#numberOfChildTickets
    )
  }

  #validateRequest(accountId, ticketTypeRequests) {
    if (!accountId || accountId < 0 || !Number.isSafeInteger(accountId)) {
      this.#logError(`Error validating the accountId, got: ${accountId}`)
      this.#throwError('A valid accountId is required')
    }

    if (!ticketTypeRequests.length) {
      this.#throwError('The array of ticketTypeRequests cannot be empty')
    }

    for (const ticketTypeRequest of ticketTypeRequests) {
      if (!(ticketTypeRequest instanceof TicketTypeRequest)) {
        this.#throwError(
          'ticketTypeRequests must be an instance of TicketTypeRequest'
        )
      }
    }
  }

  #tallyUp(ticketTypeRequests) {
    for (const ticketTypeRequest of ticketTypeRequests) {
      switch (ticketTypeRequest.getTicketType()) {
        case 'ADULT':
          this.#numberOfAdultTickets += ticketTypeRequest.getNoOfTickets()
          this.#totalToPay += this.#numberOfAdultTickets * PRICES.ADULT
          break
        case 'CHILD':
          this.#numberOfChildTickets += ticketTypeRequest.getNoOfTickets()
          this.#totalToPay += this.#numberOfChildTickets * PRICES.CHILD
          break
        case 'INFANT':
          this.#numberOfInfantTickets += ticketTypeRequest.getNoOfTickets()
          this.#totalToPay += this.#numberOfChildTickets * PRICES.INFANT
          break
        default:
          break
      }
    }
  }

  #validateBusinessLogic() {
    if (this.#numberOfAdultTickets === 0) {
      this.#throwError('At least one adult ticket must be purchased')
    }

    if (
      this.#numberOfAdultTickets +
        this.#numberOfChildTickets +
        this.#numberOfInfantTickets >
      MAX_NUMBER_OF_TICKETS
    ) {
      this.#throwError(
        `The maximum number of tickets that can be purchased was exceeded. Max allowed:${MAX_NUMBER_OF_TICKETS}, requested:${
          this.#numberOfAdultTickets +
          this.#numberOfChildTickets +
          this.#numberOfInfantTickets
        }`
      )
    }

    if (this.#numberOfAdultTickets < this.#numberOfInfantTickets) {
      this.#throwError(
        `There are more infants(${this.#numberOfInfantTickets}) than adults(${
          this.#numberOfAdultTickets
        })`
      )
    }
  }

  // TODO: replace with an adequate logger/service
  #logError(msg) {
    console.info(new Date().toISOString(), msg)
  }

  #throwError(msg) {
    throw new InvalidPurchaseException(msg)
  }
}
