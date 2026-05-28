import type { UrlOrBase64 } from "./common.js";

interface BaseSendParams {
  /** Recipient phone (with country code) or group ID. */
  phone: string;
  /** Delay in seconds before sending. */
  delayMessage?: number;
}

export interface SendTextParams extends BaseSendParams {
  message: string;
  delayTyping?: number;
  /** Message ID being replied to. */
  messageId?: string;
  /** ID of a previously sent message to edit. */
  editMessageId?: string;
  /** Phone numbers to mention (groups). */
  mentioned?: string[];
}

export interface SendImageParams extends BaseSendParams {
  image: UrlOrBase64;
  caption?: string;
  messageId?: string;
  viewOnce?: boolean;
}

export interface SendAudioParams extends BaseSendParams {
  audio: UrlOrBase64;
  delayTyping?: number;
  viewOnce?: boolean;
}

export interface SendVideoParams extends BaseSendParams {
  video: UrlOrBase64;
  caption?: string;
  messageId?: string;
  viewOnce?: boolean;
}

export interface SendDocumentParams extends BaseSendParams {
  /** File extension used in the path, e.g. "pdf", "docx". */
  extension: string;
  document: UrlOrBase64;
  fileName?: string;
  caption?: string;
  messageId?: string;
}

export interface SendLocationParams extends BaseSendParams {
  title: string;
  address: string;
  latitude: string;
  longitude: string;
  messageId?: string;
}

export interface SendContactParams extends BaseSendParams {
  contactName: string;
  contactPhone: string;
  contactBusinessDescription?: string;
  messageId?: string;
}

export interface SendLinkParams extends BaseSendParams {
  message: string;
  image: string;
  linkUrl: string;
  title: string;
  linkDescription: string;
  delayTyping?: number;
  linkType?: "SMALL" | "LARGE";
}

export interface SendReactionParams extends BaseSendParams {
  reaction: string;
  messageId: string;
}

export interface RemoveReactionParams extends BaseSendParams {
  messageId: string;
}

export interface ForwardMessageParams extends BaseSendParams {
  messageId: string;
  /** Phone the original message belongs to. */
  messagePhone: string;
}

export interface ButtonListButton {
  id?: string;
  label: string;
}

export interface SendButtonListParams extends BaseSendParams {
  message: string;
  buttonList: {
    buttons: ButtonListButton[];
    image?: string;
    video?: string;
  };
}

export interface OptionListOption {
  id?: string;
  title: string;
  description?: string;
}

export interface SendOptionListParams extends BaseSendParams {
  message: string;
  optionList: {
    title: string;
    buttonLabel: string;
    options: OptionListOption[];
  };
}

export interface SendPollParams extends BaseSendParams {
  message: string;
  poll: { name: string }[];
  pollMaxOptions?: number;
}

export interface ReadMessageParams {
  phone: string;
  messageId: string;
}

export interface DeleteMessageParams {
  phone: string;
  messageId: string;
  /** Whether the message belongs to the instance (true) or the contact. */
  owner?: boolean;
}

export interface SendStickerParams extends BaseSendParams {
  sticker: UrlOrBase64;
  messageId?: string;
  stickerAuthor?: string;
}

export interface SendGifParams extends BaseSendParams {
  gif: UrlOrBase64;
  caption?: string;
  messageId?: string;
}

export interface SendPtvParams extends BaseSendParams {
  ptv: UrlOrBase64;
  messageId?: string;
}

export interface ContactCard {
  name: string;
  phones: string[];
  businessDescription?: string;
}

export interface SendContactsParams extends BaseSendParams {
  contacts: ContactCard[];
  messageId?: string;
}

export interface SendProductParams extends BaseSendParams {
  catalogPhone: string;
  productId: string;
}

export interface SendCatalogParams extends BaseSendParams {
  catalogPhone: string;
}

export interface ButtonAction {
  id?: string;
  type: "CALL" | "URL" | "REPLY";
  label: string;
  phone?: string;
  url?: string;
}

export interface SendButtonActionsParams extends BaseSendParams {
  message: string;
  title?: string;
  footer?: string;
  buttonActions: ButtonAction[];
}

export interface SendButtonOtpParams extends BaseSendParams {
  message: string;
  code: string;
  image?: string;
}

export interface SendButtonPixParams extends BaseSendParams {
  pixKey: string;
  type: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "EVP";
}

export interface SendPollVoteParams extends BaseSendParams {
  pollMessageId: string;
  pollVote: { name: string }[];
}

export interface OrderProduct {
  productId: string;
  name: string;
  value: number;
  quantity: number;
  isCustomItem?: boolean;
}

export interface Order {
  currency: string;
  products: OrderProduct[];
  discount?: number;
  tax?: number;
  shipping?: number;
}

export interface PaymentSettings {
  pix?: { key: string; keyType: string; name: string };
  card?: { enabled: boolean };
}

export interface SendOrderParams extends BaseSendParams {
  order: Order;
  paymentSettings: PaymentSettings;
}

export interface OrderUpdateParams {
  phone: string;
  messageId: string;
  referenceId: string;
  orderRequestId: string;
  orderStatus: string;
  paymentStatus: string;
  order: Order;
  message?: string;
}

export interface PinMessageParams {
  phone: string;
  messageId: string;
  messageAction: "pin" | "unpin";
  pinMessageDuration?: "24_hours" | "7_days" | "30_days";
}

export interface NewsletterAdminInviteParams {
  phone: string;
  adminInviteMessage: {
    newsletterId: string;
    caption: string;
  };
}

export interface CalendarEvent {
  name: string;
  description?: string;
  /** ISO 8601 date-time. */
  dateTime: string;
  location?: { name: string };
  callLinkType?: "voice" | "video";
  canceled?: boolean;
}

export interface SendEventParams {
  phone: string;
  event: CalendarEvent;
  delayMessage?: number;
}

export interface EditEventParams {
  phone: string;
  eventMessageId: string;
  event: CalendarEvent;
}

export interface EventResponseParams {
  phone: string;
  eventMessageId: string;
  eventResponse: "GOING" | "NOT_GOING" | "MAYBE";
}
