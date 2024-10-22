import TicketService from "../../src/pairtest/TicketService.js";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException.js";
import { CONFIG } from "../../src/pairtest/ticketServiceConfig.js";

const MAX_NUMBER_OF_TICKETS = CONFIG.maxNumberOfTickets
const SINGLE_INFANT_TICKET = new TicketTypeRequest("INFANT", 1)
const SINGLE_ADULT_TICKET = new TicketTypeRequest("ADULT", 1)

describe("TicketService", () => {
  let ticketService;
  const accountId = 1;

  beforeEach(() => {
    ticketService = new TicketService();
  });

  it("should throw InvalidPurchaseException if accountId is not provided", () => {
    const t = () => ticketService.purchaseTickets();
    
    expect(t).toThrow(InvalidPurchaseException);
    expect(t).toThrow("An accountId is required");
  });

  it("should throw InvalidPurchaseException if ticketTypeRequests are not provided", () => {
    const t = () => ticketService.purchaseTickets(accountId);

    expect(t).toThrow(InvalidPurchaseException);
    expect(t).toThrow("The array of ticketTypeRequests cannot be empty");
  });

  it("should throw InvalidPurchaseException if ticketTypeRequests are invalid", () => {
    const t = () => ticketService.purchaseTickets(accountId, {});

    expect(t).toThrow(InvalidPurchaseException);
    expect(t).toThrow("ticketTypeRequests must be an instance of TicketTypeRequest");
  });

  it("should throw InvalidPurchaseException if no adult ticket is purchased", () => {
    const t = () => ticketService.purchaseTickets(accountId, SINGLE_INFANT_TICKET);
    
    expect(t).toThrow(InvalidPurchaseException);
    expect(t).toThrow("At least one adult ticket must be purchased");
  });

  it(`should throw InvalidPurchaseException if more than ${MAX_NUMBER_OF_TICKETS} tickets are purchased`, () => {
    const moreTicketsThanMaxAllowed = [SINGLE_ADULT_TICKET, new TicketTypeRequest("INFANT", MAX_NUMBER_OF_TICKETS)];
    const t = () => ticketService.purchaseTickets(accountId, ...moreTicketsThanMaxAllowed);

    expect(t).toThrow(`The maximum number of tickets that can be purchased was exceeded. Max allowed:${CONFIG.maxNumberOfTickets}, requested:${moreTicketsThanMaxAllowed.length}` );
    expect(t).toThrow(InvalidPurchaseException);
  })
});
