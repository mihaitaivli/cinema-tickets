import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import { CONFIG } from "./ticketServiceConfig.js";

export default class TicketService {
  #totalAmountToPay = 0;
  #paymentService = new TicketPaymentService();
  #noAdultTicketPresent = true;
  #ticketsCount = 0;

  purchaseTickets(accountId, ...ticketTypeRequests) {
    if (!accountId) {
      throw new InvalidPurchaseException("An accountId is required");
    }

    if (!ticketTypeRequests.length) {
      throw new InvalidPurchaseException(
        "The array of ticketTypeRequests cannot be empty"
      );
    }

    for (const ticketTypeRequest of ticketTypeRequests) {
      if (!(ticketTypeRequest instanceof TicketTypeRequest)) {
        throw new InvalidPurchaseException(
          "ticketTypeRequests must be an instance of TicketTypeRequest"
        );
      }

      if (ticketTypeRequest.getTicketType() === 'ADULT') {
        this.#noAdultTicketPresent = false
      }

      this.#ticketsCount += ticketTypeRequest.getNoOfTickets()
    }

    if (this.#noAdultTicketPresent) {
      throw new InvalidPurchaseException(
        "At least one adult ticket must be purchased"
      )
    }

    if (this.#ticketsCount > CONFIG.maxNumberOfTickets) {
      throw new InvalidPurchaseException(
        // this is a hard guess, the limit is per transaction not customerId
        // but ideally we'll want to enforce per customer and event/show
        // TODO: check with PO to confirm ^
        `The maximum number of tickets that can be purchased was exceeded. Max allowed:${CONFIG.maxNumberOfTickets}, requested:${this.#ticketsCount}` 
      )
    }


    // for (const ticket of ticketTypeRequests) {
    //   this.#paymentService.makePayment(accountId, this.#totalAmountToPay)
    // }
  }

  // #calculateTotal(...ticketTypeRequests) {
  //   var totalAmountToPay = 0
  //   for (const ticket of ticketTypeRequests) {
  //     this.#totalAmountToPay += ticket.
  //   }
  // }
}
