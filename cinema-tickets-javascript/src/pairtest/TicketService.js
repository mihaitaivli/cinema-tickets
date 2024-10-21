import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import CONFIG from "./ticketServiceConfig.json"
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";

export default class TicketService {
  #totalAmountToPay = 0;
  #paymentService = new TicketPaymentService();
  #noAdultTicketPresent = true;

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
    }

    if (this.#noAdultTicketPresent) {
      throw new InvalidPurchaseException(
        "At least one adult ticket must be purchased"
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
