import { APIResource } from "./resource.js";
import type { RequestOptions } from "../core/types.js";
import type { SendMessageResponse } from "../types/common.js";
import type {
  DeleteMessageParams,
  EditEventParams,
  EventResponseParams,
  ForwardMessageParams,
  NewsletterAdminInviteParams,
  OrderUpdateParams,
  PinMessageParams,
  ReadMessageParams,
  RemoveReactionParams,
  SendAudioParams,
  SendButtonActionsParams,
  SendButtonListParams,
  SendButtonOtpParams,
  SendButtonPixParams,
  SendCatalogParams,
  SendContactParams,
  SendContactsParams,
  SendDocumentParams,
  SendEventParams,
  SendGifParams,
  SendImageParams,
  SendLinkParams,
  SendLocationParams,
  SendOptionListParams,
  SendOrderParams,
  SendPollParams,
  SendPollVoteParams,
  SendProductParams,
  SendPtvParams,
  SendReactionParams,
  SendStickerParams,
  SendTextParams,
  SendVideoParams,
} from "../types/messages.js";

export class Messages extends APIResource {
  sendText(params: SendTextParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-text", { body: params, ...options });
  }

  sendImage(params: SendImageParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-image", { body: params, ...options });
  }

  sendAudio(params: SendAudioParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-audio", { body: params, ...options });
  }

  sendVideo(params: SendVideoParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-video", { body: params, ...options });
  }

  sendDocument(
    params: SendDocumentParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    const { extension, ...body } = params;
    return this._client.post(`/send-document/${encodeURIComponent(extension)}`, {
      body,
      ...options,
    });
  }

  sendLocation(
    params: SendLocationParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-location", { body: params, ...options });
  }

  sendContact(
    params: SendContactParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-contact", { body: params, ...options });
  }

  sendLink(params: SendLinkParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-link", { body: params, ...options });
  }

  sendReaction(
    params: SendReactionParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-reaction", { body: params, ...options });
  }

  removeReaction(
    params: RemoveReactionParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-remove-reaction", { body: params, ...options });
  }

  forward(params: ForwardMessageParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/forward-message", { body: params, ...options });
  }

  sendButtonList(
    params: SendButtonListParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-button-list", { body: params, ...options });
  }

  sendOptionList(
    params: SendOptionListParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-option-list", { body: params, ...options });
  }

  sendPoll(params: SendPollParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-poll", { body: params, ...options });
  }

  readMessage(params: ReadMessageParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/read-message", { body: params, ...options });
  }

  delete(params: DeleteMessageParams, options?: RequestOptions): Promise<unknown> {
    return this._client.delete("/messages", {
      query: {
        phone: params.phone,
        messageId: params.messageId,
        owner: params.owner,
      },
      ...options,
    });
  }

  sendSticker(params: SendStickerParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-sticker", { body: params, ...options });
  }

  sendGif(params: SendGifParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-gif", { body: params, ...options });
  }

  sendPtv(params: SendPtvParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-ptv", { body: params, ...options });
  }

  sendContacts(params: SendContactsParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-contacts", { body: params, ...options });
  }

  sendProduct(params: SendProductParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-product", { body: params, ...options });
  }

  sendCatalog(params: SendCatalogParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-catalog", { body: params, ...options });
  }

  sendButtonActions(
    params: SendButtonActionsParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-button-actions", { body: params, ...options });
  }

  sendButtonOtp(
    params: SendButtonOtpParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-button-otp", { body: params, ...options });
  }

  sendButtonPix(
    params: SendButtonPixParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-button-pix", { body: params, ...options });
  }

  sendPollVote(
    params: SendPollVoteParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-poll-vote", { body: params, ...options });
  }

  sendOrder(params: SendOrderParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-order", { body: params, ...options });
  }

  updateOrderStatus(params: OrderUpdateParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/order-status-update", { body: params, ...options });
  }

  updateOrderPayment(params: OrderUpdateParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/order-payment-update", { body: params, ...options });
  }

  pin(params: PinMessageParams, options?: RequestOptions): Promise<unknown> {
    return this._client.post("/pin-message", { body: params, ...options });
  }

  sendNewsletterAdminInvite(
    params: NewsletterAdminInviteParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-newsletter-admin-invite", { body: params, ...options });
  }

  sendEvent(params: SendEventParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-event", { body: params, ...options });
  }

  editEvent(params: EditEventParams, options?: RequestOptions): Promise<SendMessageResponse> {
    return this._client.post("/send-edit-event", { body: params, ...options });
  }

  sendEventResponse(
    params: EventResponseParams,
    options?: RequestOptions,
  ): Promise<SendMessageResponse> {
    return this._client.post("/send-event-response", { body: params, ...options });
  }
}
