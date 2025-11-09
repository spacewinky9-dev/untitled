import { NodeDefinition } from '../types/node-types'

export const OUTPUT_COMMUNICATION_DEFINITIONS: NodeDefinition[] = [
  {
    id: 'send_alert',
    type: 'action',
    category: 'output',
    label: 'Send Alert',
    description: 'Display pop-up alert in terminal',
    icon: 'Bell',
    color: '#FFEB3B',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'message', label: 'Message', type: 'string' },
      { id: 'title', label: 'Title', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' }
    ],
    defaultParams: {
      message: 'Alert!',
      title: 'ForexFlow'
    }
  },
  {
    id: 'send_email',
    type: 'action',
    category: 'output',
    label: 'Send Email',
    description: 'Send email notification via SMTP',
    icon: 'Envelope',
    color: '#FFEB3B',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'to', label: 'To', type: 'string' },
      { id: 'subject', label: 'Subject', type: 'string' },
      { id: 'body', label: 'Body', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'sent', label: 'Sent', type: 'boolean' }
    ],
    defaultParams: {
      subject: 'Trading Alert'
    }
  },
  {
    id: 'send_push_notification',
    type: 'action',
    category: 'output',
    label: 'Send Push Notification',
    description: 'Send push notification to mobile device',
    icon: 'BellRinging',
    color: '#FFEB3B',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'message', label: 'Message', type: 'string' },
      { id: 'title', label: 'Title', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' },
      { id: 'sent', label: 'Sent', type: 'boolean' }
    ],
    defaultParams: {
      message: 'Trading notification',
      title: 'ForexFlow'
    }
  },
  {
    id: 'print_to_log',
    type: 'action',
    category: 'output',
    label: 'Print to Log',
    description: 'Write message to expert log file',
    icon: 'FileText',
    color: '#FFEB3B',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'message', label: 'Message', type: 'string' },
      { id: 'level', label: 'Level', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' }
    ],
    defaultParams: {
      message: 'Log message',
      level: 'info'
    }
  },
  {
    id: 'comment_on_chart',
    type: 'action',
    category: 'output',
    label: 'Comment on Chart',
    description: 'Display text comment in chart corner',
    icon: 'ChatText',
    color: '#FFEB3B',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'text', label: 'Text', type: 'string' },
      { id: 'corner', label: 'Corner', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' }
    ],
    defaultParams: {
      text: 'Comment',
      corner: 'top_left'
    }
  },
  {
    id: 'play_sound',
    type: 'action',
    category: 'output',
    label: 'Play Sound',
    description: 'Play audio alert file',
    icon: 'SpeakerHigh',
    color: '#FFEB3B',
    inputs: [
      { id: 'trigger', label: 'Trigger', type: 'flow' },
      { id: 'filename', label: 'Filename', type: 'string' }
    ],
    outputs: [
      { id: 'success', label: 'Success', type: 'flow' }
    ],
    defaultParams: {
      filename: 'alert.wav'
    }
  }
]
