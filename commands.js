const COMMAND_TYPES = {
  SUB_COMMAND: 1,
  SUB_COMMAND_GROUP: 2,
  TEXT_COMMAND: 3,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8,
};

export const COMMAND_NAMES = {
  TEST: "test",
  DEALS: "deals",
  STEAM_DEALS: "show-deals-steam",
  FREE: "free"
};

export const TEST_COMMAND = {
  name: COMMAND_NAMES.TEST,
  description: "Teste die Verbindung zum Bot.",
  type: 1,
};

export const SHOW_DEALS = {
  name: COMMAND_NAMES.DEALS,
  description: "Zeig mir die besten Deals meines Stores an!",
  options: [
    {
      type: COMMAND_TYPES.TEXT_COMMAND,
      name: "platform",
      description: "Store deiner Wahl, zum Beispiel 'steam', 'epic', 'gog'.",
      required: true
    }
  ]
};

export const FREE = {
  name: COMMAND_NAMES.FREE,
  description: "Was gibts kostenloses?",
  type: 1
};
