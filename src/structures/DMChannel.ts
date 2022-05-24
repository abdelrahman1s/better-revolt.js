import { Channel as APIChannel } from 'revolt-api'
import { Channel, Message } from '.'
import { TextBasedChannel } from './interfaces'
import { Client, MessageManager, MessageOptions } from '..'
import { ChannelTypes, DEFAULT_PERMISSION_DM } from '../util'

type APIDirectChannel = Extract<APIChannel, { channel_type: 'DirectMessage' }>

export class DMChannel extends Channel<APIDirectChannel> implements TextBasedChannel {
    readonly type = ChannelTypes.DM
    active!: boolean
    permissions = DEFAULT_PERMISSION_DM
    messages = new MessageManager(this)
    lastMessageId: string | null = null

    constructor(client: Client, data: APIDirectChannel) {
        super(client, data)
        this._patch(data)
    }

    protected _patch(data: APIDirectChannel): this {
        super._patch(data)

        if (typeof data.active === 'boolean') {
            this.active = data.active
        }

        return this
    }
    send(options: MessageOptions | string): Promise<Message> {
        return this.messages.send(options)
    }

    get lastMessage(): Message | null {
        if (!this.lastMessageId) return null
        return this.messages.cache.get(this.lastMessageId) ?? null
    }
}
