/**
 * Random cheeky messages for email sending animation phases
 */

export const emailMessages = {
  preparation: [
    "📝 Gathering your documents...",
    "📋 Organizing the paperwork...",
    "🗂️ Assembling contract package...",
    "📄 Collecting all the important bits...",
    "🎯 Preparing your winning offer...",
    "📑 Dotting the i's and crossing the t's...",
    "✨ Making everything perfect...",
    "🏡 Getting your dream home ready..."
  ],

  packaging: [
    "📦 Carefully packaging your offer...",
    "🎀 Adding the finishing touches...",
    "✉️ Sealing with care...",
    "🔏 Securing the documents...",
    "📮 Wrapping it up with a bow...",
    "💝 Sealing the deal (literally)...",
    "🎁 Adding that professional touch...",
    "🌟 Making it shine...",
    "💼 Putting on the final polish..."
  ],

  addressing: [
    "🏷️ Addressing to the listing agent...",
    "📬 Preparing for express delivery...",
    "🚀 Getting ready for takeoff...",
    "✈️ Calculating flight path...",
    "📍 Setting destination coordinates...",
    "🗺️ Plotting the quickest route...",
    "🎯 Locking onto target...",
    "📡 Establishing connection...",
    "🛫 Cleared for departure..."
  ],

  delivery: [
    "✈️ Off it goes! Safe travels!",
    "🚁 Express delivery activated!",
    "🕊️ Your offer is soaring to its destination!",
    "📨 Successfully dispatched!",
    "🎯 En route to close the deal!",
    "🚀 3... 2... 1... Liftoff!",
    "💌 Special delivery coming right up!",
    "⚡ Your offer is breaking the sound barrier!",
    "🌈 Riding the rainbow to success!",
    "🎪 And away we go!",
    "🦅 Flying high with your dreams!",
    "💫 Shooting for the stars!"
  ],

  error: [
    "😅 Oops! The envelope got stuck...",
    "🤔 Hmm, seems like a paper jam...",
    "📪 Return to sender - let's try again!",
    "🔧 Just needs a little adjustment...",
    "🌧️ Weather delay - but we'll get through!",
    "🗺️ Recalculating route...",
    "💨 Hit some turbulence, trying again..."
  ]
};

/**
 * Get a random message for a specific phase
 * @param {keyof emailMessages} phase - The animation phase
 * @returns {string} Random message for that phase
 */
export function getRandomMessage(phase) {
  const messages = emailMessages[phase];
  if (!messages || messages.length === 0) {
    return "Processing...";
  }
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get a sequence of messages for all phases
 * @returns {Object} Object with one random message per phase
 */
export function getMessageSequence() {
  return {
    preparation: getRandomMessage('preparation'),
    packaging: getRandomMessage('packaging'),
    addressing: getRandomMessage('addressing'),
    delivery: getRandomMessage('delivery')
  };
}