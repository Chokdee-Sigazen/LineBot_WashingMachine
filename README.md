# Washing Machine Line Bot

This Line bot allows users to manage a queue system for washing machine usage. Users can add themselves to the queue, check their position in the queue, and cancel their queue position.

## Features

- Add yourself to the queue system by sending a specific message.
- Check your position in the queue.
- Cancel your queue position.

## Getting Started

To use the Washing Machine Line Bot, follow these steps:

1. **Prerequisites**:

   - Ensure you have a Line Developer account and have created a channel for your bot.
   - Obtain the necessary credentials such as channel access token and channel secret.

2. **Installation**:

   - Clone this repository.
   - Install dependencies by running `npm install`.

3. **Configuration**:

   - Replace `'YOUR_CHANNEL_ACCESS_TOKEN'` and `'YOUR_CHANNEL_SECRET'` with your actual LINE channel access token and secret in the code.

4. **Running the Bot**:

   - Start the bot server by running `npm start`.
   - Deploy the bot to a server that can receive webhook requests from the LINE Messaging API.

5. **Changing Webhook Bot to ngrok host**

6. **Interacting with the Bot**:
   - Add the bot to your LINE friends list.
   - Send the following commands to the bot:
     - "Add me to the queue system" to add yourself to the queue.
     - "Check queue" to check your position in the queue.
     - "Cancel queue" to cancel your position in the queue.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request with any improvements or new features.

## License

This project is licensed under the [MIT License](LICENSE).
