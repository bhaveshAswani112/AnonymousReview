import {atom} from 'recoil'
import { Message } from '@/model/User'

export const messagesState = atom<Message []>({
    key : 'messageState',
    default : []
    
})