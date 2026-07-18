import React from 'react';
import { TextField, Button } from '@mui/material';
const DEMO_MESSAGES = [
  { sender: 'Alice', data: 'Hey! Is the WebRTC connection working for you?' },
  { sender: 'Bob', data: 'Yeah, I can see your video clearly now. Super low latency!' },
  { sender: 'Alice', data: 'Awesome! Let’s test the data channel by sending some files.' },
  { sender: 'System', data: 'User "Charlie" has joined the room.' }
];
export default function ChatPanel() {
    let messages = DEMO_MESSAGES;
  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 border border-gray-200 ml-2 rounded-lg">
      <div className="flex flex-col justify-end ">
        <h1 className="text-xl font-bold mb-4 text-gray-800">Chat</h1>

        {/* Message History Display */}
        <div className="flex-1 overflow-y-auto mb-4 p-2 bg-white rounded border border-gray-100 max-h-[400px]">
          {messages.length !== 0 ? (
            messages.map((item, index) => (
              <div className="mb-4" key={index}>
                <p className="font-bold text-sm text-gray-700">{item.sender}</p>
                <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded mt-1 inline-block">
                  {item.data}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center mt-4">No Messages Yet</p>
          )}
        </div>

        {/* Input Control Area */}
        <div className="flex gap-2 items-center">
          <TextField
            // value={message}
            // onChange={onMessageChange}
            label="Enter Your chat"
            variant="outlined"
            size="small"
            className="flex-1"
          />
           <Button 
            variant="contained" 
            // onClick={onSend}
            className="bg-blue-600 hover:bg-blue-700 normal-case"
          >
            Send
          </Button>
        </div> 
      </div>
    </div>
  );
}
